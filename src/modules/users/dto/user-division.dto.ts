import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetUsersByDivisionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Backend" })
  division_id: string;
}
