import { Controller, Get, Req } from '@nestjs/common';
import { StudentDashboardService } from './student-dashboard.service';

@Controller('dashboard-student')
export class StudentDashboardController {
  constructor(
    private readonly studentDashboardService: StudentDashboardService,
  ) {}

  @Get('lessons')
  findAllLessons(@Req() req) {
    return this.studentDashboardService.findAllLessons(req.user.profileId);
  }

  @Get('shares')
  findAllShares(@Req() req) {
    return this.studentDashboardService.findAllShares(req.user.profileId);
  }
  @Get('exam-home-worke')
  findAllExamHomeWorke(@Req() req) {
    return this.studentDashboardService.findAllExamHomeWorke(
      req.user.profileId,
    );
  }
}
