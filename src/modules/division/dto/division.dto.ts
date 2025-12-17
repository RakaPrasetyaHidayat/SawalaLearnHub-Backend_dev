import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { Division } from "../../../common/enums/database.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDivisionDto {
  @IsEnum(Division)
  @IsNotEmpty()
  @ApiProperty({ enum: Division })
  name: Division;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Backend team" })
  description: string;
}

export class UpdateDivisionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Updated description" })
  description: string;
}
