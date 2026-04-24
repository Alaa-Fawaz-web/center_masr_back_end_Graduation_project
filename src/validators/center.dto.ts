import { IsArray, IsEmail, IsString, Matches } from 'class-validator';
import { IsInSet, Trim, UniqueArray } from './is-in-set.validator';
import {
  educationalStageSet,
  studyMaterialSet,
  studySystemSet,
} from 'src/utils/constant';
import { ApiProperty } from '@nestjs/swagger';

export class CenterDto {
  @ApiProperty()
  @Trim()
  @IsString()
  name?: string;

  @ApiProperty()
  @Trim()
  @IsString()
  bio?: string;

  @ApiProperty()
  @Trim()
  @IsString()
  governorate?: string;

  @ApiProperty()
  @IsArray()
  @IsInSet(studySystemSet, { each: true })
  studySystem?: ('arabic' | 'english')[];

  @ApiProperty()
  @IsArray()
  @UniqueArray()
  @IsInSet(studyMaterialSet, { each: true })
  studyMaterials?: string[];

  @ApiProperty()
  @IsArray()
  @Matches(/^01[0-9]{9}$/, { each: true })
  contactUsPhone?: string[];

  @ApiProperty()
  @IsArray()
  @UniqueArray()
  @IsInSet(educationalStageSet, { each: true })
  educationalStage?: string[];

  @ApiProperty()
  @IsArray()
  @IsEmail({}, { each: true })
  contactUsEmail?: string[];
}
