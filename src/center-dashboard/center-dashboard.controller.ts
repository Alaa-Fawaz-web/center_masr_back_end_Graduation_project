import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CenterDashboardService } from './center-dashboard.service';
import { CreateCenterDashboardDto } from './dto/create-center-dashboard.dto';
import { UpdateCenterDashboardDto } from './dto/update-center-dashboard.dto';

@Controller('center-dashboard')
export class CenterDashboardController {
  constructor(private readonly centerDashboardService: CenterDashboardService) {}

  @Post()
  create(@Body() createCenterDashboardDto: CreateCenterDashboardDto) {
    return this.centerDashboardService.create(createCenterDashboardDto);
  }

  @Get()
  findAll() {
    return this.centerDashboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.centerDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCenterDashboardDto: UpdateCenterDashboardDto) {
    return this.centerDashboardService.update(+id, updateCenterDashboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.centerDashboardService.remove(+id);
  }
}
