import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import {
  CreatePostDto,
  UpdatePostDto,
  CreatePostCommentDto,
  FilterPostsDto,
} from './dto/post.dto';
import { Post, PostComment } from '../interfaces';

@Injectable()
export class PostsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Create Post with optional file upload
  async create(
    createPostDto: CreatePostDto,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<Post> {
    // prefer uploaded file over supplied media_url
    let mediaUrl: string | null = createPostDto.media_url ?? null;

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { error: uploadError } = await this.supabaseService
        .getClient()
        .storage.from('post-media') // ensure bucket 'post-media' exists
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // get public URL
      const { data: publicUrl } = this.supabaseService
        .getClient()
        .storage.from('post-media')
        .getPublicUrl(fileName);

      mediaUrl = publicUrl.publicUrl;
    }

    const payload: any = {
      ...createPostDto,
      user_id: userId,
      media_url: mediaUrl,
    };

    const { data: post, error } = await this.supabaseService
      .getClient()
      .from('posts')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) throw error;
    return post as Post;
  }

  // Get All Posts
  async findAll(filterDto: FilterPostsDto) {
    const { user_id, page = 1, limit = 10 } = filterDto;

    let query = this.supabaseService
      .getClient()
      .from('posts')
      .select('*', { count: 'exact' });

    if (user_id) query = query.eq('user_id', user_id);

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      posts: data ?? [],
      total: count || 0,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Post> {
    const client = this.supabaseService.getClient();

    const { data: post, error } = await client
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !post) throw new NotFoundException('Post not found');

    // Fetch author summary
    const { data: author } = await client
      .from('users')
      .select('id, full_name, email, avatar_url')
      .eq('id', post.user_id)
      .maybeSingle();

    // Fetch counts for likes and comments
    const [{ count: likesCount }, { count: commentsCount }] = await Promise.all([
      (async () => {
        const { count } = await client.from('post_likes').select('id', { count: 'exact', head: true }).eq('post_id', id);
        return { count: count || 0 } as any;
      })(),
      (async () => {
        const { count } = await client.from('comments').select('id', { count: 'exact', head: true }).eq('post_id', id);
        return { count: count || 0 } as any;
      })(),
    ]);

    return {
      ...post,
      author: author || null,
      meta: {
        likes: likesCount || 0,
        comments: commentsCount || 0,
      },
    } as any;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (post.user_id !== userId)
      throw new UnauthorizedException('You can only update your own posts');

    const { data: updatedPost, error } = await this.supabaseService
      .getClient()
      .from('posts')
      .update(updatePostDto)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return updatedPost as Post;
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);
    if (post.user_id !== userId)
      throw new UnauthorizedException('You can only delete your own posts');

    await this.supabaseService.delete('posts', id);
  }

  async addComment(
    postId: string,
    userId: string,
    commentDto: CreatePostCommentDto,
    accessToken?: string,
  ): Promise<PostComment> {
    await this.findOne(postId);

  // Use admin client for server-side insert (bypass RLS). Auth is enforced by Nest guards.
  const client = this.supabaseService.getClient(true);

    const { data: comment, error } = await client
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: commentDto.content,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('[PostsService.addComment] DB error:', error);
      throw error;
    }
    return comment as PostComment;
  }

  async getComments(postId: string) {
    const { data: comments, error } = await this.supabaseService
      .getClient()
      .from('comments')
      .select(
        `
        *,
        users!inner(id, full_name, email, avatar_url)
        `,
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return comments ?? [];
  }

  async toggleLike(
    postId: string,
    userId: string,
    accessToken?: string,
  ): Promise<{ liked: boolean; like?: any }> {
    await this.findOne(postId);

  // Use admin client for server-side write operations to bypass RLS (Nest guards already enforce auth)
  const client = this.supabaseService.getClient(true);

    try {
      const { data: existingLike, error: selectErr } = await client
        .from('post_likes')
        .select('*')
        .match({ post_id: postId, user_id: userId })
        .maybeSingle();

      if (selectErr) {
        console.error('[PostsService.toggleLike] select error:', selectErr);
        throw new Error(selectErr.message || 'Failed to query existing like');
      }

      if (existingLike) {
        const { error: delErr } = await client.from('post_likes').delete().match({ id: existingLike.id });
        if (delErr) {
          console.error('[PostsService.toggleLike] delete error:', delErr);
          throw new Error(delErr.message || 'Failed to delete like');
        }
        return { liked: false };
      }

      const { data: newLike, error } = await client
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId })
        .select('*')
        .single();

      if (error) {
        console.error('[PostsService.toggleLike] insert error:', error);
        throw new Error(error.message || 'Failed to create like');
      }
      return { liked: true, like: newLike };
    } catch (err: any) {
      console.error('[PostsService.toggleLike] Error:', err && err.message ? err.message : err);
      // Map to appropriate HTTP error for the controller to convert
      throw new (require('@nestjs/common').InternalServerErrorException)(err.message || 'Failed to toggle like');
    }
  }

  async getUserPosts(userId: string) {
    return this.findAll({ user_id: userId, page: 1, limit: 10 });
  }
}
