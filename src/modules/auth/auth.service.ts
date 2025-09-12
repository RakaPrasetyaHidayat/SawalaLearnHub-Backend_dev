import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException, 
  InternalServerErrorException,
  NotFoundException,
  HttpException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole, UserStatus, Division } from '../../common/enums/database.enum';

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
  division_id: Division;
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
   * Client Supabase pakai service_role
   */
  private get adminClient() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in env');
    }
    return this.supabaseService.getClient(true);
  }

  private async handleDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (err: any) {
      // Avoid leaking internals, but keep meaningful mapping
      const message = typeof err?.message === 'string' ? err.message : '';
      console.error('Database operation error:', {
        message,
        code: err?.code,
        details: err?.details,
        hint: err?.hint,
      });

      if (message.includes('API key')) {
        throw new InternalServerErrorException('Database configuration error: Invalid API key');
      }
      if (message.includes('JWT')) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      if (message.includes('duplicate key') || err?.code === '23505') {
        throw new BadRequestException('Resource already exists');
      }
      if (message.includes('not found')) {
        throw new NotFoundException('Resource not found');
      }

      if (err instanceof HttpException) {
        // Preserve already-formed HTTP exceptions (e.g., UnauthorizedException thrown inside operation)
        throw err;
      }

      // Generic error handling
      throw new InternalServerErrorException(message || 'Database operation failed');
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse<AuthUser>> {
    return this.handleDatabaseOperation(async () => {
      const email = registerDto.email.toLowerCase().trim();

      const { data: existingUser, error: searchError } = await this.adminClient
        .from('users')
        .select('id, email, status')
        .eq('email', email)
        .maybeSingle();

      if (searchError) throw new InternalServerErrorException(searchError.message);

      if (existingUser) {
        throw new BadRequestException({
          message: 'User already exists',
          details:
            existingUser.status === UserStatus.PENDING
              ? 'Your registration is pending approval'
              : 'An account with this email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const currentYear = new Date().getFullYear();

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
        .select('id, email, full_name, role, status, channel_year, school_name, division_id')
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

      const { data: user, error: searchError } = await this.adminClient
        .from('users')
        .select('id, email, full_name, role, status, password')
        .eq('email', email)
        .maybeSingle();

      if (searchError) throw new InternalServerErrorException(searchError.message);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      console.log('🔍 User found from DB:', user);

      if (user.status === UserStatus.PENDING) {
        throw new UnauthorizedException({
          message: 'Account is pending approval',
          status: user.status,
          details: 'Please wait for admin approval',
        });
      }
      if (user.status === UserStatus.REJECTED) {
        throw new UnauthorizedException({
          message: 'Account has been rejected',
          status: user.status,
          details: 'Please contact administrator',
        });
      }
      if (user.status !== UserStatus.APPROVED) {
        throw new UnauthorizedException({
          message: `Invalid account status: ${user.status}`,
          status: user.status,
          details: 'Contact administrator for assistance',
        });
      }

      const isPasswordValid = user?.password ? await bcrypt.compare(loginDto.password, user.password) : false;
      if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

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
      const { data: user, error } = await this.adminClient
        .from('users')
        .select(
          'id, email, full_name, role, status, channel_year, school_name, division_id',
        )
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

  // Healthcheck: simple query to validate DB connectivity/env
  async dbCheck() {
    return this.handleDatabaseOperation(async () => {
      const { error, count } = await this.adminClient
        .from('users')
        .select('id', { count: 'exact', head: true });

      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return {
        status: 'success',
        message: 'Database reachable',
        data: { table: 'users', countKnown: typeof count === 'number' },
      };
    });
  }
}
