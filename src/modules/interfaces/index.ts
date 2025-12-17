export interface UserEducation {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  start_year: number;
  end_year?: number;
  created_at: Date;
}

export interface UserSocialAccount {
  id: string;
  user_id: string;
  platform_name: string;
  url: string;
  created_at: Date;
}

export interface Alert {
  id: string;
  user_id: string;
  type: "approve" | "reject";
  status: "yes" | "no";
  message: string;
  created_at: Date;
}

export interface Division {
  id: string;
  name: string;
  description: string;
  created_at: Date;
}

export interface DivisionMember {
  id: string;
  division_id: string;
  user_id: string;
  role_in_division: string;
  joined_at: Date;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: Date;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

export interface Resource {
  id: string;
  division_id: string;
  uploaded_by: string;
  title: string;
  description: string;
  file_url: string;
  format: string;
  created_at: Date;
}

export interface ResourceLike {
  id: string;
  resource_id: string;
  user_id: string;
  created_at: Date;
}

export interface ResourceView {
  id: string;
  resource_id: string;
  user_id: string;
  viewed_at: Date;
}

export interface Task {
  id: string;
  division_id: string;
  created_by: string;
  title: string;
  description: string;
  due_date: Date;
  created_at: Date;
}

export interface TaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  file_url?: string;
  comment?: string;
  status: "pending" | "approved" | "rejected";
  created_at: Date;
}

export interface Intern {
  id: string;
  user_id: string;
  angkatan: number;
  division_id: string;
  status: string;
  created_at: Date;
}
