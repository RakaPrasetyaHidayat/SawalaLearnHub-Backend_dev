import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { UserRole, UserStatus } from '../../common/enums';
import { UpdateUserStatusDto, SearchUsersDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async updateUserStatus(
    userId: string,
    updateStatusDto: UpdateUserStatusDto,
    adminId: string,
  ) {
    const { data: user, error: userError } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new NotFoundException('User not found');
    }

    const { data: admin, error: adminError } = await this.supabaseService
      .getClient()
      .from('users')
      .select('role')
      .eq('id', adminId)
      .single();

    if (adminError || !admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can update user status');
    }

    if (updateStatusDto.status === UserStatus.REJECTED) {
      const { error: rejectionError } = await this.supabaseService.getClient().from('rejection_logs').insert({
        user_id: userId,
        admin_id: adminId,
        rejected_at: new Date().toISOString(),
      });
      if (rejectionError) throw rejectionError;
    }

    const { data: updatedUser, error: updateError } = await this.supabaseService
      .getClient()
      .from('users')
      .update({ status: updateStatusDto.status, role: updateStatusDto.role })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw updateError;
    return updatedUser;
  }

  async deleteRejectedUser(userId: string, adminId: string) {
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

    // Further check if the requester is an admin
    const { data: admin } = await this.supabaseService
      .getClient()
      .from('users')
      .select('role')
      .eq('id', adminId)
      .single();

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can delete users');
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
    if (role) {
      query.eq('role', role);
    }
    if (status) {
      query.eq('status', status);
    }

    const { data: users, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: users,
      total: count || 0,
      page,
      limit,
    };
  }
}
