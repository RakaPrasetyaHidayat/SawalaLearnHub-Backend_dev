import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InternsService } from './interns.service';
import { CreateInternDto, UpdateInternDto, FilterInternsDto } from './dto/intern.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Interns')
@Controller('interns')
@UseGuards(JwtAuthGuard)
export class InternsController {
  constructor(private readonly internsService: InternsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() createInternDto: CreateInternDto) {
    return this.internsService.create(createInternDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterInternsDto) {
    return this.internsService.findAll(filterDto);
  }

  @Get('angkatan/:angkatan')
  findByAngkatan(@Param('angkatan') angkatan: number) {
    return this.internsService.findByAngkatan(angkatan);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateInternDto: UpdateInternDto) {
    return this.internsService.update(id, updateInternDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.internsService.remove(id);
  }
}
