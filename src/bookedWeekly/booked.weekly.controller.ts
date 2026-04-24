import { Controller, Post, Param, Req, ParseUUIDPipe } from '@nestjs/common';
import { BookedWeeklyService } from './booked.weekly.service';
import RolesDecorator from 'src/decorator/roles.decorator';
import { STUDENT } from 'src/utils';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('booked-weekly')
@Controller('booked-weekly')
export class BookedWeeklyController {
  constructor(private readonly bookedService: BookedWeeklyService) {}

  @ApiOperation({ summary: 'Booked weekly' })
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
