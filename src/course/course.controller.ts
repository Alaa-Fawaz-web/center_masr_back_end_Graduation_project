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
  ParseIntPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { TEACHER } from 'src/utils';
import GetAllCourseDto from './dto/getAllCourseDto';
import QueryPageDto from 'src/validators/queryPageDto';
import QueryDto from 'src/validators/query.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAll(
    @Query() queryDto: QueryDto,
    @Body() getAllCourseDto: GetAllCourseDto,
  ) {
    const { page, id: teacherId } = queryDto;
    return this.courseService.findAll(page, teacherId, getAllCourseDto);
  }

  @Get(':courseId')
  findOne(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.courseService.findOne(courseId);
  }

  @RolesDecorator(TEACHER)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.courseService.create(req.user.profileId, createCourseDto);
  }

  @RolesDecorator(TEACHER)
  @Patch(':lessonId')
  update(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req,
  ) {
    return this.courseService.update(
      lessonId,
      req.user.profileId,
      updateCourseDto,
    );
  }

  @RolesDecorator(TEACHER)
  @Delete(':courseId')
  remove(@Param('courseId', ParseUUIDPipe) courseId: string, @Req() req) {
    return this.courseService.remove(courseId, req.user.profileId);
  }
}
