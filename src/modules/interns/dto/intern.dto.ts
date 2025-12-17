import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateInternDto {
  @IsUUID()
  @ApiProperty({ example: "00000000-0000-0000-0000-000000000000" })
  user_id: string;

  @IsNumber()
  @ApiProperty({ example: 12 })
  angkatan: number;

  @IsUUID()
  @ApiProperty({ example: "00000000-0000-0000-0000-000000000000" })
  division_id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "active" })
  status?: string = "active";
}

export class UpdateInternDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "inactive" })
  status?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  division_id?: string;
}

export class FilterInternsDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 12 })
  angkatan?: number;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ example: "00000000-0000-0000-0000-000000000000" })
  division_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "active" })
  status?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 10 })
  limit?: number = 10;
}
