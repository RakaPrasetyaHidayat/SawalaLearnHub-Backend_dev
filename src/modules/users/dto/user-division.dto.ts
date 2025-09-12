import { IsString, IsNotEmpty } from 'class-validator';

export class GetUsersByDivisionDto {
  @IsString()
  @IsNotEmpty()
  division_id: string;
}
