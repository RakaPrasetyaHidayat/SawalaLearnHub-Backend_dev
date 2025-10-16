import { apiFetcher } from "./fetcher";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://learnhubbackenddev.vercel.app";

export interface Post {
  id: string;
  title: string;
  content?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export class PostsService {
  static async getAllPosts(): Promise<Post[]> {
    console.log("Fetching all posts");
    try {
      const data = await apiFetcher<any>("/api/post");
      console.log("Raw posts API response:", data);

      const items: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.posts)
        ? data.posts
        : [];

      console.log("Parsed posts items:", items);

      return items.map((raw) => ({
        id: String(raw.id || raw._id || Math.random().toString(36).slice(2)),
        title: raw.title || raw.name || "Untitled Post",
        content: raw.content || raw.description || raw.body,
        author: raw.author || raw.createdBy || raw.user?.name,
        user: {
          name: raw.author || raw.createdBy || raw.user?.name || 'Unknown User',
          avatar: raw.avatar || raw.user?.avatar || '/default-avatar.png'
        },
        createdAt: raw.createdAt || raw.created_at || raw.dateCreated,
        updatedAt: raw.updatedAt || raw.updated_at || raw.dateUpdated,
        likes: raw.likes || 0,
        comments: raw.comments || 0,
        ...raw,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  static async createPost(postData: {
    title: string;
    content?: string;
    [key: string]: any;
  }): Promise<Post> {
    console.log("Creating post:", postData);
    try {
      const result = await apiFetcher<any>("/api/post", {
        method: "POST",
        body: JSON.stringify(postData),
      });
      console.log("Create post result:", result);
      return result;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  static async updatePost(
    postId: string | number,
    postData: Partial<Post>
  ): Promise<Post> {
    console.log("Updating post:", { postId, postData });
    try {
      const result = await apiFetcher<any>(`/api/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify(postData),
      });
      console.log("Update post result:", result);
      return result;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  static async deletePost(postId: string | number): Promise<void> {
    console.log("Deleting post:", postId);
    try {
      const result = await apiFetcher<any>(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      console.log("Delete post result:", result);
      return result;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }

  static async getPostById(postId: string | number): Promise<Post> {
    console.log("Fetching post by ID:", postId);
    try {
      const data = await apiFetcher<any>(`/api/posts/${postId}`);
      console.log("Post by ID response:", data);
      return data;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      throw error;
    }
  }
}

// Convenience named exports for existing call sites
export type PostItem = Post;

export async function listPosts(opts?: { page?: number; limit?: number }) {
  // Basic wrapper that returns { items, total, page } shape expected by callers
  const items = await PostsService.getAllPosts();
  return { items, total: items.length, page: opts?.page || 1 };
}

// Compatibility: some callsites expect listMyPosts
export async function listMyPosts(opts?: { page?: number; limit?: number }) {
  // Prefer backend /api/post/me endpoint (absolute) if available. Fall back to all posts.
  try {
    const url = `${API_BASE}/api/post/me`;
    const data = await apiFetcher<any>(url);

    const items: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.posts)
      ? data.posts
      : [];

    const posts = items.map((raw) => ({
      id: String(raw.id || raw._id || Math.random().toString(36).slice(2)),
      title: raw.title || raw.name || "Untitled Post",
      content: raw.content || raw.description || raw.body,
      author: raw.author || raw.createdBy || raw.user?.name,
      user: {
        name: raw.author || raw.createdBy || raw.user?.name || 'Unknown User',
        avatar: raw.avatar || raw.user?.avatar || '/default-avatar.png'
      },
      createdAt: raw.createdAt || raw.created_at || raw.dateCreated,
      updatedAt: raw.updatedAt || raw.updated_at || raw.dateUpdated,
      likes: raw.likes || 0,
      comments: raw.comments || 0,
      ...raw,
    }));

    return { items: posts, total: posts.length, page: opts?.page || 1 };
  } catch (err) {
    // If `/api/post/me` fails (404/CORS/etc), gracefully fall back to regular listing
    console.warn("listMyPosts: /api/post/me failed, falling back to listPosts:", err);
    return listPosts(opts);
  }
}

export async function createPost(data: { content: string; [key: string]: any }) {
  // Normalize to PostsService.createPost (which is named createPost within the class as createPost)
  // The class method is createPost; call it via the class
  return PostsService.createPost(data as any);
}

export async function toggleLike(postId: string) {
  // Best-effort: call updatePost to toggle like count if endpoint exists.
  try {
    // Attempt to call a placeholder endpoint; if not present on backend, this will be a no-op.
    return await PostsService.updatePost(postId, {} as any);
  } catch (e) {
    // swallow errors for best-effort toggling
    console.warn("toggleLike failed (best-effort)", e);
    throw e;
  }

}
