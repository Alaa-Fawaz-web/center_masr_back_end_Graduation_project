import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'توقيت الحصة بصيغة ISO (مثال: 2024-12-31T14:30:00Z)',
    example: '2024-12-31T14:30:00Z',
    required: true,
  })
  @Trim()
  @IsNotEmpty({ message: 'التوقيت مطلوب' })
  @IsDateString(
    {},
    {
      message: 'التوقيت يجب أن يكون بصيغة ISO صالحة (مثل 2024-12-31T14:30:00Z)',
    },
  )
  time!: string;

  @ApiProperty({
    description: 'المادة الدراسية',
    example: 'الرياضيات',
    required: true,
  })
  @Trim()
  @IsNotEmpty({ message: 'المادة الدراسية مطلوبة' })
  @IsString({ message: 'المادة الدراسية يجب أن تكون نصاً' })
  studyMaterial!: string;

  @ApiProperty({
    description: 'الصف الدراسي',
    example: 'الصف الأول الثانوي',
    required: true,
  })
  @Trim()
  @IsNotEmpty({ message: 'الصف الدراسي مطلوب' })
  @IsString({ message: 'الصف الدراسي يجب أن يكون نصاً' })
  classRoom!: string;
}
