import { classRoomSet, educationalStageSet } from 'src/utils/constant';
import { IsInSet, Trim } from './is-in-set.validator';
import { IsArray } from 'class-validator';
export class StudentDto {
  @IsArray()
  @Trim()
  @IsInSet(classRoomSet, { each: true })
  classRoom?: string;

  @Trim()
  @IsInSet(educationalStageSet, { each: true })
  educationalStage?: string;
}
