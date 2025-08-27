import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAuthInfo() {
    return {
      status: 'success',
      message: 'Auth endpoints information',
      data: {
        description: 'Authentication and authorization endpoints',
        endpoints: {
          register: {
            method: 'POST',
            url: '/api/auth/register',
            description: 'Register a new user',
          },
          login: {
            method: 'POST',
            url: '/api/auth/login',
            description: 'Login with credentials',
          },
          forgotPassword: {
            method: 'POST',
            url: '/api/auth/forgot-password',
            description: 'Request password reset',
          },
          resetPassword: {
            method: 'POST',
            url: '/api/auth/reset-password',
            description: 'Reset password with token',
          },
        },
      },
    };
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@GetUser('sub') userId: string) {
    return this.authService.me(userId);
  }
}
