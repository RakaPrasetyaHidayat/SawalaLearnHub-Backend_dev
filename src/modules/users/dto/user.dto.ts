import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserRole, UserStatus } from '../../../common/enums';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

export class UpdateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsUUID()
  @IsNotEmpty()
  division_id: string;

  @IsString()
  @IsNotEmpty()
  school_name: string;
}

export class UpdateOwnProfileDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  // Division stored as text in many tables; accept string for flexibility
  @IsString()
  @IsOptional()
  division_id?: string;

  @IsString()
  @IsOptional()
  school_name?: string;

  @IsNumber()
  @IsOptional()
  channel_year?: number;
}

export class UserEducationDto {
  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsNumber()
  @IsNotEmpty()
  start_year: number;

  @IsNumber()
  @IsOptional()
  end_year?: number;
}

export class UserSocialAccountDto {
  @IsString()
  @IsNotEmpty()
  platform_name: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class SearchUsersDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(UserRole)
  @IsOptional()
    role?: UserRole = UserRole.SISWA;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
