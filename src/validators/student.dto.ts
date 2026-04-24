import { classRoomSet, educationalStageSet } from 'src/utils/constant';
import { IsInSet, Trim } from './is-in-set.validator';
import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentDto {
  @ApiPropertyOptional({
    description: 'الصفوف الدراسية (مصفوفة)',
    example: ['first grade elementary', 'second grade elementary'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @Trim()
  @IsInSet(classRoomSet, { each: true, message: 'صف دراسي غير صالح' })
  classRoom?: string;

  @ApiPropertyOptional({
    description: 'المرحلة التعليمية',
    example: 'elementary',
  })
  @IsOptional()
  @Trim()
  @IsInSet(educationalStageSet, { message: 'مرحلة تعليمية غير صالحة' })
  educationalStage?: string;
}
