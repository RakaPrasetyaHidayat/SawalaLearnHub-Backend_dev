import { IsEnum, IsNotEmpty } from "class-validator";
import { UserStatus } from "../../../common/enums";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: UserStatus })
  status!: UserStatus;
}
