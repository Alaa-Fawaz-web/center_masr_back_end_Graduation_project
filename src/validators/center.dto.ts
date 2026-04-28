import { IsArray, IsEmail, IsString, Matches } from 'class-validator';
import { IsInSet, Trim, UniqueArray } from './is-in-set.validator';
import {
  educationalStageSet,
  studyMaterialSet,
  studySystemSet,
} from 'src/utils/constant';

export class CenterDto {
  @Trim()
  @IsString()
  name?: string;

  @Trim()
  @IsString()
  bio?: string;

  @Trim()
  @IsString()
  governorate?: string;

  @IsArray()
  @IsInSet(studySystemSet, { each: true })
  studySystem?: ('arabic' | 'english')[];

  @IsArray()
  @UniqueArray()
  @IsInSet(studyMaterialSet, { each: true })
  studyMaterials?: string[];

  @IsArray()
  @Matches(/^01[0-9]{9}$/, { each: true })
  contactUsPhone?: string[];

  @IsArray()
  @UniqueArray()
  @IsInSet(educationalStageSet, { each: true })
  educationalStage?: string[];

  @IsArray()
  @IsEmail({}, { each: true })
  contactUsEmail?: string[];
}
