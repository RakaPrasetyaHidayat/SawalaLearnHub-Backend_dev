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
        // store file url(s) in file_urls as an array when available
        file_urls: fileUrl ? [fileUrl] : null,
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

  async submitTask(taskId: string, userId: string, submitTaskDto: SubmitTaskDto) {
    try {
      // Accept either UUID or readable identifier (title). Resolve to UUID when necessary
      const resolvedTaskId = await this.resolveTaskId(taskId);

      const result = await this.callRpc('submit_task', {
        p_task_id: resolvedTaskId,
        p_user_id: userId,
        p_content: submitTaskDto.submission_url + '\n' + (submitTaskDto.notes || '')
      });

      return {
        status: 'success',
        message: 'Task submitted successfully',
        data: result
      };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Flexible submitter: allows submitting without path taskId.
   * Priority:
   * 1) dto.task_id (UUID)
   * 2) dto.task_identifier (readable title)
   * 3) Auto-select latest eligible task for user's division/year that hasn't been submitted yet
   */
  async submitTaskFlexible(userId: string, dto: SubmitTaskDto) {
    try {
      const taskIdentifier = (dto.task_id || dto.task_identifier || '').toString().trim();
      if (taskIdentifier) {
        return this.submitTask(taskIdentifier, userId, dto);
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

      // Fetch latest tasks for user's division (and year when available)
      const { data: tasks, error: tasksErr } = await adminClient
        .from('tasks')
        .select('id, created_at, deadline, division_id, channel_year')
        .eq('division_id', user.division_id)
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

      return this.submitTask(pick.id, userId, dto);
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

      // Call RPC using admin client
      const { data: result, error: rpcErr } = await adminClient.rpc('review_submission', {
        p_submission_id: submission.id,
        p_reviewer_id: adminId,
        p_status: updateTaskDto.status,
        p_feedback: updateTaskDto.feedback,
      });
      if (rpcErr) throw rpcErr;

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
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(taskIdentifier)) return taskIdentifier;

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
    if (filters?.status) query = query.eq('status', filters.status);
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
      let builder = adminClient.from('task_submissions').update({ status: new_status, updated_at: new Date().toISOString(), feedback: update_reason });
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
      const result = await this.findOne('tasks', taskId);
      if (!result) {
        throw new NotFoundException('Task not found');
      }
      return {
        status: 'success',
        data: result
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
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
