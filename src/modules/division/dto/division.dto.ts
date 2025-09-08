import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Division } from '../../../common/enums/database.enum';

export class CreateDivisionDto {
  @IsEnum(Division)
  @IsNotEmpty()
  name: Division;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateDivisionDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
