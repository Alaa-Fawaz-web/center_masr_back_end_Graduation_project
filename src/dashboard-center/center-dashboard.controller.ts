import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CenterDashboardService } from './center-dashboard.service';
import { CENTER } from 'src/utils';
import RolesDecorator from 'src/decorator/roles.decorator';
import { GetAllDashboardCenterTeacherDto } from './dto/getAllTeacherDto';
import { CreateTeachersDto } from './dto/CreateTeachersDto';

@Controller('center-dashboard')
export class CenterDashboardController {
  constructor(
    private readonly centerDashboardService: CenterDashboardService,
  ) {}

  @RolesDecorator(CENTER)
  @Post('teachers')
  CreateTeachers(@Body() createTeahersDto: CreateTeachersDto, @Req() req) {
    return this.centerDashboardService.createTeachers(
      req.user.profileId,
      createTeahersDto,
    );
  }

  @Get('teachers/:centerId')
  findAllTeachers(
    @Query('limit', ParseIntPipe) limit: number,
    // @Query() getAllDashboardCenterTeacherDto: GetAllDashboardCenterTeacherDto,
    @Param('centerId', ParseUUIDPipe) centerId: string,
    // @Req() req,
  ) {
    return this.centerDashboardService.findAllTeacher(
      centerId,
      limit,
      // getAllDashboardCenterTeacherDto.name,
      // getAllDashboardCenterTeacherDto.educationalStage,
    );
  }
  @RolesDecorator(CENTER)
  @Get('students')
  findAllStudents(@Req() req) {
    return this.centerDashboardService.findAllStudents(req.user.profileId);
  }
}
