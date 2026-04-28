import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonService } from './lesson.service';
import RolesDecorator from 'src/decorator/roles.decorator';
import { GetAllLessonDto } from './dto/getAllLessonDto';
import QueryDto from 'src/validators/query.dto';
import { TEACHER } from 'src/utils';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get(':lessonId')
  getLesson(@Param('lessonId', ParseUUIDPipe) lessonId: string, @Req() req) {
    return this.lessonService.getLesson(lessonId, req.user.profileId);
  }

  @Get()
  getAllLessons(
    @Query() queryDto: QueryDto,
    @Body() getAllLessonsDto: GetAllLessonDto,
    @Req() req,
  ) {
    return this.lessonService.getAllLessons(
      queryDto,
      req.user.profileId,
      getAllLessonsDto,
    );
  }

  @RolesDecorator(TEACHER)
  @Post(':courseId')
  createLesson(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() createLessonDto: CreateLessonDto,
    @Req() req,
  ) {
    return this.lessonService.createLesson(
      req.user.profileId,
      courseId,
      createLessonDto,
    );
  }

  @RolesDecorator(TEACHER)
  @Patch(':lessonId')
  updateLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @Req() req,
  ) {
    return this.lessonService.updateLesson(
      req.user.profileId,
      lessonId,
      updateLessonDto,
    );
  }

  @RolesDecorator(TEACHER)
  @Delete(':lessonId')
  deleteLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Req() req,
  ) {
    return this.lessonService.deleteLesson(
      req.user.profileId,
      lessonId,
      courseId,
    );
  }
}
