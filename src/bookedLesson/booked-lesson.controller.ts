import { Controller, Post, Param, Req, ParseUUIDPipe } from '@nestjs/common';
import RolesDecorator from 'src/decorator/roles.decorator';
import { BookedLessonService } from './booked-lesson.service';
import { STUDENT } from 'src/utils';

@Controller('booked-lessons')
export class BookedLessonController {
  constructor(private readonly bookedService: BookedLessonService) {}

  @RolesDecorator(STUDENT)
  @Post(':lessonId')
  toggleBooked(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Req() req: any,
  ) {
    return this.bookedService.toggleBookedStudent(req.user.profileId, lessonId);
  }
}
