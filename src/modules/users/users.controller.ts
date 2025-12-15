import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserStatus } from '../../common/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpsertUserStatusDto, SearchUsersDto } from './dto/user.dto';
import { GetUsersByDivisionDto } from './dto/user-division.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('division/:division_id')
  @UseGuards(JwtAuthGuard)
  async getUsersByDivision(
    // NOTE: division_id column in the `users` table stores human-friendly names
    // (e.g. 'Backend', 'Frontend', 'UI/UX', 'DevOps') for older rows. Accept
    // both UUIDs and plain division names here so frontend can pass either.
    @Param('division_id') division_id: string,
    @Query('year') year?: string,
  ) {
    // If year provided, return users for that division-year; otherwise return grouped by channel_year
    return await this.usersService.getUsersByDivision(division_id, year);
  }

  @Get('year/:year(\\d{4})')
  @UseGuards(JwtAuthGuard)
  async getUsersByYear(
    @Param('year') year: string,
    @GetUser('role') role: UserRole,
  ) {
    const onlyApproved = role !== UserRole.ADMIN;
    return await this.usersService.getUsersByYear(year, onlyApproved);
  }

  // NEW: Get distinct division_ids for a given year with optional counts
  @Get('year/:year(\\d{4})/division_id')
  @UseGuards(JwtAuthGuard)
  async getDivisionIdsByYear(
    @Param('year') year: string,
    @GetUser('role') role: UserRole,
  ) {
    const onlyApproved = role !== UserRole.ADMIN;
    return await this.usersService.getDivisionIdsByYear(year, onlyApproved);
  }

  // NEW (exact path as requested): /api/users/year/division_id?year=YYYY
  @Get('year/division_id')
  @UseGuards(JwtAuthGuard)
  async getDivisionIdsByYearQuery(
    @Query('year') year: string,
    @GetUser('role') role: UserRole,
  ) {
    if (!year) {
      throw new HttpException(
        { status: 'error', message: 'Query parameter "year" is required' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const onlyApproved = role !== UserRole.ADMIN;
    return await this.usersService.getDivisionIdsByYear(year, onlyApproved);
  }

  @Get('info')
  async getUsersInfo() {
    return {
      status: 'success',
      message: 'Users API endpoints information',
      data: {
        description: 'User management endpoints',
        endpoints: {
          listUsers: {
            method: 'GET',
            url: '/api/users',
            description: 'Get all users (Admin only)',
            auth: 'Required (Admin)'
          },
          getPendingUsers: {
            method: 'GET',
            url: '/api/users/pending',
            description: 'Get users with pending status (Admin only)',
            auth: 'Required (Admin)'
          },
          updateUserStatus: {
            method: 'PATCH',
            url: '/api/users/:id/status',
            description: 'Update user status (Admin only)',
            auth: 'Required (Admin)'
          },
          acceptUser: {
            method: 'PATCH',
            url: '/api/users/:id/accept',
            description: 'Accept user (set APPROVED and optional role, default SISWA)',
            auth: 'Required (Admin)'
          },
          deleteUser: {
            method: 'DELETE',
            url: '/api/users/:id',
            description: 'Delete user (Admin only)',
            auth: 'Required (Admin)'
          }
        }
      }
    };
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(
    @GetUser('role') role: UserRole,
  ) {
    const users = await this.usersService.getAllUsersFromDatabase();

    // Non-admins only see approved users
    const filtered = role === UserRole.ADMIN
      ? users
      : (Array.isArray(users) ? users.filter((u: any) => u.status === UserStatus.APPROVED) : []);

    return {
      status: 'success',
      message: 'Users retrieved successfully',
      data: filtered,
    };
  }

  @Get('ping')
  async ping() {
    return {
      status: 'success',
      message: 'Pong! API is responsive',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        note: 'This endpoint does not use database - pure API response test'
      }
    };
  }

  @Get('quick')
  async quickUsersCount() {
    try {
      const startTime = Date.now();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Quick query timeout')), 2000);
      });

      const queryPromise = this.usersService['supabaseService']
        .getClient()
        .from('users')
        .select('*', { count: 'exact', head: true });

      const result = await Promise.race([queryPromise, timeoutPromise]) as any;
      const queryTime = Date.now() - startTime;

      return {
        status: 'success',
        message: 'Quick users count retrieved',
        data: {
          count: result.count || 0,
          queryTime: `${queryTime}ms`,
          timestamp: new Date().toISOString(),
          note: 'Fast count query without fetching actual data'
        }
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'Quick query failed',
        error: error.message,
        data: {
          timestamp: new Date().toISOString(),
          suggestion: 'Database might be slow or misconfigured'
        }
      };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() searchDto: SearchUsersDto,
    @GetUser('role') role: UserRole,
  ) {
    try {
      // Non-admins can only see APPROVED users
      if (role !== UserRole.ADMIN) {
        searchDto.status = UserStatus.APPROVED;
      }

      const users = await this.usersService.findAll(searchDto);
      return {
        status: 'success',
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Unified body and logic for status updates — accessible at PATCH/PUT /api/users/:id
  @Patch(':id')
  @Put(':id')
  @Patch(':id/accept')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async upsertUserStatus(
    @Param('id') id: string,
    @Body() body: UpsertUserStatusDto,
    @GetUser('id') adminId: string,
  ) {
    try {
      const user = await this.usersService.upsertUserStatus(id, body, adminId);
      return {
        status: 'success',
        message: 'User status updated successfully',
        data: user,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteRejectedUser(
    @Param('id') id: string,
    @GetUser('id') adminId: string,
  ) {
    return this.usersService.deleteRejectedUser(id, adminId);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingUsers(
    @GetUser('role') role: UserRole,
  ) {
    // Admins can view pending; non-admins receive empty for safety
    if (role !== UserRole.ADMIN) {
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
    return this.usersService.findAll({ status: UserStatus.PENDING });
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateOwnProfile(
    @GetUser('id') userId: string,
    @Body() updateDto: any,
  ) {
    try {
      const updated = await this.usersService.updateOwnProfile(userId, updateDto);
      return {
        status: 'success',
        message: 'Profile updated successfully',
        data: updated,
      };
    } catch (error: any) {
      throw new HttpException(
        { status: 'error', message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Upload avatar for current user
  @Post('me/avatar')
  @Patch('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      },
    ),
  )
  async uploadAvatar(
    @GetUser('id') userId: string,
    @UploadedFiles() files?: { file?: Express.Multer.File[]; avatar?: Express.Multer.File[] },
  ) {
    try {
      const file = (files?.file && files.file[0]) || (files?.avatar && files.avatar[0]);
      if (!file || !file.buffer) {
        throw new HttpException({ status: 'error', message: 'No file uploaded' }, HttpStatus.BAD_REQUEST);
      }
      const uploaded = await this.usersService.uploadAvatar(userId, file);
      return { status: 'success', message: 'Avatar uploaded', data: uploaded };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  // Admin: update any user's profile (full_name, division_id, school_name, channel_year)
  // moved to :id/profile to avoid clash with status endpoint
  @Patch(':id/profile')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUserProfileByAdmin(
    @Param('id') id: string,
    @Body() updateDto: any,
    @GetUser('id') adminId: string,
  ) {
    try {
      const updated = await this.usersService.updateUserProfile(id, updateDto, adminId);
      return { status: 'success', message: 'User profile updated', data: updated };
    } catch (error: any) {
      throw new HttpException({ status: 'error', message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }
}