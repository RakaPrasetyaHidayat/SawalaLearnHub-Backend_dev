import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsUrl,
  IsOptional,
  IsUUID,
} from "class-validator";
import { ResourceType } from "../../../common/enums";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Learn NestJS" })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "A tutorial on building APIs with NestJS" })
  description!: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: "https://example.com/tutorial" })
  url!: string;

  @IsEnum(ResourceType)
  @IsNotEmpty()
  @ApiProperty({ enum: ResourceType })
  type!: ResourceType;

  @IsOptional()
  @Type(() => Number) // pastikan dari string -> number
  @IsNumber()
  @ApiPropertyOptional({ example: 2025 })
  channel_year?: number;

  // menerima 'angkatan' dari frontend (string/number), di service bisa map ke channel_year
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ example: 12 })
  angkatan?: number;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  division_id?: string;
}

export class UpdateResourceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Learn NestJS" })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "A tutorial on building APIs with NestJS" })
  description!: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: "https://example.com/tutorial" })
  url!: string;

  @IsEnum(ResourceType)
  @IsNotEmpty()
  @ApiProperty({ enum: ResourceType })
  type!: ResourceType;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 2025 })
  channel_year?: number;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  division_id?: string;
}

export class GetResourcesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ example: 2025 })
  year?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "NestJS" })
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({ example: 10 })
  limit?: number = 10;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  division_id?: string;
}
