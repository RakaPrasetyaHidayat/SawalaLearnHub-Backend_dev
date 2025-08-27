import { IsNotEmpty, IsString, IsEnum, IsNumber, IsUrl } from 'class-validator';
import { ResourceType } from '../../../common/enums';

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
  @IsNotEmpty()
  channel_year!: number;
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
}

export class GetResourcesQueryDto {
  @IsNumber()
  channel_year?: number;
}
