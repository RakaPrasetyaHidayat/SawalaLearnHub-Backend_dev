export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SISWA = 'SISWA',
  Mentor = 'MENTOR'
}

export enum TaskStatus {
  SUBMITTED = 'submitted',
  OVERDUE = 'overdue',
  APPROVED = 'approved',
  NEED_REVISION = 'need_revision'
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  angkatan: number;
  school_name?: string;
  major?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_url?: string;
  created_by: string;
  angkatan: number;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  angkatan: number;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskSubmission {
  id: string;
  task_id: string;
  user_id: string;
  file_url?: string;
  comment?: string;
  status: TaskStatus;
  submitted_at: Date;
  updated_at: Date;
}

export interface Post {
  id: string;
  content: string;
  media_url?: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  reference_id: string; // bisa task_id atau post_id
  reference_type: 'task' | 'post';
  created_at: Date;
  updated_at: Date;
}
