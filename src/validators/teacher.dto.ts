import {
  IsArray,
  IsInt,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { IsInSet, Trim } from './is-in-set.validator';
import {
  classRoomSet,
  educationalStageSet,
  studyMaterialSet,
  studySystemSet,
} from 'src/utils/constant';

export class TeacherDto {
  @Trim()
  @IsPhoneNumber('EG', { message: 'invalid Egyptian phone number' })
  whatsPhone?: string;

  @Trim()
  @IsString()
  bio?: string;

  @IsArray()
  @IsInSet(studySystemSet, { each: true })
  studySystem?: ('عربي' | 'لغات')[];

  @IsArray()
  @IsInSet(classRoomSet, { each: true })
  classRoom?: string[];

  @Trim()
  @IsInSet(studyMaterialSet)
  studyMaterial?: string;

  @Trim()
  @IsInSet(educationalStageSet)
  educationalStage?: string;

  @IsString()
  educationalQualification?: string;

  @IsInt()
  @Min(0)
  @Max(35)
  experienceYear?: number;

  @IsInt()
  @Min(0)
  sharePrice?: number;
}
