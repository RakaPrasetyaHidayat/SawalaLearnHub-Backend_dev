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

  async getUsersByDivision(division_id: string, year?: string) {
    try {
      const client = this.supabaseService.getClient(true);

      // Determine if division_id looks like a UUID; if not, treat as human-friendly name
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(division_id);

      // Helper: normalize human-friendly division names so variants map to stored values
      const normalizeDivisionName = (s: string) => {
        if (!s) return s;
        // remove extra whitespace, replace common separators with underscore, uppercase
        return s
          .replace(/[\/\-\s]+/g, '_') // '/', '-', spaces -> '_'
          .replace(/__+/g, '_') // collapse multiple underscores
          .trim()
          .toUpperCase();
      };

      // Normalize year to number when possible
      const yNum = year ? parseInt(String(year), 10) : undefined;

      // If year provided, return users for that division+year
      if (year) {
        let q = client
          .from('users')
          .select('id, email, full_name, role, status, division_id, school_name, channel_year');

        if (isUuid) q = q.eq('division_id', division_id);
        else {
          const normalized = normalizeDivisionName(division_id);
          // Try exact normalized match first, fallback to ilike fuzzy
          q = q.or(`division_id.eq.${normalized},division_id.ilike.%${division_id}%`);
        }

        if (!isNaN(Number(yNum))) q = q.eq('channel_year', yNum as any);

        const { data: users, error } = await q;
        if (error) throw handleDbError(error);

        return {
          status: 'success',
          message: 'Users retrieved successfully for the specified year',
          data: users || [],
          count: (users || []).length,
        };
      }

      // If no year provided, return counts per channel_year for this division
      let q2 = client.from('users').select('channel_year');
      if (isUuid) q2 = q2.eq('division_id', division_id);
      else {
        const normalized = normalizeDivisionName(division_id);
        q2 = q2.or(`division_id.eq.${normalized},division_id.ilike.%${division_id}%`);
      }

      const { data, error } = await q2;
      if (error) throw handleDbError(error);

      const counts: Record<string, number> = {};
      for (const row of data || []) {
        const y = String(row.channel_year || 'unknown');
        counts[y] = (counts[y] || 0) + 1;
      }
      const result = Object.entries(counts).map(([channel_year, count]) => ({ channel_year, count }));
      const total = (data || []).length;
      return {
        status: 'success',
        message: 'Division users counts retrieved successfully',
        data: {
          total_count: total,
          by_year: result,
        },
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

    // Validate role: only ADMIN or SISWA allowed
    const roleToSet = updateStatusDto.role ?? UserRole.SISWA;
    if (![UserRole.ADMIN, UserRole.SISWA].includes(roleToSet)) {
      throw new BadRequestException('Invalid role. Allowed values: ADMIN, SISWA');
    }

    const { data: updatedUser, error: updateError } = await this.supabaseService
      .getClient()
      .from('users')
      .update({
        status: updateStatusDto.status,
        role: roleToSet,
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

    const roleToSet = role ?? UserRole.SISWA;
    if (![UserRole.ADMIN, UserRole.SISWA].includes(roleToSet)) {
      throw new BadRequestException('Invalid role. Allowed values: ADMIN, SISWA');
    }

    const { data: updatedUser, error } = await this.supabaseService
      .getClient()
      .from('users')
      .update({ status: UserStatus.APPROVED, role: roleToSet })
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

      // Support UI-friendly keys: name OR full_name
      if (typeof update.full_name !== 'undefined') payload.full_name = update.full_name;
      else if (typeof update.name !== 'undefined') payload.full_name = update.name;

      // Support school OR school_name
      if (typeof update.school_name !== 'undefined') payload.school_name = update.school_name;
      else if (typeof update.school !== 'undefined') payload.school_name = update.school;

      // Support division (human-friendly) or division_id (uuid)
      if (typeof update.division_id !== 'undefined' && update.division_id !== null) {
        payload.division_id = update.division_id;
      } else if (typeof update.division !== 'undefined' && update.division !== null) {
        // attempt to resolve division name to UUID
        const raw = String(update.division).trim();
        // if looks like UUID, use directly
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(raw)) {
          payload.division_id = raw;
        } else {
          // try exact match on divisions.name, otherwise ilike
          const client = this.supabaseService.getClient(true);
          const lookup = raw.replace(/[\s\-\/]+/g, '');
          const { data: divisionsExact, error: divErr } = await client
            .from('divisions')
            .select('id,name')
            .ilike('name', `%${raw}%`)
            .limit(5);
          if (divErr) throw divErr;
          if (!divisionsExact || divisionsExact.length === 0) {
            // fallback: try uppercase enum-like names
            const up = raw.toUpperCase().replace(/[^A-Z0-9]/g, '_');
            const { data: divisions2 } = await client.from('divisions').select('id,name').eq('name', up).limit(1);
            if (divisions2 && divisions2.length === 1) payload.division_id = divisions2[0].id;
            else throw new Error('Division not found');
          } else if (divisionsExact.length === 1) {
            payload.division_id = divisionsExact[0].id;
          } else {
            // multiple matches -> pick the best (exact case-insensitive match) or throw ambiguous
            const exactCi = divisionsExact.find((d: any) => String(d.name).toLowerCase() === raw.toLowerCase());
            if (exactCi) payload.division_id = exactCi.id;
            else throw new Error('Multiple divisions matched; please provide a division UUID');
          }
        }
      }

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

  // Admin can update other user's profile fields
  async updateUserProfile(userId: string, update: any, adminId: string) {
    await this.ensureAdmin(adminId);

    const payload: any = {};
    if (typeof update.full_name !== 'undefined') payload.full_name = update.full_name;
    if (typeof update.school_name !== 'undefined') payload.school_name = update.school_name;
    if (typeof update.division_id !== 'undefined') payload.division_id = update.division_id;
    if (typeof update.channel_year !== 'undefined') payload.channel_year = update.channel_year;

    if (Object.keys(payload).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }

    // If division_id provided and looks like a name rather than UUID, try to resolve
    if (payload.division_id && typeof payload.division_id === 'string' && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.division_id)) {
      const maybe = payload.division_id.trim();
      const { data: divisions, error } = await this.supabaseService
        .getClient(true)
        .from('divisions')
        .select('id,name')
        .ilike('name', `%${maybe}%`)
        .limit(2);
      if (error) throw error;
      if (!divisions || divisions.length === 0) {
        throw new BadRequestException('Division not found');
      }
      if (divisions.length > 1) {
        throw new BadRequestException('Multiple divisions matched; provide a division UUID');
      }
      payload.division_id = divisions[0].id;
    }

    const { data, error } = await this.supabaseService
      .getClient(true)
      .from('users')
      .update(payload)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
