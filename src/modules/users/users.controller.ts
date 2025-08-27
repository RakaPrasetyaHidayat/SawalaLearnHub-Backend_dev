import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserStatus } from '../../common/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateUserStatusDto, SearchUsersDto } from './dto/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  findAll(@Query() searchDto: SearchUsersDto) {
    return this.usersService.findAll(searchDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  updateUserStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @GetUser('sub') adminId: string,
  ) {
    return this.usersService.updateUserStatus(id, updateStatusDto, adminId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  deleteRejectedUser(
    @Param('id') id: string,
    @GetUser('sub') adminId: string,
  ) {
    return this.usersService.deleteRejectedUser(id, adminId);
  }

  @Get('pending')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async getPendingUsers() {
    return this.usersService.findAll({ status: UserStatus.PENDING });
  }
}
