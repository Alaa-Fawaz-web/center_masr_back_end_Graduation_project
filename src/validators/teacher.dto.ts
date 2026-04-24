import { IsArray, IsInt, IsString, Max, Min } from 'class-validator';
import { IsInSet, Trim } from './is-in-set.validator';
import {
  classRoomSet,
  studyMaterialSet,
  studySystemSet,
} from 'src/utils/constant';
import { ApiProperty } from '@nestjs/swagger';

export class TeacherDto {
  @ApiProperty()
  @Trim()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsArray()
  @IsInSet(studySystemSet, { each: true })
  studySystem?: ('arabic' | 'english')[];

  @ApiProperty()
  @IsArray()
  @IsInSet(classRoomSet, { each: true })
  classRooms?: string[];

  @ApiProperty()
  @Trim()
  @IsInSet(studyMaterialSet)
  studyMaterial?: string;

  @ApiProperty()
  @IsString()
  educationalQualification?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  experienceYear?: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  sharePrice?: number;
}
