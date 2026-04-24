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
} from '@nestjs/common';
import { WeeklyScheduleService } from './weekly-schedule.service';
import { GetWeeklyScheduleDto } from './dto/GetWeeklyScheduleDto';
import { CreateWeeklyDto } from './dto/create-weekly-schedule.dto';
import RolesDecorator from 'src/decorator/roles.decorator';
import { CENTER } from 'src/utils';
import { TeacherDayDto } from './dto/TeacherDayDto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('weekly-schedule')
@Controller('weekly-schedule')
export class WeeklyScheduleController {
  constructor(private readonly service: WeeklyScheduleService) {}

  @ApiOperation({ summary: 'Get weekly schedule' })
  @Get(':centerId')
  getWeeklySchedule(
    @Param('centerId', ParseUUIDPipe) centerId: string,
    @Body() getWeeklyScheduleDto: GetWeeklyScheduleDto,
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

  @ApiOperation({ summary: 'Create weekly schedule' })
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

  @ApiOperation({ summary: 'Create teacher day weekly schedule' })
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

  @ApiOperation({ summary: 'Update weekly schedule' })
  @RolesDecorator(CENTER)
  @Patch(':id')
  updateWeeklySchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: any,
    @Req() req,
  ) {
    return this.service.updateWeeklySchedule(id, data, req.user.profileId);
  }

  @ApiOperation({ summary: 'Delete weekly schedule' })
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

  @ApiOperation({ summary: 'Delete teacher day weekly schedule' })
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
