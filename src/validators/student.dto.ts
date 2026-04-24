import { classRoomSet, educationalStageSet } from 'src/utils/constant';
import { IsInSet, Trim } from './is-in-set.validator';
import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty()
  @IsArray()
  @Trim()
  @IsInSet(classRoomSet, { each: true })
  classRoom?: string;

  @ApiProperty()
  @Trim()
  @IsInSet(educationalStageSet, { each: true })
  educationalStage?: string;
}
