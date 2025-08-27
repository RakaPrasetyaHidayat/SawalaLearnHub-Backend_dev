import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { CreatePostDto, UpdatePostDto, CreatePostCommentDto, FilterPostsDto } from './dto/post.dto';
import { Post, PostComment, PostLike } from '../interfaces';

@Injectable()
export class PostsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const { data: post, error } = await this.supabaseService.getClient()
      .from('posts')
      .insert({
        ...createPostDto,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return post as Post;
  }

  async findAll(filterDto: FilterPostsDto) {
    const { user_id, page = 1, limit = 10 } = filterDto;
    let query = this.supabaseService.getClient()
      .from('posts')
      .select(`
        *,
        users!inner(id, full_name, email),
        post_likes(count),
        post_comments(count)
      `);

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data: posts, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    return {
      posts,
      total: count || 0,
      page,
      limit
    };
  }

  async findOne(id: string): Promise<Post> {
    const { data: post, error } = await this.supabaseService.getClient()
      .from('posts')
      .select()
      .eq('id', id)
      .single();
      
    if (error || !post) {
      throw new NotFoundException('Post not found');
    }
    
    return post as Post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    const post = await this.findOne(id);
    if (post.user_id !== userId) {
      throw new UnauthorizedException('You can only update your own posts');
    }

    const { data: updatedPost, error } = await this.supabaseService.getClient()
      .from('posts')
      .update(updatePostDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedPost as Post;
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);
    if (post.user_id !== userId) {
      throw new UnauthorizedException('You can only delete your own posts');
    }

    await this.supabaseService.delete('posts', id);
  }

  // Comments
  async addComment(postId: string, userId: string, commentDto: CreatePostCommentDto): Promise<PostComment> {
    const post = await this.findOne(postId);
    
    const { data: comment, error } = await this.supabaseService.getClient()
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: commentDto.content
      })
      .select()
      .single();

    if (error) throw error;
    return comment as PostComment;
  }

  async getComments(postId: string) {
    const { data: comments } = await this.supabaseService.getClient()
      .from('post_comments')
      .select(`
        *,
        users!inner(id, full_name, email)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    return comments;
  }

  // Likes
  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    const post = await this.findOne(postId);
    
    // Check if already liked
    const { data: existingLike } = await this.supabaseService.getClient()
      .from('post_likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      await this.supabaseService.delete('post_likes', existingLike.id);
      return { liked: false };
    } else {
      // Like
      await this.supabaseService.create('post_likes', {
        post_id: postId,
        user_id: userId
      });
      return { liked: true };
    }
  }

  async getUserPosts(userId: string) {
    return this.findAll({ user_id: userId, page: 1, limit: 10 });
  }
}
