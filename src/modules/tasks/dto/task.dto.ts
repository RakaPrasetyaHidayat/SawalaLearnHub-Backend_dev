import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEnum,
  IsNumber,
  ValidateIf,
  IsUUID,
  Matches,
} from 'class-validator';
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
  @IsOptional()
  channel_year?: number;

  @IsOptional()
  @IsNumber()
  @IsOptional()
  angkatan?: number;

  @ValidateIf(
    (o) =>
      o.division_id !== undefined &&
      o.division_id !== null &&
      String(o.division_id).trim() !== '',
  )
  @IsString()
  division_id?: string;

  @IsString()
  @IsNotEmpty()
  division: string;
}

export class SubmitTaskDto {
  @IsOptional()
  @IsString()
  submission_content?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  file_url?: string;

  @IsOptional()
  @IsString()
  task_id?: string;

  @IsOptional()
  @IsString()
  task_identifier?: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}

export class SubmitTaskBodyDto {
  @IsUUID()
  @IsNotEmpty()
  task_id: string;

  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  file_urls?: string;
}

export class UpdateTaskDto {
  // Accept standard UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) OR 32-hex without dashes
  // This makes the API flexible with clients that send compact IDs
  @ValidateIf((o) => typeof o.user_id === 'string')
  @Matches(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{32})$/i, {
    message: 'user_id must be a UUID (with dashes) or a 32-hex ID',
  })
  @IsNotEmpty()
  user_id: string;

  @IsEnum(SubmissionStatus, {
    message: `status must be one of: ${Object.values(SubmissionStatus).join(', ')}`,
  })
  @IsNotEmpty()
  status: SubmissionStatus;

  // Deprecated: feedback column not present in DB; use description if needed
  @IsString()
  @IsOptional()
  feedback?: string;
}

export class GetTasksQueryDto {
  @IsOptional()
  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
  
  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  division_id?: string;
}

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
  due_date_before?: string;

  @IsOptional()
  @IsString()
  assigned_after?: string;
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


