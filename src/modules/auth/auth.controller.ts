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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Endpoint untuk cek apakah service jalan
  @Get('ping')
  @ApiOperation({ summary: 'Ping auth service' })
  @ApiResponse({ status: 200, description: 'Service responsive' })
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // ✅ Login user
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and return access token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  async getCurrentUser(@GetUser('id') userId: string) {
    return await this.authService.me(userId);
  }

  @Get('check')
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service health ok' })
  async healthCheck() {
    return await this.authService.dbCheck();
  }

 

  // ✅ Healthcheck DB untuk cek koneksi/env
  @Get('db-check')
  @ApiOperation({ summary: 'Database connectivity check' })
  @ApiResponse({ status: 200, description: 'Database reachable' })
  async dbCheck() {
    return await this.authService.dbCheck();
  }

  

}


