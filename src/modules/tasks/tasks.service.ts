import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../common/services/base.service';
import { CreateTaskDto, SubmitTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskStatus, SubmissionStatus } from '../../common/enums/database.enum';
import { PaginationParams } from '../../common/utils/api.utils';

@Injectable()
export class TasksService extends BaseService {

  async createTask(createTaskDto: CreateTaskDto, adminId: string, file?: Express.Multer.File, accessToken?: string) {
    try {
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

      const rpcParams: any = {
        p_title: createTaskDto.title,
        p_description: createTaskDto.description + (fileUrl ? `\nFile: ${fileUrl}` : ''),
        p_deadline: createTaskDto.deadline,
        p_channel_year: createTaskDto.angkatan ? Number(createTaskDto.angkatan) : null,
        p_created_by: adminId,
        p_division_id: createTaskDto.division_id || null,
      };

      const result = await this.callRpc('create_task', rpcParams as any);

      return {
        status: 'success',
        message: 'Task created successfully',
        data: result
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async submitTask(taskId: string, userId: string, submitTaskDto: SubmitTaskDto) {
    try {
      const result = await this.callRpc('submit_task', {
        p_task_id: taskId,
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

  async updateTaskStatus(
    taskId: string,
    userId: string,
    adminId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    try {
      // First get the submission ID
      const { data: submission } = await this.client
        .from('task_submissions')
        .select('id')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .single();

      if (!submission) {
        throw new NotFoundException('Task submission not found');
      }

      const result = await this.callRpc('review_submission', {
        p_submission_id: submission.id,
        p_reviewer_id: adminId,
        p_status: updateTaskDto.status,
        p_feedback: updateTaskDto.feedback
      });

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
}
