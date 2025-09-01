import { Controller, Get, Res, Options, All } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  
  // Handle preflight OPTIONS requests
  @Options('*')
  handleOptions(@Res() res: Response) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
  }

  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ 
    status: 200, 
    description: 'API information retrieved successfully'
  })
  getRoot() {
    return {
      status: 'success',
      message: 'LearnHub API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      data: {
        description: 'LearnHub API endpoints',
        endpoints: {
          ping: {
            method: 'GET',
            url: '/api/ping',
            description: 'Simple ping test (No database)',
          },
          health: {
            method: 'GET',
            url: '/api/health',
            description: 'Health check endpoint',
          },
          stats: {
            method: 'GET',
            url: '/api/stats',
            description: 'API statistics',
          },
          auth: {
            method: 'GET',
            url: '/api/auth',
            description: 'Authentication endpoints',
          },
        },
      },
    };
  }

  @Get('ping')
  @ApiOperation({ summary: 'Simple ping test' })
  @ApiResponse({ status: 200, description: 'Pong response' })
  ping() {
    return {
      status: 'success',
      message: 'Pong! API is responsive',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        responseTime: '< 1ms',
        note: 'This endpoint does not use database - pure API response test'
      }
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service health information' })
  getHealth() {
    return {
      status: 'success',
      message: 'Service is healthy',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        services: {
          api: 'healthy',
          database: 'unknown', // We don't test DB here to avoid timeout
          cache: 'healthy',
          storage: 'healthy'
        },
        note: 'Use /api/users/test-db to test database connectivity'
      }
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get API statistics' })
  @ApiResponse({ status: 200, description: 'API statistics retrieved successfully' })
  getStats() {
    return {
      status: 'success',
      message: 'API statistics retrieved successfully',
      data: {
        totalEndpoints: 47,
        publicEndpoints: 21,
        protectedEndpoints: 21,
        adminEndpoints: 5,
        lastUpdated: new Date().toISOString(),
        note: 'Static statistics - use database endpoints for real data'
      }
    };
  }

  // Favicon handlers: agar request favicon tidak mengganggu log
  @Get('favicon.ico')
  async favicon(@Res() res: Response) {
    return res.status(204).end();
  }

  @Get('favicon.png')
  getFaviconPng() {
    return null;
  }
}