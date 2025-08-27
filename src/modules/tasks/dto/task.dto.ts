import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  angkatan: string;
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
