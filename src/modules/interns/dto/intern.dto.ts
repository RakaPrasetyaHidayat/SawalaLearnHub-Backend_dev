import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateInternDto {
  @IsUUID()
  user_id: string;

  @IsNumber()
  angkatan: number;

  @IsUUID()
  division_id: string;

  @IsString()
  @IsOptional()
  status?: string = 'active';
}

export class UpdateInternDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsUUID()
  @IsOptional()
  division_id?: string;
}

export class FilterInternsDto {
  @IsNumber()
  @IsOptional()
  angkatan?: number;

  @IsUUID()
  @IsOptional()
  division_id?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;
}
