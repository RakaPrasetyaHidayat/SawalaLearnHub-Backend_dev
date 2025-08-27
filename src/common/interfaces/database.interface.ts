import { UserRole, UserStatus, TaskStatus, SubmissionStatus, ResourceType } from '../enums';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  approved_at?: Date;
  channel_year?: number;
}

export interface Channel {
  id: number;
  year: number;
  name: string;
  description: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  created_by: string;
  channel_year: number;
  created_at: Date;
}

export interface Post {
  id: number;
  content: string;
  created_by: string;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  created_by: string;
  channel_year: number;
  deadline: Date;
  created_at: Date;
  status: TaskStatus;
}

export interface TaskSubmission {
  id: number;
  task_id: number;
  user_id: string;
  submission_content: string;
  status: SubmissionStatus;
  submitted_at: Date;
}

export interface Comment {
  id: number;
  content: string;
  user_id: string;
  post_id?: number;
  task_id?: number;
  created_at: Date;
}
