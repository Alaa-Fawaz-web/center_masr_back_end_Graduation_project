import { IsArray, IsInt, IsString, Max, Min } from 'class-validator';
import { IsInSet, Trim } from './is-in-set.validator';
import {
  classRoomSet,
  studyMaterialSet,
  studySystemSet,
} from 'src/utils/constant';

export class TeacherDto {
  @Trim()
  @IsString()
  bio?: string;

  @IsArray()
  @IsInSet(studySystemSet, { each: true })
  studySystem?: ('arabic' | 'english')[];

  @IsArray()
  @IsInSet(classRoomSet, { each: true })
  classRoom?: string[];

  @Trim()
  @IsInSet(studyMaterialSet)
  studyMaterial?: string;

  @IsString()
  educationalQualification?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  experienceYear?: number;

  @IsInt()
  @Min(0)
  sharePrice?: number;
}
