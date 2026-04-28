import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { HomeWorkService } from './home-work.service';
import { CreateHomeWorkDto } from './dto/create-home-work.dto';
import { GetAllLessonDto } from 'src/lesson/dto/getAllLessonDto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { TEACHER } from 'src/utils';

@Controller('home-works')
export class HomeWorkController {
  constructor(private readonly homeWorkService: HomeWorkService) {}

  @Get()
  findAll(
    @Query('courseId', ParseUUIDPipe) courseId,
    @Body() getAllHomeWorkDto: GetAllLessonDto,
    @Req() req,
  ) {
    return this.homeWorkService.findAll(
      courseId,
      req.user.profileId,
      getAllHomeWorkDto,
    );
  }

  @Get(':homeWorkId')
  findOne(@Param('homeWorkId', ParseUUIDPipe) homeWorkId: string, @Req() req) {
    return this.homeWorkService.findOne(homeWorkId, req.user.profileId);
  }

  @RolesDecorator(TEACHER)
  @Post(':lessonId')
  create(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Query('courseId', ParseUUIDPipe) courseId: string,
    @Body() createHomeWorkDto: CreateHomeWorkDto,
    @Req() req,
  ) {
    return this.homeWorkService.create(
      courseId,
      req.user.profileId,
      lessonId,
      createHomeWorkDto,
    );
  }

  @RolesDecorator(TEACHER)
  @Patch(':homeWorkId')
  update(
    @Param('homeWorkId', ParseUUIDPipe) homeWorkId: string,
    @Body() updateHomeWorkDto: CreateHomeWorkDto,
    @Req() req,
  ) {
    return this.homeWorkService.update(
      homeWorkId,
      req.user.profileId,
      updateHomeWorkDto,
    );
  }

  @RolesDecorator(TEACHER)
  @Delete(':homeWorkId')
  remove(
    @Param('homeWorkId', ParseUUIDPipe) homeWorkId: string,
    @Query('courseId', ParseUUIDPipe) courseId,
    @Req() req,
  ) {
    return this.homeWorkService.remove(
      homeWorkId,
      courseId,
      req.user.profileId,
    );
  }
}
