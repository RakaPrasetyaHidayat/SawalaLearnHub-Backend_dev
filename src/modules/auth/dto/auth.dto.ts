import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsNumber, 
  IsOptional
} from 'class-validator';

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

  // ⬅️ pakai string, biar bisa nerima "Backend", "Frontend", dll
  @IsString()
  @IsOptional()
  division_id: string;

  @IsNumber()
  @IsOptional()
  angkatan?: number;

  @IsNumber()
  @IsOptional()
  channel_year?: number;

  @IsString()
  @IsOptional()
  school_name?: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TokenPayload {
  sub: string;
  email: string;
  role: string;
}
