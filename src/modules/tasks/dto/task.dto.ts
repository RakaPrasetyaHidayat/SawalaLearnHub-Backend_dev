import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { SubmissionStatus } from '@/common/enums';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  deadline: string;
  @IsOptional()
  @IsNumber()
  angkatan?: number;

  @IsOptional()
  @IsString()
  division_id?: string;
}

export class SubmitTaskDto {
  @IsString()
  @IsNotEmpty()
  submission_url: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateTaskDto {
  @IsEnum(SubmissionStatus)
  @IsNotEmpty()
  status: SubmissionStatus;

  @IsString()
  @IsOptional()
  feedback?: string;
}
