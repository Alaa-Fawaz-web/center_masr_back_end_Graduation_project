import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInSet, Trim, UniqueArray } from './is-in-set.validator';
import {
  educationalStageSet,
  studyMaterialSet,
  studySystemSet,
} from 'src/utils/constant';

export class CenterDto {
  @ApiPropertyOptional({
    description: 'اسم المركز (اختياري)',
    example: 'مركز الأهرام التعليمي',
  })
  @IsOptional()
  @Trim()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'نبذة عن المركز (اختياري)',
    example: 'نقدم خدمات تعليمية متميزة...',
  })
  @IsOptional()
  @Trim()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'المحافظة (اختياري)',
    example: 'القاهرة',
  })
  @IsOptional()
  @Trim()
  @IsString()
  governorate?: string;

  @ApiPropertyOptional({
    description: 'نظام الدراسة (اختياري)',
    enum: ['arabic', 'english'],
    example: ['arabic', 'english'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsInSet(studySystemSet, { each: true })
  studySystem?: ('arabic' | 'english')[];

  @ApiPropertyOptional({
    description: 'المواد الدراسية (اختياري)',
    example: ['math', 'physics'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @UniqueArray()
  @IsInSet(studyMaterialSet, { each: true })
  studyMaterials?: string[];

  @ApiPropertyOptional({
    description: 'أرقام الهواتف للتواصل (اختياري) - تنسيق مصري',
    example: ['01234567890', '01122334455'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @Matches(/^01[0-9]{9}$/, { each: true, message: 'رقم هاتف غير صالح' })
  contactUsPhone?: string[];

  @ApiPropertyOptional({
    description: 'المراحل التعليمية (اختياري)',
    example: ['primary', 'secondary'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @UniqueArray()
  @IsInSet(educationalStageSet, { each: true })
  educationalStage?: string[];

  @ApiPropertyOptional({
    description: 'البريد الإلكتروني للتواصل (اختياري)',
    example: ['info@center.com', 'support@center.com'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true, message: 'بريد إلكتروني غير صالح' })
  contactUsEmail?: string[];
}
