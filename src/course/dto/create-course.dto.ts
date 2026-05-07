import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import {
  classRoomSet,
  studyMaterialSet,
  weekDays,
  weekDaysSet,
} from 'src/utils/constant';
import { IsInSet, Trim } from 'src/validators/is-in-set.validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsDateString({}, { message: 'time must be a valid ISO date' })
  time!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @Trim()
  @IsInSet(weekDaysSet)
  day!: string;

  @Trim()
  @IsInSet(studyMaterialSet)
  studyMaterial!: string;

  @Trim()
  @IsString()
  @IsInSet(classRoomSet, { each: true })
  classRoom!: string;
}
