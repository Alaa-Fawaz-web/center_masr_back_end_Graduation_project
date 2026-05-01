import { PickType } from '@nestjs/mapped-types';
import { CreateWeeklyDto } from './create-weekly-schedule.dto';

export class GetWeeklyScheduleDto extends PickType(CreateWeeklyDto, [
  'classRoom',
]) {}
