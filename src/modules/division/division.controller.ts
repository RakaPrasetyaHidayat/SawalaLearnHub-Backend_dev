import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DivisionService } from './division.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/database.enum';
import { CreateDivisionDto, UpdateDivisionDto } from './dto/division.dto';

@ApiTags('Divisions')
@Controller('divisions')
@UseGuards(JwtAuthGuard)
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) {}

  @Get()
  async getAllDivisions() {
    return await this.divisionService.getAllDivisions();
  }

  @Get(':id')
  async getDivisionById(@Param('id') id: string) {
    return await this.divisionService.getDivisionById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createDivision(@Body() createDivisionDto: CreateDivisionDto) {
    return await this.divisionService.createDivision(
      createDivisionDto.name,
      createDivisionDto.description
    );
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateDivision(
    @Param('id') id: string,
    @Body() updateDivisionDto: UpdateDivisionDto
  ) {
    return await this.divisionService.updateDivision(id, updateDivisionDto.description);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteDivision(@Param('id') id: string) {
    return await this.divisionService.deleteDivision(id);
  }
}
