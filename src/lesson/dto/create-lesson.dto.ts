import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator'; // تأكد من صحة المسار

const videoUrlRegex =
  /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?.*\.(mp4|mov|avi|webm)$/i;

export class CreateLessonDto {
  @ApiProperty({
    description: 'عنوان الدرس',
    example: 'مقدمة في البرمجة',
    required: true,
  })
  @Trim()
  @IsString({ message: 'العنوان يجب أن يكون نصاً' })
  @MinLength(3, { message: 'العنوان يجب أن لا يقل عن 3 أحرف' })
  @MaxLength(100, { message: 'العنوان يجب أن لا يزيد عن 100 حرف' })
  title!: string;

  @ApiProperty({
    description: 'وصف الدرس',
    example: 'شرح أساسيات البرمجة باستخدام JavaScript',
    required: true,
  })
  @Trim()
  @IsString({ message: 'الوصف يجب أن يكون نصاً' })
  @MinLength(3, { message: 'الوصف يجب أن لا يقل عن 3 أحرف' })
  @MaxLength(500, { message: 'الوصف يجب أن لا يزيد عن 500 حرف' })
  description!: string;

  @ApiPropertyOptional({
    description: 'رابط فيديو الدرس (يدعم mp4, mov, avi, webm)',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  @Trim()
  @IsString({ message: 'رابط الفيديو يجب أن يكون نصاً' })
  @Matches(videoUrlRegex, {
    message: 'رابط الفيديو غير صالح - يجب أن ينتهي بـ mp4, mov, avi, webm',
  })
  videoUrl?: string;
}
