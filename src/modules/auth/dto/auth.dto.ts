import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '@/common/enums';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;

  @IsString()
  @IsNotEmpty()
  division_id: string;

  @IsNumber()
  @IsNotEmpty()
  angkatan: number;

  @IsString()
  @IsNotEmpty()
  school_name: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  new_password: string;
}
