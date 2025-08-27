import { UserRole, UserStatus } from '../../../common/enums';

export interface User {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  channel_year: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  channel_year: number;
  created_at: Date;
}

export interface AuthToken {
  id: string;
  user_id: string;
  token: string;
  type: string;
  expires_at: Date;
  created_at: Date;
}
