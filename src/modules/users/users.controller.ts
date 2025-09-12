import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, UserStatus } from '../../common/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateUserStatusDto, SearchUsersDto } from './dto/user.dto';
import { GetUsersByDivisionDto } from './dto/user-division.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('division/:division_id')
  @UseGuards(JwtAuthGuard)
  async getUsersByDivision(@Param('division_id') division_id: string) {
    return await this.usersService.getUsersByDivision(division_id);
  }

  @Get('year/:year')
  @UseGuards(JwtAuthGuard)
  async getUsersByYear(
    @Param('year') year: string,
    @GetUser('role') role: UserRole,
  ) {
    const onlyApproved = role !== UserRole.ADMIN;
    return await this.usersService.getUsersByYear(year, onlyApproved);
  }

  // NEW: Get distinct division_ids for a given year with optional counts
  @Get('year/:year/division_id')
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

  @Get('test-db')
  async testDatabaseConnection() {
    try {
      const startTime = Date.now();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection test timeout after 3 seconds')), 3000);
      });

      const queryPromise = this.usersService['supabaseService']
        .getClient()
        .from('users')
        .select('count')
        .limit(1);

      const result = await Promise.race([queryPromise, timeoutPromise]) as any;
      const queryTime = Date.now() - startTime;

      return {
        status: 'success',
        message: 'Database connection test successful',
        data: {
          connectionTime: `${queryTime}ms`,
          timestamp: new Date().toISOString(),
          supabaseConfigured: true,
          result,
          note: 'Simple database connectivity test'
        }
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'Database connection test failed',
        error: error.message,
        data: {
          timestamp: new Date().toISOString(),
          suggestion: 'Check SUPABASE_URL in Vercel environment variables',
          expectedUrl: 'https://zjtpufpqfcemtqpepkhe.supabase.co'
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

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @GetUser('sub') adminId: string,
  ) {
    try {
      const user = await this.usersService.updateUserStatus(id, updateStatusDto, adminId);
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
    @GetUser('sub') adminId: string,
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
    @GetUser('sub') userId: string,
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
}