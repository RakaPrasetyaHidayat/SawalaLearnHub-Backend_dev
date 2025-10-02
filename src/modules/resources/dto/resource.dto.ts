import { IsNotEmpty, IsString, IsEnum, IsNumber, IsUrl, IsOptional, IsUUID } from 'class-validator';
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

  @IsOptional()
  @Type(() => Number)   // pastikan dari string -> number
  @IsNumber()
  channel_year?: number;

  // menerima 'angkatan' dari frontend (string/number), di service bisa map ke channel_year
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  angkatan?: number;

  @IsOptional()
  @IsUUID()
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

  @IsUUID()
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
  @IsUUID()
  division_id?: string;
}
