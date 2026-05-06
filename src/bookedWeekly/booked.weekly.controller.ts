import {
  Controller,
  Post,
  Param,
  Req,
  ParseUUIDPipe,
  Body,
  ParseDatePipe,
  Query,
} from '@nestjs/common';
import { BookedWeeklyService } from './booked.weekly.service';
import RolesDecorator from 'src/decorator/roles.decorator';
import { STUDENT } from 'src/utils';

@Controller('booked-weekly')
export class BookedWeeklyController {
  constructor(private readonly bookedService: BookedWeeklyService) {}

  @RolesDecorator(STUDENT)
  @Post(':centerId')
  toggleBooked(
    @Param('centerId', ParseUUIDPipe) centerId: string,
    @Query('teacherDayId', ParseUUIDPipe) teacherDayId: string,
    @Req() req,
  ) {
    return this.bookedService.toggleBookedStudent(
      centerId,
      req.user.profileId,
      teacherDayId,
    );
  }
}
