import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole, UserStatus } from '../../common/enums/database.enum';

export interface AuthResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  channel_year?: number;
  school_name?: string;
  division_id?: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Helper untuk pastikan query selalu pakai service_role (bukan anon).
   * Supaya RLS tidak menghalangi proses auth (register, login, me).
   */
  private get adminClient() {
    return this.supabaseService.getClient(true); // ✅ true = pakai SERVICE_ROLE
  }

  private async handleDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('Database operation error:', error);
      
      if (error.message?.includes('API key')) {
        throw new InternalServerErrorException('Database configuration error');
      }
      
      throw error instanceof Error ? error : new InternalServerErrorException('Database operation failed');
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse<AuthUser>> {
    return this.handleDatabaseOperation(async () => {
      const email = registerDto.email.toLowerCase().trim();

      // ✅ Cari user existing (pakai service_role)
      const { data: existingUser, error: searchError } = await this.adminClient
        .from('users')
        .select('id, email, status')
        .eq('email', email)
        .maybeSingle();

      if (searchError) throw new InternalServerErrorException(searchError.message);

      if (existingUser) {
        throw new BadRequestException({
          message: 'User already exists',
          details: existingUser.status === UserStatus.PENDING 
            ? 'Your registration is pending approval' 
            : 'An account with this email already exists'
        });
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const currentYear = new Date().getFullYear();

      // ✅ Buat user baru
      const userData = {
        email,
        password: hashedPassword,
        full_name: registerDto.full_name,
        role: UserRole.SISWA,
        status: UserStatus.PENDING,
        channel_year: registerDto.channel_year || currentYear,
        division_id: registerDto.division_id || null,
        school_name: registerDto.school_name || null,
      };

      const { data: user, error: insertError } = await this.adminClient
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (insertError) throw new InternalServerErrorException(insertError.message);
      if (!user) throw new InternalServerErrorException('Failed to create user');

      return {
        status: 'success',
        message: 'Registration successful. Please wait for admin approval.',
        data: user,
      };
    });
  }

  async login(loginDto: LoginDto): Promise<AuthResponse<LoginResponse>> {
    return this.handleDatabaseOperation(async () => {
      const email = loginDto.email.toLowerCase().trim();

      // ✅ Ambil user by email (pakai service_role agar bisa baca password)
      const { data: user, error: searchError } = await this.adminClient
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (searchError) throw new InternalServerErrorException(searchError.message);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      // ✅ Status check
      if (user.status === UserStatus.PENDING) {
        throw new UnauthorizedException({ 
          message: 'Account is pending approval', 
          status: user.status,
          details: 'Please wait for admin approval'
        });
      }
      if (user.status === UserStatus.REJECTED) {
        throw new UnauthorizedException({ 
          message: 'Account has been rejected', 
          status: user.status,
          details: 'Please contact administrator'
        });
      }
      if (user.status !== UserStatus.APPROVED) {
        throw new UnauthorizedException({
          message: `Invalid account status: ${user.status}`,
          status: user.status,
          details: 'Contact administrator for assistance'
        });
      }

      // ✅ Cek password
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

      // ✅ Generate JWT
      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        status: 'success',
        message: 'Login successful',
        data: {
          access_token,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
          },
        },
      };
    });
  }

  async me(userId: string): Promise<AuthResponse<AuthUser>> {
    return this.handleDatabaseOperation(async () => {
      // ✅ Ambil profil by id (pakai service_role agar leluasa)
      const { data: user, error } = await this.adminClient
        .from('users')
        .select('id, email, full_name, role, status, channel_year, school_name, division_id')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw new InternalServerErrorException(error.message);
      if (!user) throw new UnauthorizedException('User not found');

      return {
        status: 'success',
        message: 'User profile retrieved successfully',
        data: user,
      };
    });
  }
}

