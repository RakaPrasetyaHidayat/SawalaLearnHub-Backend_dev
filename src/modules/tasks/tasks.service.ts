import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { CreateTaskDto, SubmitTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskStatus, SubmissionStatus, UserRole } from '../../common/enums/database.enum';
import { PaginationParams } from '../../common/utils/api.utils';
import { SupabaseService } from '../../infra/supabase/supabase.service';

interface Division {
  id: string;
  name: string;
}

// Supabase may return relation fields as arrays (e.g. division: Division[]) or single object depending on join
interface TaskWithDivision {
  id: string;
  title: string;
  description: string;
  deadline: string;
  channel_year: number;
  division: Division | Division[] | null;
}

@Injectable()
export class TasksService extends BaseService {
  constructor(protected readonly supabaseService: SupabaseService) {
    super(supabaseService);
  }

  async createTask(createTaskDto: CreateTaskDto, adminId: string, file?: Express.Multer.File, accessToken?: string) {
    try {
      console.debug('[TasksService.createTask] payload:', { createTaskDto, adminId, hasFile: !!file });
      // Verify admin role
      const { data: admin, error: adminErr } = await this.supabaseService
        .getClient()
        .from('users')
        .select('role')
        .eq('id', adminId)
        .single();

      if (adminErr) throw adminErr;
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new UnauthorizedException('Only admins can create tasks');
      }

      let fileUrl: string | null = null;

      if (file && file.buffer) {
        // Use token-bound client if provided (to respect RLS for storage)
        const client = accessToken
          ? this.supabaseService.getClientWithAuth(accessToken)
          : this.supabaseService.getClient(true); // use admin if no token

        const filePath = `task-files/${Date.now()}-${file.originalname}`;
        const { data: uploadData, error: uploadErr } = await client.storage
          .from('task-files')
          .upload(filePath, file.buffer, { contentType: file.mimetype });

        if (uploadErr) {
          // fallback: try admin client
          const adminClient = this.supabaseService.getClient(true);
          const { data: uploadData2, error: uploadErr2 } = await adminClient.storage
            .from('task-files')
            .upload(filePath, file.buffer, { contentType: file.mimetype });
          if (uploadErr2) throw uploadErr2;
          fileUrl = adminClient.storage.from('task-files').getPublicUrl(uploadData2.path).data.publicUrl;
        } else {
          fileUrl = client.storage.from('task-files').getPublicUrl(uploadData.path).data.publicUrl;
        }
      }

  // Get division ID from the provided division name or division_id
  let resolvedDivisionId: string | null = null;
  // Prefer explicit UUID if provided; otherwise accept division name passed in `division` or `division_id` fields
  const rawDivisionInput = String((createTaskDto as any).division || createTaskDto.division_id || '').trim();

      // Fetch all divisions and attempt a local tolerant match first
      const { data: allDivisions, error: allDivErr } = await this.supabaseService
        .getClient(true)
        .from('divisions')
        .select('id,name');
      if (allDivErr) throw allDivErr;

      const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();
      const inputNorm = normalize(rawDivisionInput);

      if (allDivisions && allDivisions.length > 0) {
        const exactMatches = allDivisions.filter(d => normalize(d.name) === inputNorm);
        if (exactMatches.length === 1) {
          resolvedDivisionId = exactMatches[0].id;
        } else if (exactMatches.length > 1) {
          // ambiguous
          throw new BadRequestException('Multiple divisions matched the provided division name; please provide a division UUID');
        } else {
          // fallback: try case-insensitive direct match on name
          const ciMatches = allDivisions.filter(d => (d.name || '').toLowerCase() === rawDivisionInput.toLowerCase());
          if (ciMatches.length === 1) resolvedDivisionId = ciMatches[0].id;
        }
      }

      // If still not resolved, fall back to DB ilike search
      if (!resolvedDivisionId) {
        const { data: divisions2, error: divErr2 } = await this.supabaseService
          .getClient(true)
          .from('divisions')
          .select('id,name')
          .ilike('name', `%${rawDivisionInput}%`);
        if (divErr2) throw divErr2;
        if (!divisions2 || divisions2.length === 0) {
          throw new BadRequestException(`Invalid division name. Must be one of: BACKEND, FRONTEND, UI_UX, DEVOPS`);
        }
        if (divisions2.length > 1) {
          throw new BadRequestException('Multiple divisions matched the provided division name; please provide a division UUID');
        }
        resolvedDivisionId = divisions2[0].id;
      }

      // Insert directly into `tasks` table instead of relying on a DB RPC
      const taskPayload: any = {
        title: createTaskDto.title,
        description: createTaskDto.description + (fileUrl ? `\nFile: ${fileUrl}` : ''),
        deadline: createTaskDto.deadline,
        // prefer channel_year property; fall back to angkatan for older clients
        channel_year: typeof (createTaskDto as any).channel_year !== 'undefined'
          ? Number((createTaskDto as any).channel_year)
          : (createTaskDto.angkatan ? Number(createTaskDto.angkatan) : null),
        created_by: adminId,
        division_id: resolvedDivisionId,
        // store file url(s) as text (varchar) to match DB schema; join multiple with newline
        file_urls: fileUrl ? fileUrl : null,
        // default task status stored in 'status' (submission_status enum) column on tasks table
        status: SubmissionStatus.ON_PROGRES,
      };

      // Use admin (service-role) client for insertion to bypass RLS for server-side admin actions
      const adminClient = this.supabaseService.getClient(true);
      const { data: created, error: insertErr } = await adminClient
        .from('tasks')
        .insert(taskPayload)
        .select()
        .single();

      if (insertErr) throw insertErr;
      console.debug('[TasksService.createTask] created task:', created);

      return {
        status: 'success',
        message: 'Task created successfully',
        data: created,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async submitTask(taskId: string, userId: string, submitTaskDto: Partial<SubmitTaskDto> = {}, file?: Express.Multer.File) {
    try {
      console.log('[TasksService.submitTask] Starting submission:', { taskId, userId, submitTaskDto, hasFile: !!file });
      
      // Accept either UUID or readable identifier (title). Resolve to UUID when necessary
      const resolvedTaskId = await this.resolveTaskId(taskId);
      console.log('[TasksService.submitTask] Resolved task ID:', resolvedTaskId);

      const adminClient = this.supabaseService.getClient(true);

      // Check if user has already submitted this task
      const { data: existingSubmission, error: existingErr } = await adminClient
        .from('task_submissions')
        .select('id, submission_status, created_at')
        .eq('task_id', resolvedTaskId)
        .eq('user_id', userId)
        .single();

      if (existingErr && existingErr.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is what we want
        console.error('[TasksService.submitTask] Error checking existing submission:', existingErr);
        throw existingErr;
      }

      if (existingSubmission) {
        console.log('[TasksService.submitTask] Found existing submission:', existingSubmission);
        throw new BadRequestException(
          `You have already submitted this task on ${new Date(existingSubmission.created_at).toLocaleDateString()}. ` +
          `Current status: ${existingSubmission.submission_status}. Each task can only be submitted once.`
        );
      }

      console.log('[TasksService.submitTask] No existing submission found, proceeding with new submission');

      // Check task deadline to determine submission status
      let fileUrl: string | null = null;
      if (file && file.buffer) {
        const filePath = `submission-files/${Date.now()}-${file.originalname}`;
        const { data: uploadData, error: uploadErr } = await adminClient.storage
          .from('submission-files')
          .upload(filePath, file.buffer, { contentType: file.mimetype });
        if (uploadErr) {
          console.error('[TasksService.submitTask] File upload error:', uploadErr);
          throw uploadErr;
        }
        fileUrl = adminClient.storage.from('submission-files').getPublicUrl(uploadData.path).data.publicUrl;
        console.log('[TasksService.submitTask] File uploaded:', fileUrl);
      }
      
      const { data: task, error: taskErr } = await adminClient
        .from('tasks')
        .select('id,deadline,title,status')
        .eq('id', resolvedTaskId)
        .single();
      if (taskErr) {
        console.error('[TasksService.submitTask] Task fetch error:', taskErr);

        // If task not found, provide more helpful error message
        if (taskErr.code === 'PGRST116') {
          // Get available tasks for debugging
          const { data: availableTasks } = await adminClient
            .from('tasks')
            .select('id,title')
            .limit(5);

          const availableTasksInfo = availableTasks
            ? availableTasks.map(t => `${t.id} (${t.title})`).join(', ')
            : 'No tasks found';

          throw new NotFoundException(
            `Task with ID '${resolvedTaskId}' not found. Available tasks: ${availableTasksInfo}`
          );
        }
        throw taskErr;
      }
      console.log('[TasksService.submitTask] Task found:', task);

      // Check if task is already approved by admin
      if (task.status === SubmissionStatus.APPROVED) {
        throw new BadRequestException(
          `This task has been approved by admin and is no longer accepting submissions.`
        );
      }

      const now = Date.now();
      let isOverdue = false;
      if (task && task.deadline) {
        const dl = new Date(task.deadline).getTime();
        if (!isNaN(dl) && now > dl) isOverdue = true;
      }

      // Build submission content and handle new fields
      let content = submitTaskDto.submission_content || '';
      if (fileUrl) content += '\nFile: ' + fileUrl;
      
      // Handle file_url from DTO (if provided directly)
      let allFileUrls: string[] = [];
      if (fileUrl) allFileUrls.push(fileUrl);
      if (submitTaskDto.file_url) {
        allFileUrls.push(submitTaskDto.file_url);
        if (!content.includes(submitTaskDto.file_url)) {
          content += '\nFile: ' + submitTaskDto.file_url;
        }
      }
      
      // Use description from DTO if provided, otherwise use submission_content
      const description = submitTaskDto.description || content || '';
      
      // Validate that at least one form of submission is provided
      if (!description && allFileUrls.length === 0) {
        throw new BadRequestException(
          'Submission must include at least one of the following: description, file upload, or file URL'
        );
      }
      
      console.log('[TasksService.submitTask] Submission content:', content);
      console.log('[TasksService.submitTask] Description:', description);
      console.log('[TasksService.submitTask] File URLs:', allFileUrls);
      console.log('[TasksService.submitTask] Is overdue:', isOverdue);

      if (isOverdue) {
        // Insert directly with OVERDUE status
        const payload = {
          task_id: resolvedTaskId,
          user_id: userId,
          description: description,
          submission_status: SubmissionStatus.OVERDUE,
          file_urls: allFileUrls.length > 0 ? allFileUrls.join('\n') : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any;

        console.log('[TasksService.submitTask] Inserting OVERDUE payload:', payload);
        const { data: inserted, error: insertErr } = await adminClient
          .from('task_submissions')
          .insert(payload)
          .select('id, task_id, user_id, description, submission_status, file_urls, created_at, updated_at')
          .single();
        if (insertErr) {
          console.error('[TasksService.submitTask] Insert error (OVERDUE):', insertErr);
          throw insertErr;
        }
        console.log('[TasksService.submitTask] Successfully inserted (OVERDUE):', inserted);

        return {
          status: 'success',
          message: 'Task submitted (OVERDUE)',
          data: inserted,
        };
      }

     // Not overdue: insert directly with SUBMITTED status
     const payload = {
       task_id: resolvedTaskId,
       user_id: userId,
       description: description,
       submission_status: SubmissionStatus.SUBMITTED,
       file_urls: allFileUrls.length > 0 ? allFileUrls.join('\n') : null,
       created_at: new Date().toISOString(),
       updated_at: new Date().toISOString(),
     } as any;

     console.log('[TasksService.submitTask] Inserting SUBMITTED payload:', payload);
     const { data: inserted, error: insertErr } = await adminClient
       .from('task_submissions')
       .insert(payload)
       .select('id, task_id, user_id, description, submission_status, file_urls, created_at, updated_at')
       .single();
     if (insertErr) {
       console.error('[TasksService.submitTask] Insert error (SUBMITTED):', insertErr);
       throw insertErr;
     }
     console.log('[TasksService.submitTask] Successfully inserted (SUBMITTED):', inserted);

     return {
       status: 'success',
       message: 'Task submitted successfully',
       data: inserted
     };
    } catch (error) {
      console.error('[TasksService.submitTask] Error occurred:', error);
      if (error.message && error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message || 'Failed to submit task');
    }
  }

  /**
   * Flexible submitter: allows submitting without path taskId.
   * Priority:
   * 1) dto.task_id (UUID)
   * 2) dto.task_identifier (readable title)
   * 3) Auto-select latest eligible task for user's division/year that hasn't been submitted yet
   */
  async submitTaskFlexible(userId: string, dto: Partial<SubmitTaskDto> = {}, file?: Express.Multer.File) {
    try {
  const taskIdentifier = ((dto && (dto.task_id || dto.task_identifier)) || '').toString().trim();
      if (taskIdentifier) {
        return this.submitTask(taskIdentifier, userId, dto, file);
      }

      const adminClient = this.supabaseService.getClient(true);

      // Get user's division/year to scope tasks
      const { data: user, error: userErr } = await adminClient
        .from('users')
        .select('id, division_id, channel_year')
        .eq('id', userId)
        .single();
      if (userErr) throw userErr;
      if (!user || !user.division_id) {
        throw new BadRequestException('User division is not set; cannot auto-select task');
      }

      // Already submitted tasks by this user
      const { data: submitted, error: subErr } = await adminClient
        .from('task_submissions')
        .select('task_id')
        .eq('user_id', userId);
      if (subErr) throw subErr;
      const submittedSet = new Set((submitted || []).map((s: any) => s.task_id));

      // Resolve user's division_id to UUID when necessary (user.division_id may be a name)
      let resolvedDivisionForQuery = user.division_id;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(String(resolvedDivisionForQuery))) {
        // try to find by exact name first, then fuzzy
        const { data: divsExact, error: divErr } = await adminClient
          .from('divisions')
          .select('id,name')
          .eq('name', String(resolvedDivisionForQuery));
        if (!divErr && divsExact && divsExact.length === 1) {
          resolvedDivisionForQuery = divsExact[0].id;
        } else {
          const { data: divsF, error: divErr2 } = await adminClient
            .from('divisions')
            .select('id,name')
            .ilike('name', `%${String(resolvedDivisionForQuery)}%`);
          if (!divErr2 && divsF && divsF.length === 1) resolvedDivisionForQuery = divsF[0].id;
        }
      }

      // Fetch latest tasks for user's division (and year when available)
      const { data: tasks, error: tasksErr } = await adminClient
        .from('tasks')
        .select('id, created_at, deadline, division_id, channel_year')
        .eq('division_id', resolvedDivisionForQuery)
        .order('created_at', { ascending: false })
        .limit(50);
      if (tasksErr) throw tasksErr;

      const nowIso = new Date().toISOString();

      // Prefer tasks matching user's channel_year when provided
      let candidates = (tasks || []).filter((t: any) =>
        (user.channel_year ? t.channel_year === user.channel_year : true)
      );

      // Exclude already submitted
      candidates = candidates.filter((t: any) => !submittedSet.has(t.id));

      // Prefer non-expired deadline; fallback to any if none
      let pick = candidates.find((t: any) => !t.deadline || t.deadline >= nowIso) || candidates[0];

      // If none found, widen search ignoring year
      if (!pick) {
        const wide = (tasks || []).filter((t: any) => !submittedSet.has(t.id));
        pick = wide.find((t: any) => !t.deadline || t.deadline >= nowIso) || wide[0];
      }

      if (!pick) {
        throw new NotFoundException('No available tasks to submit for your division/year');
      }

  return this.submitTask(pick.id, userId, dto, file);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateTaskStatus(
    taskId: string,
    userId: string,
    adminId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    try {
      // Use admin client to bypass RLS for admin actions
      const adminClient = this.supabaseService.getClient(true);

      // First get the submission ID
      const { data: submission, error: subErr } = await adminClient
        .from('task_submissions')
        .select('id')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .single();

      if (subErr) throw subErr;
      if (!submission) {
        throw new NotFoundException('Task submission not found');
      }

      // Update submission directly without feedback column
      const { data: result, error: updateErr } = await adminClient
        .from('task_submissions')
        .update({ submission_status: updateTaskDto.status, updated_at: new Date().toISOString() })
        .eq('id', submission.id)
        .select()
        .single();
      if (updateErr) throw updateErr;

      return {
        status: 'success',
        message: 'Task submission reviewed successfully',
        data: result
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Flexible updater: accepts task identifier and user identifier which can be UUIDs
   * or searchable strings (title/email/full_name). Resolves to IDs then calls updateTaskStatus.
   */
  async updateTaskStatusFlexible(
    taskIdentifier: string,
    userIdentifier: string,
    adminId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    // resolve identifiers to UUIDs when necessary
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let taskId = taskIdentifier;
    let userId = userIdentifier;

    const adminClient = this.supabaseService.getClient(true);

    // Resolve task
    if (!uuidRegex.test(taskId)) {
      // try exact title match (case-insensitive), then ilike
      const { data: tasksExact, error: tErr } = await adminClient
        .from('tasks')
        .select('id,title')
        .ilike('title', taskIdentifier);
      if (tErr) throw tErr;
      if (tasksExact && tasksExact.length === 1) {
        taskId = tasksExact[0].id;
      } else if (tasksExact && tasksExact.length > 1) {
        throw new BadRequestException('Multiple tasks matched the provided task identifier; please provide a task UUID');
      } else {
        throw new NotFoundException('Task not found by identifier');
      }
    }

    // Resolve user
    if (!uuidRegex.test(userId)) {
      // try email exact, then full_name ilike
      const { data: usersByEmail, error: uErr } = await adminClient
        .from('users')
        .select('id,email,full_name')
        .or(`email.eq.${userIdentifier},email.ilike.%${userIdentifier}%`);
      if (uErr) throw uErr;
      if (usersByEmail && usersByEmail.length === 1) {
        userId = usersByEmail[0].id;
      } else {
        // try full_name fuzzy
        const { data: usersByName, error: uErr2 } = await adminClient
          .from('users')
          .select('id,email,full_name')
          .ilike('full_name', `%${userIdentifier}%`);
        if (uErr2) throw uErr2;
        if (usersByName && usersByName.length === 1) {
          userId = usersByName[0].id;
        } else if ((usersByName && usersByName.length > 1) || (usersByEmail && usersByEmail.length > 1)) {
          throw new BadRequestException('Multiple users matched the provided user identifier; please provide a user UUID or unique email');
        } else {
          throw new NotFoundException('User not found by identifier');
        }
      }
    }

    // delegate to updateTaskStatus with resolved UUIDs
    return this.updateTaskStatus(taskId, userId, adminId, updateTaskDto);
  }

  /**
   * Resolve a task identifier which may be a UUID or a readable title to a UUID
   */
  async resolveTaskId(taskIdentifier: string) {
    const dashedUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const compactUuid = /^[0-9a-f]{32}$/i;
    if (dashedUuid.test(taskIdentifier)) return taskIdentifier;
    if (compactUuid.test(taskIdentifier)) {
      const s = taskIdentifier;
      return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;
    }

    const adminClient = this.supabaseService.getClient(true);
    // try exact title match (case-insensitive)
    const { data: tasksExact, error: tErr } = await adminClient
      .from('tasks')
      .select('id,title')
      .ilike('title', taskIdentifier);
    if (tErr) throw tErr;
    if (tasksExact && tasksExact.length === 1) return tasksExact[0].id;

    // try ilike fuzzy match
    const { data: tasksFuzzy, error: tfErr } = await adminClient
      .from('tasks')
      .select('id,title')
      .ilike('title', `%${taskIdentifier}%`);
    if (tfErr) throw tfErr;
    if (tasksFuzzy && tasksFuzzy.length === 1) return tasksFuzzy[0].id;

    throw new NotFoundException('Task not found by identifier');
  }

  async getTasksByYear(year: string) {
    try {
      const result = await this.callRpc('get_tasks_by_year', {
        p_year: year
      });

      return {
        status: 'success',
        data: result
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserTasks(userId: string) {
    try {
      const result = await this.callRpc('get_user_tasks', {
        p_user_id: userId
      });

      return {
        status: 'success',
        data: result
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Direct JSON submission handler used by POST /task/submit
   * Accepts task_id, user_id, submission_content and inserts into task_submissions
   * Sets submission_status to OVERDUE if deadline passed, otherwise SUBMITTED (default)
   */
  async submitTaskDirect(taskId: string, userId: string, description: string, fileUrls: string[] = []) {
    const adminClient = this.supabaseService.getClient(true);

    // Prevent double submission
    const { data: existing, error: existingErr } = await adminClient
      .from('task_submissions')
      .select('id, submission_status')
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .single();
    if (existingErr && existingErr.code !== 'PGRST116') throw existingErr;
    if (existing) throw new BadRequestException('Task already submitted by this user');

    // Resolve task and check deadline
    const { data: task, error: taskErr } = await adminClient
      .from('tasks')
      .select('id,deadline')
      .eq('id', taskId)
      .single();
    if (taskErr) throw taskErr;
    if (!task) throw new NotFoundException('Task not found');

    const now = Date.now();
    let isOverdue = false;
    if (task.deadline) {
      const dl = new Date(task.deadline).getTime();
      if (!isNaN(dl) && now > dl) isOverdue = true;
    }

    const payload: any = {
      task_id: taskId,
      user_id: userId,
      description,
      file_urls: fileUrls.length ? fileUrls.join('\n') : null,
      submission_status: isOverdue ? SubmissionStatus.OVERDUE : SubmissionStatus.SUBMITTED,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: inserted, error: insertErr } = await adminClient
      .from('task_submissions')
      .insert(payload)
      .select(
        'id, task_id, user_id, description, file_urls, submission_status, created_at, updated_at'
      )
      .single();
    if (insertErr) throw insertErr;
    return inserted;
  }

  // Get a user's submission (if any) for a specific task
  async getUserSubmission(taskId: string, userId: string) {
    try {
      console.log('[TasksService.getUserSubmission] fetch for', { taskId, userId });
      const adminClient = this.supabaseService.getClient(true);
      const { data: submission, error } = await adminClient
        .from('task_submissions')
        .select('id, task_id, user_id, description, submission_status, file_urls, created_at, updated_at')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .single();
      if (error) {
        console.log('[TasksService.getUserSubmission] supabase error:', error);
        if (error.code === 'PGRST116') {
          // no submission found
          throw new NotFoundException(`No submission found for task '${taskId}' and user '${userId}'`);
        }
        throw error;
      }
      console.log('[TasksService.getUserSubmission] found submission:', submission);
      return { status: 'success', data: submission };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch submission');
    }
  }

  async getAvailableTasks() {
    try {
      const { data: tasks, error } = await this.supabaseService
        .getClient()
        .from('tasks')
        .select(`
          id,
          title,
          description,
          deadline,
          channel_year,
          division:divisions!inner(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the response to be frontend-friendly
      const formattedTasks = (tasks as TaskWithDivision[]).map(task => {
        // division can be an array when using joins, normalize to first item's name
        let divisionName: string | null = null;
        if (Array.isArray(task.division)) {
          divisionName = task.division.length ? (task.division[0] as Division).name : null;
        } else if (task.division) {
          divisionName = (task.division as Division).name;
        }

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          deadline: task.deadline,
          channel_year: task.channel_year,
          division: divisionName
        };
      });

      return {
        status: 'success',
        message: 'Available tasks retrieved successfully',
        data: formattedTasks
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async debugListTasks() {
    try {
      const adminClient = this.supabaseService.getClient(true);
      const { data: tasks, error } = await adminClient
        .from('tasks')
        .select('id, title, created_at, deadline')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      return {
        status: 'success',
        message: 'Debug: All tasks with their IDs',
        data: tasks
      };
    } catch (error) {
      console.error('[TasksService.debugListTasks] Error:', error);
      throw new BadRequestException(error.message || 'Failed to list tasks');
    }
  }

  /**
   * Get task submission by submission ID
   * Returns submission details including task description and file URLs
   */
  async getTaskSubmissionById(submissionId: string) {
    try {
      console.log('[TasksService.getTaskSubmissionById] Getting submission:', submissionId);
      
      const adminClient = this.supabaseService.getClient(true);
      
      // Return only the submission row from task_submissions (avoid joins)
      const { data: submission, error } = await adminClient
        .from('task_submissions')
        .select('id, task_id, user_id, description, submission_status, file_urls, created_at, updated_at')
        .eq('id', submissionId)
        .single();

      if (error) {
        console.error('[TasksService.getTaskSubmissionById] Error:', error);
        if (error.code === 'PGRST116') {
          throw new NotFoundException(`Task submission with ID '${submissionId}' not found`);
        }
        throw error;
      }

      console.log('[TasksService.getTaskSubmissionById] Found submission:', submission);
      return {
        status: 'success',
        message: 'Task submission retrieved successfully',
        data: submission
      };
    } catch (error) {
      console.error('[TasksService.getTaskSubmissionById] Error occurred:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to get task submission');
    }
  }

  // Admin: return all submissions for a given task
  async getAllSubmissionsForTask(taskId: string) {
    try {
      const adminClient = this.supabaseService.getClient(true);
      const { data, error } = await adminClient
        .from('task_submissions')
        .select('id, task_id, user_id, description, submission_status, file_urls, created_at, updated_at')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { status: 'success', data };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to list submissions');
    }
  }

  // Admin: update single submission status (taskId + userId)
  async updateTaskSubmissionStatus(taskId: string, userId: string, adminId: string, updateTaskDto: UpdateTaskDto) {
    try {
      // ensure admin
      const adminClient = this.supabaseService.getClient();
      const { data: admin, error: adminErr } = await adminClient.from('users').select('role').eq('id', adminId).single();
      if (adminErr || !admin || admin.role !== UserRole.ADMIN) throw new UnauthorizedException('Only admins can update submission status');

      // Normalize potential 32-hex to dashed UUID for userId
      const normalizeUuid = (id: string) => {
        const compact = id?.trim();
        if (/^[0-9a-f]{32}$/i.test(compact)) {
          return `${compact.slice(0,8)}-${compact.slice(8,12)}-${compact.slice(12,16)}-${compact.slice(16,20)}-${compact.slice(20)}`;
        }
        return compact;
      };
      const normalizedUserId = normalizeUuid(userId);

      // find the most recent submission in case there are duplicates
      const client = this.supabaseService.getClient(true);
      const { data: submissions, error: subErr } = await client
        .from('task_submissions')
        .select('id, created_at')
        .eq('task_id', taskId)
        .eq('user_id', normalizedUserId)
        .order('created_at', { ascending: false })
        .limit(1);
      if (subErr) throw subErr;
      const submission = Array.isArray(submissions) ? submissions[0] : submissions;

      // If no submission exists, create one with requested status (admin override)
      if (!submission) {
        const { data: inserted, error: insertErr } = await client
          .from('task_submissions')
          .insert({
            task_id: taskId,
            user_id: normalizedUserId,
            description: updateTaskDto.feedback || '',
            submission_status: updateTaskDto.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        if (insertErr) throw insertErr;
        return inserted;
      }

      const { data: updated, error: updateErr } = await client
        .from('task_submissions')
        .update({ submission_status: updateTaskDto.status, updated_at: new Date().toISOString() })
        .eq('id', submission.id)
        .select()
        .single();
      if (updateErr) throw updateErr;
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) throw error;
      throw new BadRequestException(error.message || 'Failed to update submission status');
    }
  }

  /**
   * Preview which task-user submission rows would be affected by filters.
   */
  async batchPreview(filters: any) {
    const adminClient = this.supabaseService.getClient(true);

    // Build base query on task_submissions joined with tasks and users
  let query = adminClient.from('task_submissions').select('task_id,user_id', { count: 'exact' });

    // Apply filters
    if (filters?.task_ids && filters.task_ids.length) query = query.in('task_id', filters.task_ids);
    if (filters?.user_ids && filters.user_ids.length) query = query.in('user_id', filters.user_ids);
  // support both `status` and `submission_status` filter keys
  if (filters?.status) query = query.eq('submission_status', filters.status);
  if (filters?.submission_status) query = query.eq('submission_status', filters.submission_status);
    if (filters?.due_date_before) query = query.lte('created_at', filters.due_date_before);
    if (filters?.assigned_after) query = query.gte('created_at', filters.assigned_after);

    const { data, count, error } = await query;
    if (error) throw error;
    return { affected_count: count || 0, rows: data || [] };
  }

  /**
   * Perform batch status update for task_submissions based on filters
   */
  async batchUpdateStatus(filters: any, new_status: string, update_reason?: string, adminId?: string) {
    const adminClient = this.supabaseService.getClient(true);

    // Get affected rows first
    const preview = await this.batchPreview(filters);
    const rows = preview.rows || [];
    if (!rows.length) return { updated_count: 0 };

    // Build update payload
    const updates = rows.map(r => ({ task_id: r.task_id, user_id: r.user_id }));

    // Update in chunks to avoid long SQL
    const chunkSize = 200;
    let updated = 0;
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      // Update where (task_id, user_id) in (...) via OR chain
  let builder = adminClient.from('task_submissions').update({ submission_status: new_status, updated_at: new Date().toISOString() });
      // Build filters
      const ors = chunk.map((c, idx) => `task_id.eq.${c.task_id},user_id.eq.${c.user_id}`).join(',');
      builder = builder.or(ors);
      const { data, error } = await builder;
      if (error) throw error;
      updated += (data || []).length;
    }

    return { updated_count: updated };
  }

  async findTaskById(taskId: string) {
    try {
      // Use admin client and avoid .single() to prevent PostgREST coercion errors
      const adminClient = this.supabaseService.getClient(true);

      // Get task details
      const { data: task, error: taskError } = await adminClient
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .limit(1);
      if (taskError) throw taskError;

      const taskResult = Array.isArray(task) ? task[0] : task;
      if (!taskResult) {
        throw new NotFoundException('Task not found');
      }

      // Get submissions with user data
      const { data: submissions, error: submissionsError } = await adminClient
        .from('task_submissions')
        .select(`
          id,
          user_id,
          description,
          submission_status,
          file_urls,
          created_at,
          updated_at,
          users!inner(
            id,
            full_name,
            email,
            division_id,
            school_name,
            channel_year
          )
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      const normalizedSubmissions = (submissions || []).map((submission: any) => {
        const { users: submissionUser, ...submissionData } = submission || {};

        const userProfile = submissionUser
          ? {
              id: submissionUser.id,
              full_name: submissionUser.full_name,
              email: submissionUser.email,
              division_id: submissionUser.division_id,
              school_name: submissionUser.school_name,
              channel_year: submissionUser.channel_year
            }
          : null;

        return {
          ...submissionData,
          user: userProfile
        };
      });

      return {
        status: 'success',
        data: {
          ...taskResult,
          submissions: normalizedSubmissions
        }
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  async updateTaskOverallStatus(taskId: string, newStatus: SubmissionStatus, adminId: string) {
    try {
      // Verify admin role
      const adminClient = this.supabaseService.getClient(true);
      const { data: admin, error: adminErr } = await adminClient
        .from('users')
        .select('role')
        .eq('id', adminId)
        .single();

      if (adminErr) throw adminErr;
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new UnauthorizedException('Only admins can update task status');
      }

      // Update task status
      const { data, error } = await adminClient
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      return {
        status: 'success',
        message: `Task status updated to ${newStatus}`,
        data
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update task status');
    }
  }

  async deleteTask(taskId: string) {
    try {
      const adminClient = this.supabaseService.getClient(true);
      // Clean up related submissions first (if FK is not cascading)
      await adminClient.from('task_submissions').delete().eq('task_id', taskId);
      const { error } = await adminClient.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      return { status: 'success', message: 'Task deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to delete task');
    }
  }

  // Get all tasks with optional filter by division and year
  async getAllTasks(query: any, accessToken?: string) {
    const client = accessToken
      ? this.supabaseService.getClientWithAuth(accessToken)
      : this.supabaseService.getClient();

    const { year, search, page = 1, limit = 10 } = query || {};

  let builder = client.from('tasks').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    // normalize query.division_id: accept UUID or division name (resolve to UUID)
    let resolvedQueryDivisionId: string | undefined;
    if (query?.division_id) {
      const maybe = String(query.division_id).trim();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(maybe)) {
        resolvedQueryDivisionId = maybe;
      } else {
        // try exact uppercase enum name match first
        const lookup = maybe.toUpperCase();
        const { data: divisions, error: divErr } = await this.supabaseService
          .getClient(true)
          .from('divisions')
          .select('id,name')
          .eq('name', lookup);
        if (divErr) throw divErr;
        if (divisions && divisions.length === 1) {
          resolvedQueryDivisionId = divisions[0].id;
        } else {
          // fallback fuzzy
          const { data: divisions2, error: divErr2 } = await this.supabaseService
            .getClient(true)
            .from('divisions')
            .select('id,name')
            .ilike('name', `%${maybe}%`);
          if (divErr2) throw divErr2;
          if (divisions2 && divisions2.length === 1) resolvedQueryDivisionId = divisions2[0].id;
          else if (divisions2 && divisions2.length > 1) throw new BadRequestException('Multiple divisions matched the provided division name; please provide a division UUID');
          else throw new BadRequestException('Division not found');
        }
      }
      builder = builder.eq('division_id', resolvedQueryDivisionId);
    }

    if (year) {
      const y = parseInt(String(year), 10);
      if (!isNaN(y)) builder = builder.eq('channel_year', y);
      else builder = builder.eq('channel_year', year as any);
    }

    if (search) {
      const q = `%${search}%`;
      builder = builder.or(`title.ilike.${q},description.ilike.${q}`);
    }

    const from = (page - 1) * limit;
    const to = page * limit - 1;

    try {
      const { data: tasks, count, error } = await builder.range(from, to);
      if (error) throw error;
      return { tasks: tasks ?? [], total: count || 0, page, limit };
    } catch (e: any) {
      const msg = (e && e.message) || e?.toString?.() || '';
      if (msg.includes('role "') && msg.includes('does not exist')) {
        const adminClient = this.supabaseService.getClient(true);
        let adminBuilder = adminClient.from('tasks').select('*', { count: 'exact' }).order('created_at', { ascending: false });
  if (query?.division_id) adminBuilder = adminBuilder.eq('division_id', resolvedQueryDivisionId || query.division_id);
        if (year) {
          const y = parseInt(String(year), 10);
          if (!isNaN(y)) adminBuilder = adminBuilder.eq('channel_year', y);
          else adminBuilder = adminBuilder.eq('channel_year', year as any);
        }
        if (search) adminBuilder = adminBuilder.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        const { data: tasksAdmin, count, error: adminErr } = await adminBuilder.range(from, to);
        if (adminErr) throw adminErr;
        return { tasks: tasksAdmin ?? [], total: count || 0, page, limit };
      }
      throw e;
    }
  }
}
