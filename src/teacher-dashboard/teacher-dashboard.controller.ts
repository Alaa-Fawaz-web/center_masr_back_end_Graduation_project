import { Controller, Get, Req } from '@nestjs/common';
import { TeacherDashboardService } from './teacher-dashboard.service';
import { TEACHER } from 'src/utils';
import RolesDecorator from 'src/decorator/roles.decorator';

@Controller('teacher-dashboard')
export class TeacherDashboardController {
  constructor(
    private readonly teacherDashboardService: TeacherDashboardService,
  ) {}

  @RolesDecorator(TEACHER)
  @Get('students')
  findAllStudents(@Req() req) {
    return this.teacherDashboardService.findAllStudents(req.user.profileId);
  }
}
