import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Nice article!" })
  content!: string;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Post title" })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Post content" })
  content!: string;
}
