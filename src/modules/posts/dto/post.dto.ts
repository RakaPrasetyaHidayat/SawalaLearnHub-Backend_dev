import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  media_url?: string;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  media_url?: string;
}

export class CreatePostCommentDto {
  @IsString()
  content: string;
}

export class FilterPostsDto {
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @IsOptional()
  page: number = 1;

  @IsOptional()
  limit: number = 10;
}
