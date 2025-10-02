import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum, IsNumber, ValidateIf } from 'class-validator';
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

  // Prefer `channel_year` to match DB column name. Keep `angkatan` for backward compatibility.
  @IsOptional()
  @IsNumber()
  channel_year?: number;

  @IsOptional()
  @IsNumber()
  angkatan?: number;

  // Prefer using `division` (readable name) from frontend. Keep `division_id` optional and ignore when empty.
  @ValidateIf((o) => o.division_id !== undefined && o.division_id !== null && String(o.division_id).trim() !== '')
  @IsString()
  division_id?: string;

  // For convenience the frontend should pass a division name (e.g. "BACKEND") instead of UUID
  @IsString()
  @IsNotEmpty()
  division: string;
}

export class SubmitTaskDto {
  @IsString()
  @IsNotEmpty()
  submission_url: string;

  @IsString()
  @IsOptional()
  notes?: string;

  // Either provide task_id (UUID) or task_identifier (readable title). If none provided, server will auto-select latest eligible task.
  @IsString()
  @IsOptional()
  task_id?: string;

  @IsString()
  @IsOptional()
  task_identifier?: string;
}

export class UpdateTaskDto {
  @IsEnum(SubmissionStatus)
  @IsNotEmpty()
  status: SubmissionStatus;

  @IsString()
  @IsOptional()
  feedback?: string;
}

export class GetTasksQueryDto {
  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  division_id?: string;
}

// DTO for batch update filters
export class BatchFiltersDto {
  @IsOptional()
  task_ids?: string[];

  @IsOptional()
  user_ids?: string[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  due_date_before?: string; // ISO date

  @IsOptional()
  @IsString()
  assigned_after?: string; // ISO date for submission created_at
}

export class BatchUpdateDto {
  filters: BatchFiltersDto;

  @IsString()
  new_status: string;

  @IsOptional()
  @IsString()
  update_reason?: string;
}

export class BatchPreviewDto {
  filters: BatchFiltersDto;

  @IsOptional()
  @IsString()
  new_status?: string;
}
