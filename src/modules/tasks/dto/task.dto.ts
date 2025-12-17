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
} from "class-validator";
import { SubmissionStatus } from "@/common/enums";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Build REST endpoint" })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Create REST API for user registration" })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: "2025-12-31T23:59:00Z", format: "date-time" })
  deadline: string;

  @IsOptional()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 2025 })
  channel_year?: number;

  @IsOptional()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 12 })
  angkatan?: number;

  @ValidateIf(
    (o) =>
      o.division_id !== undefined &&
      o.division_id !== null &&
      String(o.division_id).trim() !== "",
  )
  @IsString()
  @ApiPropertyOptional({ example: "Backend" })
  division_id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Backend" })
  division: string;
}

export class SubmitTaskDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Link to repo or text answer" })
  submission_content?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Short description of submission" })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "https://storage.example.com/file.pdf" })
  file_url?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  task_id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "TASK-123" })
  task_identifier?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  user_id?: string;
}

export class SubmitTaskBodyDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: "00000000-0000-0000-0000-000000000000" })
  task_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: "00000000-0000-0000-0000-000000000000" })
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "My solution description" })
  description: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "https://.../a.pdf,https://.../b.png" })
  file_urls?: string;
}

export class UpdateTaskDto {
  // Accept standard UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) OR 32-hex without dashes
  // This makes the API flexible with clients that send compact IDs
  @ValidateIf((o) => typeof o.user_id === "string")
  @Matches(
    /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{32})$/i,
    {
      message: "user_id must be a UUID (with dashes) or a 32-hex ID",
    },
  )
  @IsNotEmpty()
  @ApiProperty({ example: "00000000-0000-0000-0000-000000000000" })
  user_id: string;

  @IsEnum(SubmissionStatus, {
    message: `status must be one of: ${Object.values(SubmissionStatus).join(", ")}`,
  })
  @IsNotEmpty()
  @ApiProperty({ enum: SubmissionStatus })
  status: SubmissionStatus;

  // Deprecated: feedback column not present in DB; use description if needed
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "Well done" })
  feedback?: string;
}

export class GetTasksQueryDto {
  @IsOptional()
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 2025 })
  year?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "REST" })
  search?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 10 })
  limit?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  user_id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Backend" })
  division_id?: string;
}

export class BatchFiltersDto {
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  task_ids?: string[];

  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  user_ids?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "submitted" })
  status?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "2025-12-31" })
  due_date_before?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "2025-01-01" })
  assigned_after?: string;
}

export class BatchUpdateDto {
  @ApiProperty({ type: BatchFiltersDto })
  filters: BatchFiltersDto;

  @ApiProperty({ example: "approved" })
  @IsString()
  new_status: string;

  @ApiPropertyOptional({ example: "Batch update for holiday" })
  @IsOptional()
  @IsString()
  update_reason?: string;
}

export class BatchPreviewDto {
  @ApiProperty({ type: BatchFiltersDto })
  filters: BatchFiltersDto;

  @ApiPropertyOptional({ example: "approved" })
  @IsOptional()
  @IsString()
  new_status?: string;
}
