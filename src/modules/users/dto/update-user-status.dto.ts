import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../../common/enums';

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status!: UserStatus;
}
