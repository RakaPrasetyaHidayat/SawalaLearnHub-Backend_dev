import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'strongPassword123', minLength: 6 })
  password: string;

  // ⬅️ pakai string, biar bisa nerima "Backend", "Frontend", dll
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Division name or UUID', example: 'Backend' })
  division_id: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 2024 })
  angkatan?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 2025 })
  channel_year?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'SMA Negeri 1' })
  school_name?: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'strongPassword123' })
  password: string;
}

export class TokenPayload {
  sub: string;
  email: string;
  role: string;
}
