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

  // Explicit select lists to match DB schema. Use INTERNAL when password or internal columns are required.
  private readonly USERS_SELECT_PUBLIC = 'id,email,full_name,role,status,channel_year,angkatan,created_at,updated_at,school_name,division_id';
  private readonly USERS_SELECT_INTERNAL = 'id,email,full_name,password,role,status,channel_year,angkatan,created_at,updated_at,school_name,division_id';

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

      // If year provided, attempt to use view `users_with_division` when available; otherwise fallback to join
      const tryView = async () => {
        try {
          let q = client
            .from('users_with_division')
            .select('id, full_name, role, status, division_id, division_name, school_name, channel_year');

          if (isUuid) q = q.eq('division_id', division_id);
          else {
            const normalized = normalizeDivisionName(division_id);
            q = q.or(`division_name.eq.${normalized},division_name.ilike.%${division_id}%`);
          }

          if (!isNaN(Number(yNum))) q = q.eq('channel_year', yNum as any);

          const { data: users, error } = await q;
          if (error) throw error;
          return users || [];
        } catch (e) {
          // view not available or error: signal to fallback
          return null;
        }
      };

      const viewResult = await tryView();
      if (viewResult !== null) {
        if (year) {
          return {
            status: 'success',
            message: 'Users retrieved successfully for the specified year',
            data: viewResult,
            count: (viewResult || []).length,
          };
        }

        // No year: aggregate counts per channel_year from view
        const counts: Record<string, number> = {};
        for (const row of viewResult || []) {
          const y = String(row.channel_year || 'unknown');
          counts[y] = (counts[y] || 0) + 1;
        }
        const result = Object.entries(counts).map(([channel_year, count]) => ({ channel_year, count }));
        const total = (viewResult || []).length;
        return {
          status: 'success',
          message: 'Division users counts retrieved successfully',
          data: {
            total_count: total,
            by_year: result,
          },
        };
      }

      // Fallback: manually join users and divisions for both year and non-year flows
      const usersQ = client.from('users').select('id, full_name, role, status, division_id, school_name, channel_year');
      if (isUuid) usersQ.eq('division_id', division_id);
      // if division_id is a name, we'll fetch divisions and map

      const usersRes = await usersQ;
      if ((usersRes as any).error) throw (usersRes as any).error;
      let users = (usersRes as any).data || [];

      // If division was provided as text, filter locally by matching division table names
      if (!isUuid) {
        const { data: divisions } = await client.from('divisions').select('id,name');
        const matchNorm = normalizeDivisionName(division_id);
        const matched = (divisions || []).filter((d: any) => (String(d.name || '').toUpperCase() === matchNorm) || String(d.name || '').toLowerCase().includes(String(division_id).toLowerCase()));
        const matchedIds = matched.map((d: any) => d.id);
        if (matchedIds.length > 0) {
          users = users.filter((u: any) => matchedIds.includes(u.division_id));
        } else {
          // fallback: also match users whose division_id column stores text names
          users = users.filter((u: any) => String(u.division_id || '').toLowerCase().includes(String(division_id).toLowerCase()));
        }
      }

      if (!isNaN(Number(yNum))) {
        users = users.filter((u: any) => Number(u.channel_year) === Number(yNum));
        return {
          status: 'success',
          message: 'Users retrieved successfully for the specified year',
          data: users,
          count: users.length,
        };
      }

      // No year: aggregate counts per channel_year
      const counts: Record<string, number> = {};
      for (const row of users || []) {
        const y = String(row.channel_year || 'unknown');
        counts[y] = (counts[y] || 0) + 1;
      }
      const result = Object.entries(counts).map(([channel_year, count]) => ({ channel_year, count }));
      const total = (users || []).length;
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
        .select(this.USERS_SELECT_PUBLIC)
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

      // Resolve division names when possible
      try {
        const { data: divisions } = await this.supabaseService.getClient(true).from('divisions').select('id,name');
        const byId: Record<string, string> = {};
        for (const d of (divisions || [])) {
          if (d && d.id) byId[d.id] = d.name;
        }
        const enriched = result.map(r => ({ division_id: r.division_id, division_name: byId[r.division_id] || null, count: r.count }));
        return {
          status: 'success',
          message: 'Division IDs by year retrieved successfully',
          data: enriched,
        };
      } catch (e) {
        return {
          status: 'success',
          message: 'Division IDs by year retrieved successfully',
          data: result,
        };
      }
    } catch (error) {
      throw handleDbError(error);
    }
  }

  private async ensureAdmin(userId: string) {
    const { data: admin, error } = await this.supabaseService
      .getClient(true)
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
        .select(this.USERS_SELECT_PUBLIC)
        .order('created_at', { ascending: false })
        .limit(50);

      const result = await Promise.race([queryPromise, timeoutPromise]) as PostgrestSingleResponse<any>;
      const queryTime = Date.now() - startTime;
      console.log(`Database query completed in ${queryTime}ms`);

      if (result.error) {
        console.error('Database error:', result.error);
        throw result.error;
      }

      const users = result.data || [];

      // Resolve division names so frontend can display text instead of UUIDs
      try {
        const client = this.supabaseService.getClient(true);
        const { data: divisions } = await client.from('divisions').select('id,name');
        const byId: Record<string, string> = {};
        const byNameNorm: Record<string, string> = {};
        const normalize = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (divisions && Array.isArray(divisions)) {
          for (const d of divisions) {
            if (!d) continue;
            if (d.id) byId[String(d.id)] = d.name;
            if (d.name) byNameNorm[normalize(d.name)] = d.name;
          }
        }

        for (const u of users) {
          const raw = u?.division_id;
          if (!raw) {
            u.division_name = null;
            u.division_label = null;
            continue;
          }
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(String(raw))) {
            u.division_name = byId[String(raw)] ?? String(raw);
            u.division_label = u.division_name;
          } else {
            const norm = normalize(String(raw));
            u.division_name = byNameNorm[norm] ?? String(raw);
            u.division_label = u.division_name;
          }
        }
      } catch (e) {
        // Non-fatal: if division lookup fails, return users as-is (they'll have division_id)
      }

      return users;
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

  // Unified method for both status update and accept
  async upsertUserStatus(userId: string, dto: { status?: UserStatus; role?: UserRole }, adminId: string) {
    await this.ensureAdmin(adminId);

    const { data: user, error: userError } = await this.supabaseService
      .getClient(true)
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new NotFoundException('User not found');
    }

    const nextStatus = dto.status ?? UserStatus.APPROVED; // default APPROVED

    // Log rejection
    if (nextStatus === UserStatus.REJECTED) {
      const { error: rejectionError } = await this.supabaseService
        .getClient(true)
        .from('rejection_logs')
        .insert({
          user_id: userId,
          admin_id: adminId,
          rejected_at: new Date().toISOString(),
        });
      if (rejectionError) throw rejectionError;
    }

    // Validate role: only ADMIN or SISWA allowed
    const roleToSet = dto.role ?? UserRole.SISWA;
    if (![UserRole.ADMIN, UserRole.SISWA].includes(roleToSet)) {
      throw new BadRequestException('Invalid role. Allowed values: ADMIN, SISWA');
    }

    const { data: updatedUser, error: updateError } = await this.supabaseService
      .getClient(true)
      .from('users')
      .update({
        status: nextStatus,
        role: roleToSet,
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw updateError;
    return updatedUser;
  }

  // Backward compatible: keep existing method but delegate
  async updateUserStatus(userId: string, updateStatusDto: { status: UserStatus; role?: UserRole }, adminId: string) {
    return this.upsertUserStatus(userId, updateStatusDto, adminId);
  }

  // Convenience: accept user -> default APPROVED and set role (default SISWA)
  async acceptUser(userId: string, adminId: string, role?: UserRole) {
    return this.upsertUserStatus(userId, { status: UserStatus.APPROVED, role }, adminId);
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
      .select(this.USERS_SELECT_PUBLIC, { count: 'exact' });

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

      // Support division (human-friendly text only). UI should send text (e.g. "Backend"),
      // service will translate to DB-appropriate value (division_id UUID when possible,
      // or normalized enum/text value otherwise).
      if (typeof update.division !== 'undefined' && update.division !== null) {
        // We'll determine which column exists on users table for division
        const raw = String(update.division).trim();
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        const client = this.supabaseService.getClient(true);

        // Fetch one user row to inspect which division column exists
    const { data: existingUserRow, error: userRowErr } = await client.from('users').select('*').eq('id', userId).maybeSingle();
        if (userRowErr) throw userRowErr;

        // Normalize raw input to candidate keys
        const normalizeInput = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const candidates = [raw, raw.replace(/\s+/g, ''), raw.toUpperCase(), raw.toLowerCase()];

        // 1) Try to find matching division row in `divisions` table (exact or ilike)
        const { data: matchedDivisions, error: divErr } = await client
          .from('divisions')
          .select('id,name')
          .ilike('name', `%${raw}%`)
          .limit(5);
        if (divErr) throw divErr;

        if (matchedDivisions && matchedDivisions.length === 1) {
          // Use id when users table has division_id column
          if (existingUserRow && Object.prototype.hasOwnProperty.call(existingUserRow, 'division_id')) {
            payload.division_id = matchedDivisions[0].id;
          } else {
            payload['division_name'] = matchedDivisions[0].name;
          }
        } else if (matchedDivisions && matchedDivisions.length > 1) {
          // try exact case-insensitive match
          const exactCi = matchedDivisions.find((d: any) => String(d.name).toLowerCase() === raw.toLowerCase());
          if (exactCi) {
            if (existingUserRow && Object.prototype.hasOwnProperty.call(existingUserRow, 'division_id')) {
              payload.division_id = exactCi.id;
            } else {
              payload['division_name'] = exactCi.name;
            }
          } else {
            // ambiguous matches
            throw new Error('Multiple divisions matched; please pick the exact division from the dropdown');
          }
        } else {
          // No divisions table match. Map common UI inputs to canonical enum-like names.
          const normalized = normalizeInput(raw);
          let canonical = '';
          if (normalized.includes('backend')) canonical = 'BACKEND';
          else if (normalized.includes('front') || normalized.includes('frontend')) canonical = 'FRONTEND';
          else if (normalized.includes('ui') || normalized.includes('ux')) canonical = 'UI_UX';
          else if (normalized.includes('devops')) canonical = 'DEVOPS';
          else canonical = raw.toUpperCase().replace(/[^A-Z0-9]/g, '_');

          // If users table expects a division_id FK, attempt to find division by canonical name
          if (existingUserRow && Object.prototype.hasOwnProperty.call(existingUserRow, 'division_id')) {
            const { data: byName } = await client.from('divisions').select('id,name').eq('name', canonical).limit(1);
            if (byName && byName.length === 1) payload.division_id = byName[0].id;
            else {
              // fallback: try to set division_id column to canonical string (may violate FK if column expects UUID)
              payload.division_id = canonical;
            }
          } else {
            // users table likely stores division as text/enum; set normalized canonical name
            payload['division_name'] = canonical;
          }
        }
      }

      if (typeof update.channel_year !== 'undefined') payload.channel_year = update.channel_year;

      if (Object.keys(payload).length === 0) {
        throw new BadRequestException('No valid fields provided for update');
      }

      try {
        const { data, error } = await this.supabaseService
          .getClient()
          .from('users')
          .update(payload)
          .eq('id', userId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err: any) {
        // Common FK error occurs when DB expects a division UUID or a specific enum value
        const msg = (err && err.message) ? String(err.message) : '';
        if (msg.toLowerCase().includes('foreign key') || msg.toLowerCase().includes('violates foreign key')) {
          throw new BadRequestException(
            'Division value invalid. Please provide a valid division UUID (division_id) or an existing division name. Use GET /api/users/year/division_id or query the divisions table to find valid values.'
          );
        }
        throw err;
      }
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

  // Upload avatar file to Supabase storage and update user's avatar_url
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    try {
      const client = this.supabaseService.getClient(true);
      const bucket = 'avatars';
      const fileName = `avatars/${userId}/${Date.now()}-${file.originalname}`;

      const { data: uploadData, error: uploadErr } = await client.storage
        .from(bucket)
        .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });

      if (uploadErr) {
        // Try to provide a helpful error
        throw uploadErr;
      }

      const publicUrl = client.storage.from(bucket).getPublicUrl(uploadData.path).data.publicUrl;

      const { data, error } = await client
        .from('users')
        .update({ avatar_url: publicUrl })
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
