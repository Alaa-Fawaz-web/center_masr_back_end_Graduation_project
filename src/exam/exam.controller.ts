import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { GetAllLessonDto } from 'src/lesson/dto/getAllLessonDto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { TEACHER } from 'src/utils';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @ApiOperation({ summary: 'Get all exams' })
  @Get()
  findAll(
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Req() req,
    @Query() getAllExamDto: GetAllLessonDto,
  ) {
    return this.examService.findAll(
      courseId,
      req.user.profileId,
      getAllExamDto,
    );
  }

  @ApiOperation({ summary: 'Get exam' })
  @Get(':examId')
  findOne(@Param('examId', ParseUUIDPipe) examId: string, @Req() req) {
    return this.examService.findOne(req.user.profileId, examId);
  }

  @ApiOperation({ summary: 'Create exam' })
  @RolesDecorator(TEACHER)
  @Post(':lessonId')
  create(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Body() createExamDto: CreateExamDto,
    @Req() req,
  ) {
    return this.examService.create(
      req.user.profileId,
      lessonId,
      courseId,
      createExamDto,
    );
  }

  @ApiOperation({ summary: 'Update exam' })
  @RolesDecorator(TEACHER)
  @Patch(':examId')
  update(
    @Param('examId', ParseUUIDPipe) examId: string,
    @Body() updateExamDto: CreateExamDto,
    @Req() req,
  ) {
    return this.examService.update(examId, req.user.profileId, updateExamDto);
  }

  @ApiOperation({ summary: 'Delete exam' })
  @RolesDecorator(TEACHER)
  @Delete(':examId')
  remove(
    @Param('examId', ParseUUIDPipe) examId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Req() req,
  ) {
    return this.examService.remove(req.user.profileId, examId, courseId);
  }
}
