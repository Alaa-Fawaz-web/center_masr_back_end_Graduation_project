import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { WeeklyScheduleService } from './weekly-schedule.service';
import { GetWeeklyScheduleDto } from './dto/GetWeeklyScheduleDto';
import { CreateWeeklyDto } from './dto/create-weekly-schedule.dto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { CENTER } from 'src/utils';
import { TeacherDayDto } from './dto/TeacherDayDto';

@Controller('weekly-schedule')
export class WeeklyScheduleController {
  constructor(private readonly service: WeeklyScheduleService) {}

  @Get(':centerId')
  getWeeklySchedule(
    @Param('centerId', ParseUUIDPipe) centerId: string,
    @Query() getWeeklyScheduleDto: GetWeeklyScheduleDto,
    @Req() req,
  ) {
    const { profileId, role } = req.user;
    return this.service.getWeeklySchedule(
      centerId,
      getWeeklyScheduleDto.classRoom,
      profileId,
      role,
    );
  }

  @RolesDecorator(CENTER)
  @Post()
  createWeeklySchedule(
    @Body() createWeeklyScheduleDto: CreateWeeklyDto,
    @Req() req,
  ) {
    return this.service.createWeeklySchedule(
      req.user.profileId,
      createWeeklyScheduleDto,
    );
  }

  @RolesDecorator(CENTER)
  @Post(':weeklyScheduleId')
  createTeacherDayWeeklySchedule(
    @Param('weeklyScheduleId', ParseUUIDPipe) weeklyScheduleId: string,
    @Body() teacherDayDto: TeacherDayDto,
    @Req() req,
  ) {
    return this.service.createtTeacherDayWeeklySchedule(
      req.user.profileId,
      weeklyScheduleId,
      teacherDayDto,
    );
  }

  @RolesDecorator(CENTER)
  @Patch(':id')
  updateWeeklySchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: any,
    @Req() req,
  ) {
    return this.service.updateWeeklySchedule(id, data, req.user.profileId);
  }

  @RolesDecorator(CENTER)
  @Delete(':weeklyScheduleId')
  deleteWeeklySchedule(
    @Param('weeklyScheduleId', ParseUUIDPipe) weeklyScheduleId: string,
    @Req() req,
  ) {
    return this.service.deleteWeeklySchedule(
      weeklyScheduleId,
      req.user.profileId,
    );
  }

  @RolesDecorator(CENTER)
  @Delete('teacherDay:teacherDayId')
  deleteTeacherWeeklySchedule(
    @Param('teacherDayId', ParseUUIDPipe) teacherDayId: string,
    @Req() req,
  ) {
    return this.service.deleteTeacherDayWeeklySchedule(
      teacherDayId,
      req.user.profileId,
    );
  }
}
