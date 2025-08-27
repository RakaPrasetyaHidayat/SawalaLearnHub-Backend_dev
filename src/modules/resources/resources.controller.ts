import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateResourceDto } from './dto/resource.dto';

@Controller('api/resources')
@UseGuards(JwtAuthGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
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
  async createResource(
    @Body() createResourceDto: CreateResourceDto,
    @GetUser('id') userId: string,
  ) {
    const resource = await this.resourcesService.createResource(createResourceDto, userId);
    return {
      status: 'success',
      message: 'Resource created successfully',
      data: resource
    };
  }

  @Get('year/:year')
  getResourcesByYear(@Param('year') year: string) {
    return this.resourcesService.getResourcesByYear(year);
  }

  @Get('users/:userId')
  getUserResources(@Param('userId') userId: string) {
    return this.resourcesService.getUserResources(userId);
  }
}
