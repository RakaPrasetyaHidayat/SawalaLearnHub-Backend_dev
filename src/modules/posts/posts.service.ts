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
      .select('id, full_name, email')
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
  ): Promise<PostComment> {
    await this.findOne(postId);

    const { data: comment, error } = await this.supabaseService
      .getClient()
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: commentDto.content,
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return comment as PostComment;
  }

  async getComments(postId: string) {
    const { data: comments, error } = await this.supabaseService
      .getClient()
      .from('comments')
      .select(
        `
        *,
        users!inner(id, full_name, email)
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
  ): Promise<{ liked: boolean }> {
    await this.findOne(postId);

    const { data: existingLike } = await this.supabaseService
      .getClient()
      .from('post_likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingLike) {
      await this.supabaseService.delete('post_likes', existingLike.id);
      return { liked: false };
    } else {
      await this.supabaseService.create('post_likes', {
        post_id: postId,
        user_id: userId,
      });
      return { liked: true };
    }
  }

  async getUserPosts(userId: string) {
    return this.findAll({ user_id: userId, page: 1, limit: 10 });
  }
}
