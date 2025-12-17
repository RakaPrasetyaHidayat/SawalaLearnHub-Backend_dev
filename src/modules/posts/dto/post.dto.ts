// dto/post.dto.ts
import { IsOptional, IsString, IsUUID, IsNumber } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: "This is a post content" })
  content: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "https://cdn.example.com/image.jpg" })
  media_url?: string;
}

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "Updated content" })
  content?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "https://cdn.example.com/new-image.jpg" })
  media_url?: string;
}

export class CreatePostCommentDto {
  @IsString()
  @ApiProperty({ example: "Nice post!" })
  content: string;
}

export class FilterPostsDto {
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  user_id?: string;

  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  page: number = 1;

  @IsOptional()
  @ApiPropertyOptional({ example: 10 })
  limit: number = 10;
}
