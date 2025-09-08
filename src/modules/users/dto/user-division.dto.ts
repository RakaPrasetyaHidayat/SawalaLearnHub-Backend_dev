import { IsString, IsNotEmpty } from 'class-validator';

export class GetUsersByDivisionDto {
  @IsString()
  @IsNotEmpty()
  divisionId: string;
}
