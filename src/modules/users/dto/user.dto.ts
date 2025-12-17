import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { UserRole, UserStatus } from "../../../common/enums";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

// Unified body for both status update and accept
export class UpsertUserStatusDto {
  @IsEnum(UserStatus)
  @IsOptional()
  @ApiPropertyOptional({ enum: UserStatus })
  status?: UserStatus; // default to APPROVED if not provided

  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({ enum: UserRole })
  role?: UserRole; // default SISWA if not provided
}

export class AcceptUserDto {
  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({ enum: UserRole })
  role?: UserRole; // default SISWA if not provided
}

export class UpdateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "John Doe" })
  full_name: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: "00000000-0000-0000-0000-000000000000" })
  division_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "SMA Negeri 1" })
  school_name: string;
}

export class UpdateOwnProfileDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "John Doe" })
  full_name?: string;

  // Division stored as text in many tables; accept string for flexibility
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "Backend" })
  division_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "SMA Negeri 1" })
  school_name?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 2025 })
  channel_year?: number;
}

export class UserEducationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Universitas Indonesia" })
  institution: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "S1 Informatika" })
  degree: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2020 })
  start_year: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 2024 })
  end_year?: number;
}

export class UserSocialAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "GitHub" })
  platform_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "https://github.com/username" })
  url: string;
}

export class SearchUsersDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "Jane" })
  search?: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiPropertyOptional({ enum: UserRole, default: UserRole.SISWA })
  role?: UserRole = UserRole.SISWA;

  @IsEnum(UserStatus)
  @IsOptional()
  @ApiPropertyOptional({ enum: UserStatus })
  status?: UserStatus;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 10 })
  limit?: number;
}
