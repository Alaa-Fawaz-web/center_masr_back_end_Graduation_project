import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TeacherCenterService } from './teacher-center.service';
import { CreateTeacherCenterDto } from './dto/create-teacher-center.dto';
import { UpdateTeacherCenterDto } from './dto/update-teacher-center.dto';

@Controller('teacher-center')
export class TeacherCenterController {
  constructor(private readonly teacherCenterService: TeacherCenterService) {}

  @Post()
  create(@Body() createTeacherCenterDto: CreateTeacherCenterDto) {
    return this.teacherCenterService.create(createTeacherCenterDto);
  }

  @Get()
  findAll() {
    return this.teacherCenterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherCenterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeacherCenterDto: UpdateTeacherCenterDto,
  ) {
    return this.teacherCenterService.update(+id, updateTeacherCenterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherCenterService.remove(+id);
  }
}
