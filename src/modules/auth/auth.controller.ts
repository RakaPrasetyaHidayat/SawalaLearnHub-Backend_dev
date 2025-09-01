// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Endpoint untuk cek apakah service jalan
  @Get('ping')
  async ping() {
    return {
      status: 'success',
      message: 'Auth service is responsive',
      data: {
        timestamp: new Date().toISOString(),
        service: 'authentication',
        uptime: process.uptime(),
      },
    };
  }

  // ✅ Register user baru
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // ✅ Login user
  @Post('login')
  @HttpCode(HttpStatus.OK) // Supaya tidak selalu return 201
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  // ✅ Mendapatkan data user yang sedang login
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@GetUser('sub') userId: string) {
    return await this.authService.me(userId);
  }
}
