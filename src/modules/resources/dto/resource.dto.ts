import { IsNotEmpty, IsString, IsEnum, IsNumber, IsUrl, IsOptional } from 'class-validator';
import { ResourceType } from '../../../common/enums';
import { Type } from 'class-transformer';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @IsEnum(ResourceType)
  @IsNotEmpty()
  type!: ResourceType;

  @IsNumber()
  @IsOptional()
  channel_year?: number;

  // accept 'angkatan' from frontend (string) and map in service to channel_year
  // angkatan stored as integer in users table; accept numeric value
  @IsNumber()
  @IsOptional()
  angkatan?: number;

  @IsString()
  @IsOptional()
  division_id?: string;
}

export class UpdateResourceDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUrl()
  @IsNotEmpty() 
  url!: string;

  @IsEnum(ResourceType)
  @IsNotEmpty()
  type!: ResourceType;

  @IsNumber()
  @IsOptional()
  channel_year?: number;

  @IsString()
  @IsOptional()
  division_id?: string;
}

export class GetResourcesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  division_id?: string;
}
