import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'محتوى التعليق (بين 3 و 500 حرف)',
    example: 'هذا تعليق مفيد وشامل',
    required: true,
  })
  @Trim()
  @IsString({ message: 'محتوى التعليق يجب أن يكون نصاً' })
  @MinLength(3, { message: 'التعليق يجب أن لا يقل عن 3 أحرف' })
  @MaxLength(500, { message: 'التعليق يجب أن لا يزيد عن 500 حرف' })
  content!: string;
}
