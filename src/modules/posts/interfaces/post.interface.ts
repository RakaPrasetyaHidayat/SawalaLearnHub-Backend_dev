export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

export interface FilterPostsDto {
  user_id?: string;
  page: number;
  limit: number;
}
