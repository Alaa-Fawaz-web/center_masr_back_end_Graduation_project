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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { TEACHER } from 'src/utils';
import GetAllCourseDto from './dto/getAllCourseDto';
import QueryDto from 'src/validators/query.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Get all courses' })
  @Get()
  findAll(
    @Query() queryDto: QueryDto,
    @Body() getAllCourseDto: GetAllCourseDto,
  ) {
    const { page, id: teacherId } = queryDto;
    return this.courseService.findAll(page, teacherId, getAllCourseDto);
  }

  @ApiOperation({ summary: 'Get course' })
  @Get(':courseId')
  findOne(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.courseService.findOne(courseId);
  }

  @ApiOperation({ summary: 'Create course' })
  @RolesDecorator(TEACHER)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    return this.courseService.create(req.user.profileId, createCourseDto);
  }

  @ApiOperation({ summary: 'Update course' })
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

  @ApiOperation({ summary: 'Delete course' })
  @RolesDecorator(TEACHER)
  @Delete(':courseId')
  remove(@Param('courseId', ParseUUIDPipe) courseId: string, @Req() req) {
    return this.courseService.remove(courseId, req.user.profileId);
  }
}
