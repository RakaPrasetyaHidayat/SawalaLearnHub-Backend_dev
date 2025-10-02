import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { UserRole, UserStatus } from '../../common/enums';
import { UpdateUserStatusDto, SearchUsersDto } from './dto/user.dto';
import { GetUsersByDivisionDto } from './dto/user-division.dto';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { DB_FUNCTIONS, TABLE_NAMES, buildPaginationQuery, handleDbError } from '../../common/utils/database.utils';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUsersByDivision(division_id: string) {
    try {
      const { data: users, error } = await this.supabaseService
        .getClient(true)
        .from('users')
        .select('id, email, full_name, role, status, division_id, school_name, channel_year')
        .eq('division_id', division_id)
        .eq('status', UserStatus.APPROVED);

      if (error) {
        throw handleDbError(error);
      }

      return {
        status: 'success',
        message: 'Users retrieved successfully',
        data: users
      };
    } catch (error) {
      throw handleDbError(error);
    }
  }

  async getUsersByYear(year: string, onlyApproved = true) {
    try {
      let q = this.supabaseService
        .getClient(true)
        .from('users')
        .select('id, email, full_name, role, status, division_id, school_name, channel_year')
        .eq('channel_year', year);

      if (onlyApproved) {
        q = q.eq('status', UserStatus.APPROVED);
      }

      const { data: users, error } = await q;

      if (error) throw handleDbError(error);

      return {
        status: 'success',
        message: 'Users retrieved successfully',
        data: users
      };
    } catch (error) {
      throw handleDbError(error);
    }
  }

  // NEW: return distinct division_ids for a given year with counts
  async getDivisionIdsByYear(year: string, onlyApproved = true) {
    try {
      let q = this.supabaseService
        .getClient(true)
        .from('users')
        .select('division_id')
        .eq('channel_year', year)
        .not('division_id', 'is', null);

      if (onlyApproved) {
        q = q.eq('status', UserStatus.APPROVED);
      }

      const { data, error } = await q;
      if (error) throw handleDbError(error);

      // Aggregate distinct division_ids and counts on server side (JS)
      const counts: Record<string, number> = {};
      for (const row of data || []) {
        const id = row.division_id as string;
        if (!id) continue;
        counts[id] = (counts[id] || 0) + 1;
      }

      const result = Object.entries(counts).map(([division_id, count]) => ({ division_id, count }));

      return {
        status: 'success',
        message: 'Division IDs by year retrieved successfully',
        data: result,
      };
    } catch (error) {
      throw handleDbError(error);
    }
  }

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

  // Convenience: accept user -> APPROVED and set role (default SISWA)
  async acceptUser(userId: string, adminId: string, role?: UserRole) {
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

    const { data: updatedUser, error } = await this.supabaseService
      .getClient()
      .from('users')
      .update({ status: UserStatus.APPROVED, role: role ?? UserRole.SISWA })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
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

  // Allow authenticated users to update their own profile (division, year, name, school)
  async updateOwnProfile(userId: string, update: any) {
    try {
      const payload: any = {};
      if (update.full_name) payload.full_name = update.full_name;
      if (update.school_name) payload.school_name = update.school_name;
      if (typeof update.division_id !== 'undefined') payload.division_id = update.division_id;
      if (typeof update.channel_year !== 'undefined') payload.channel_year = update.channel_year;

      if (Object.keys(payload).length === 0) {
        throw new BadRequestException('No valid fields provided for update');
      }

      const { data, error } = await this.supabaseService
        .getClient()
        .from('users')
        .update(payload)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleDbError(error);
    }
  }
}
