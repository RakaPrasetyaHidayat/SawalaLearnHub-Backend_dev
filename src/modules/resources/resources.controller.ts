import { Body, Controller, Get, Param, Post, UseGuards, Query, Headers } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateResourceDto, GetResourcesQueryDto } from './dto/resource.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('info')
  async getResourcesInfo() {
    return {
      status: 'success',
      message: 'Resources API endpoints information',
      data: {
        description: 'Endpoints for managing learning resources',
        endpoints: {
          getResources: {
            method: 'GET',
            url: '/api/resources',
            description: 'Get list of resources'
          },
          createResource: {
            method: 'POST',
            url: '/api/resources',
            description: 'Create a new resource'
          },
          getByYear: {
            method: 'GET',
            url: '/api/resources/year/:year',
            description: 'Get resources by year'
          }
        }
      }
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createResource(
    @Body() createResourceDto: CreateResourceDto,
    @GetUser('id') userId: string,
    @Headers('authorization') authorization?: string,
  ) {
    // accept Authorization: Bearer <access_token> from frontend and forward to service
    const token = authorization?.startsWith('Bearer ') ? authorization.split(' ')[1] : authorization;
    const resource = await this.resourcesService.createResource(createResourceDto, userId, token);
    return {
      status: 'success',
      message: 'Resource created successfully',
      data: resource
    };
  }

  // Get resources filtered by division and year
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllResources(
    @Query() query: GetResourcesQueryDto,
    @Headers('authorization') authorization?: string,
  ) {
    const token = authorization?.startsWith('Bearer ') ? authorization.split(' ')[1] : authorization;
    const resources = await this.resourcesService.getAllResources(query, token);
    return {
      status: 'success',
      message: 'Resources retrieved successfully',
      data: resources
    };
  }

  @Get('year/:year')
  @UseGuards(JwtAuthGuard)
  getResourcesByYear(@Param('year') year: string) {
    return this.resourcesService.getResourcesByYear(year);
  }

  @Get('users/:userId')
  @UseGuards(JwtAuthGuard)
  getUserResources(@Param('userId') userId: string) {
    return this.resourcesService.getUserResources(userId);
  }

  // Get resource by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getResourceById(@Param('id') id: string) {
    return this.resourcesService.getResourceById(id);
  }
}
