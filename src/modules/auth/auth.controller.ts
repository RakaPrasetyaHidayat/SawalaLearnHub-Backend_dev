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
import { RegisterDto, LoginDto } from './dto/auth.dto';
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
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@GetUser('id') userId: string) {
    return await this.authService.me(userId);
  }

  @Get('check')
  async healthCheck() {
    return await this.authService.dbCheck();
  }

  // ✅ Mendapatkan data user yang sedang login
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@GetUser('sub') userId: string) {
    return await this.authService.me(userId);
  }

  // ✅ Healthcheck DB untuk cek koneksi/env
  @Get('db-check')
  async dbCheck() {
    return await this.authService.dbCheck();
  }

  

}


