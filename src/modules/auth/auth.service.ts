import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from '../../infra/supabase/supabase.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { UserStatus } from '../../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { data: existingUser } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('email', registerDto.email)
      .single();

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const { password, ...restOfDto } = registerDto;

    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert({
        ...restOfDto,
        password_hash: hashedPassword,
        status: UserStatus.PENDING,
      })
      .select()
      .single();

    if (error) throw error;

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(loginDto: LoginDto) {
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select()
      .eq('email', loginDto.email)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check user status
    switch (user.status) {
      case UserStatus.PENDING:
        throw new UnauthorizedException({
          message: 'Your account is pending approval',
          status: UserStatus.PENDING,
        });
      case UserStatus.REJECTED:
        throw new UnauthorizedException({
          message: 'Your account has been rejected',
          status: UserStatus.REJECTED,
        });
      case UserStatus.APPROVED:
        break; // Continue to login
      default:
        throw new UnauthorizedException('Invalid account status');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token: token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // In a real app, you would generate a token, save it, and email it.
    // For now, we'll just acknowledge the request for security.
    const { data: user } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id')
      .eq('email', forgotPasswordDto.email)
      .single();

    if (user) {
      // TODO: Implement actual email sending with a reset token
      console.log(`Password reset requested for ${user.id}`);
    }

    return {
      message:
        'If your email is registered, you will receive a password reset link.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // This is a simplified version. A real implementation would require
    // validating the token from the forgotPassword step.
    try {
      const payload = this.jwtService.verify(resetPasswordDto.token);
      const hashedPassword = await bcrypt.hash(resetPasswordDto.new_password, 10);

      const { error } = await this.supabaseService
        .getClient()
        .from('users')
        .update({ password_hash: hashedPassword })
        .eq('id', payload.sub);

      if (error) throw error;

      return { message: 'Password has been reset successfully.' };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired reset token.');
    }
  }

  async me(userId: string) {
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new UnauthorizedException();
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
