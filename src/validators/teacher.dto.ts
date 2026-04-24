import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { IsInSet, Trim } from './is-in-set.validator';
import {
  classRoomSet,
  studyMaterialSet,
  studySystemSet,
} from 'src/utils/constant';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TeacherDto {
  @ApiPropertyOptional({
    description: 'نبذة عن المعلم',
    example: 'مدرس رياضيات خبرة 10 سنوات',
  })
  @IsOptional()
  @Trim()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'نظام الدراسة',
    enum: ['arabic', 'english'],
    example: ['arabic', 'english'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsInSet(studySystemSet, { each: true })
  studySystem?: ('arabic' | 'english')[];

  @ApiPropertyOptional({
    description: 'الصفوف التي يدرسها المعلم',
    example: ['first grade elementary', 'second grade elementary'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsInSet(classRoomSet, { each: true, message: 'صف دراسي غير صالح' })
  classRooms?: string[];

  @ApiPropertyOptional({
    description: 'المادة الدراسية الرئيسية للمعلم',
    example: 'math',
  })
  @IsOptional()
  @Trim()
  @IsInSet(studyMaterialSet, { message: 'مادة دراسية غير صالحة' })
  studyMaterial?: string;

  @ApiPropertyOptional({
    description: 'المؤهل التعليمي',
    example: 'بكالوريوس علوم',
  })
  @IsOptional()
  @Trim()
  @IsString()
  educationalQualification?: string;

  @ApiPropertyOptional({
    description: 'سنوات الخبرة',
    example: 5,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsInt({ message: 'يجب أن يكون رقمًا صحيحًا' })
  @Min(0, { message: 'لا يمكن أن يكون أقل من 0' })
  @Max(100, { message: 'لا يمكن أن يزيد عن 100' })
  experienceYear?: number;

  @ApiPropertyOptional({
    description: 'سعر الحصة (بالجنيه)',
    example: 150,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'يجب أن يكون رقمًا صحيحًا' })
  @Min(0, { message: 'لا يمكن أن يكون سالبًا' })
  sharePrice?: number;
}
