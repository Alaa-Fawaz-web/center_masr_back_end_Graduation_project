import { Controller, Post, Param, Req, ParseUUIDPipe } from '@nestjs/common';
import { BookedWeeklyService } from './booked.weekly.service';
import RolesDecorator from 'src/decorator/roles.decorator';
import { STUDENT } from 'src/utils';

@Controller('booked-weekly')
export class BookedWeeklyController {
  constructor(private readonly bookedService: BookedWeeklyService) {}

  @RolesDecorator(STUDENT)
  @Post(':teacherDayId')
  toggleBooked(
    @Param('teacherDayId', ParseUUIDPipe) teacherDayId: string,
    @Req() req,
  ) {
    return this.bookedService.toggleBookedStudent(
      req.user.profileId,
      teacherDayId,
    );
  }
}
