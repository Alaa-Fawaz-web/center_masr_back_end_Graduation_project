import {
  IsArray,
  IsEmail,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import { IsInSet, Trim, UniqueArray } from './is-in-set.validator';
import {
  classRoomSet,
  educationalStageSet,
  studyMaterialSet,
  studySystemSet,
} from 'src/utils/constant';

export class CenterDto {
  @Trim()
  @IsPhoneNumber('EG', { message: 'invalid Egyptian phone number' })
  whatsPhone?: string;

  @Trim()
  @IsString()
  name?: string;

  @Trim()
  @IsString()
  bio?: string;

  @Trim()
  @IsString()
  governorate?: string;

  @Trim()
  @IsString()
  location?: string;

  @IsArray()
  @IsInSet(studySystemSet, { each: true })
  studySystem?: ('عربي' | 'انجليزي')[];

  // @IsArray()
  // @IsInSet(classRoomSet, { each: true })
  // classRoom?: string[];

  @IsArray()
  @UniqueArray()
  @IsInSet(studyMaterialSet, { each: true })
  studyMaterials?: string[];

  // { message: 'invalid Egyptian phone number' },
  @IsArray()
  @IsPhoneNumber('EG', { each: true, message: 'invalid Egyptian phone number' })
  // @Matches(/^01[0-9]{9}$/, { each: true })
  contactUsPhone?: string[];

  @IsArray()
  @UniqueArray()
  @IsInSet(educationalStageSet, { each: true })
  educationalStage?: string[];

  @Trim()
  @IsEmail()
  contactUsEmail?: string;
}
