import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createComment(postId: string, userId: string, createCommentDto: CreateCommentDto) {
    // Check if post exists
    const { data: post } = await this.supabaseService.getClient()
      .from('posts')
      .select()
      .eq('id', postId)
      .single();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { data: comment, error } = await this.supabaseService.getClient()
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: createCommentDto.content,
      })
      .select(`
        *,
        user:users(id, full_name, email)
      `)
      .single();

    if (error) throw error;
    return comment;
  }

  async getPostComments(postId: string) {
    const { data: comments, error } = await this.supabaseService.getClient()
      .from('comments')
      .select(`
        *,
        user:users(id, full_name, email)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return comments;
  }

  async createTaskComment(taskId: string, userId: string, createCommentDto: CreateCommentDto) {
    // Check if task exists
    const { data: task } = await this.supabaseService.getClient()
      .from('tasks')
      .select()
      .eq('id', taskId)
      .single();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const { data: comment, error } = await this.supabaseService.getClient()
      .from('task_comments')
      .insert({
        task_id: taskId,
        user_id: userId,
        content: createCommentDto.content,
      })
      .select(`
        *,
        user:users(id, full_name, email)
      `)
      .single();

    if (error) throw error;
    return comment;
  }

  async getTaskComments(taskId: string) {
    const { data: comments, error } = await this.supabaseService.getClient()
      .from('task_comments')
      .select(`
        *,
        user:users(id, full_name, email)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return comments;
  }
}
