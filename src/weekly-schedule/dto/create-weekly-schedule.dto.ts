import {
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TeacherDayDto } from './TeacherDayDto';
import { IsInSet } from 'src/validators/is-in-set.validator';
import { classRoomSet } from 'src/utils/constant';

export class CreateWeeklyDto {
  @IsString()
  @IsInSet(classRoomSet, { each: true })
  classRoom!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeacherDayDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  dataDays!: TeacherDayDto[];
}
