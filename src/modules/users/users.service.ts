import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { UserRole, UserStatus } from '../../common/enums';
import { UpdateUserStatusDto, SearchUsersDto } from './dto/user.dto';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { DB_FUNCTIONS, TABLE_NAMES, buildPaginationQuery, handleDbError } from '../../common/utils/database.utils';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private async ensureAdmin(userId: string) {
    const { data: admin, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !admin) {
      throw new UnauthorizedException('Invalid admin request');
    }
    if (admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can perform this action');
    }
  }

  async getAllUsersFromDatabase() {
    try {
      console.log('Fetching all users from database...');
      const startTime = Date.now();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout after 5 seconds')), 5000);
      });

      const queryPromise = this.supabaseService
        .getClient()
        .from('users')
        .select('id, email, full_name, role, status, channel_year, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      const result = await Promise.race([queryPromise, timeoutPromise]) as PostgrestSingleResponse<any>;
      const queryTime = Date.now() - startTime;
      console.log(`Database query completed in ${queryTime}ms`);

      if (result.error) {
        console.error('Database error:', result.error);
        throw result.error;
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching users from database:', error);
      if (error.message?.includes('timeout')) {
        return {
          error: 'Database query timeout',
          message: 'Database is taking too long to respond. Check SUPABASE_URL config on Vercel.',
          fallback: true,
          timestamp: new Date().toISOString(),
        };
      }
      throw error;
    }
  }

  async updateUserStatus(userId: string, updateStatusDto: UpdateUserStatusDto, adminId: string) {
    await this.ensureAdmin(adminId);

    const { data: user, error: userError } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new NotFoundException('User not found');
    }

    // Log rejection
    if (updateStatusDto.status === UserStatus.REJECTED) {
      const { error: rejectionError } = await this.supabaseService
        .getClient()
        .from('rejection_logs')
        .insert({
          user_id: userId,
          admin_id: adminId,
          rejected_at: new Date().toISOString(),
        });
      if (rejectionError) throw rejectionError;
    }

    const { data: updatedUser, error: updateError } = await this.supabaseService
      .getClient()
      .from('users')
      .update({
        status: updateStatusDto.status,
        role: updateStatusDto.role ?? UserRole.SISWA, // default SISWA
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw updateError;
    return updatedUser;
  }

  async deleteRejectedUser(userId: string, adminId: string) {
    await this.ensureAdmin(adminId);

    const { data: user } = await this.supabaseService
      .getClient()
      .from('users')
      .select('status')
      .eq('id', userId)
      .single();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.status !== UserStatus.REJECTED) {
      throw new BadRequestException('Can only delete rejected users');
    }

    const { error } = await this.supabaseService
      .getClient()
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    return { message: 'User deleted successfully' };
  }

  async findAll(searchDto: SearchUsersDto) {
    const { search, role, status, page = 1, limit = 10 } = searchDto;

    const query = this.supabaseService
      .getClient(true)
      .from('users')
      .select('*', { count: 'exact' });

    if (search) {
      query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (role) query.eq('role', role);
    if (status) query.eq('status', status);

    const { data: users, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: users,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }
}
