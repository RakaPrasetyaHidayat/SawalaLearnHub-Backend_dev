import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '@/infra/supabase/supabase.service';
import { CreateTaskDto, SubmitTaskDto, UpdateTaskDto } from './dto/task.dto';
import { SubmissionStatus } from '@/common/enums';

@Injectable()
export class TasksService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createTask(createTaskDto: CreateTaskDto, adminId: string) {
    const { data: task, error } = await this.supabaseService
      .getClient()
      .from('tasks')
      .insert({ ...createTaskDto, created_by: adminId })
      .select()
      .single();

    if (error) throw error;
    return task;
  }

  async submitTask(taskId: string, userId: string, submitTaskDto: SubmitTaskDto) {
    const { data: task, error: taskError } = await this.supabaseService
      .getClient()
      .from('tasks')
      .select('deadline')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      throw new NotFoundException('Task not found');
    }

    const now = new Date();
    const deadline = new Date(task.deadline);
    const status =
      now > deadline ? SubmissionStatus.OVERDUE : SubmissionStatus.SUBMITTED;

    const { data: submission, error: submissionError } = await this.supabaseService
      .getClient()
      .from('task_submissions')
      .insert({
        task_id: taskId,
        user_id: userId,
        submission_url: submitTaskDto.submission_url,
        notes: submitTaskDto.notes,
        status: status,
        submitted_at: now.toISOString(),
      })
      .select()
      .single();

    if (submissionError) throw submissionError;
    return submission;
  }

  async updateTaskStatus(
    taskId: string,
    userId: string,
    adminId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const { data: submission } = await this.supabaseService
      .getClient()
      .from('task_submissions')
      .select('id')
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .single();

    if (!submission) {
      throw new NotFoundException('Task submission not found');
    }

    const { data: updatedSubmission, error } = await this.supabaseService
      .getClient()
      .from('task_submissions')
      .update({
        status: updateTaskDto.status,
        feedback: updateTaskDto.feedback,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submission.id)
      .select()
      .single();

    if (error) throw error;
    return updatedSubmission;
  }

  async getTasksByYear(year: string) {
    const { data: tasks, error } = await this.supabaseService
      .getClient()
      .from('tasks')
      .select('*')
      .eq('angkatan', year)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return tasks;
  }

  async getUserTasks(userId: string) {
    const { data: submissions, error } = await this.supabaseService
      .getClient()
      .from('task_submissions')
      .select(
        `
        *,
        task:tasks(*)
      `,
      )
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return submissions;
  }
}
