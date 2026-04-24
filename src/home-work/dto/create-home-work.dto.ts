import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateHomeWorkDto {
  @ApiProperty({
    description: 'رابط ملف الواجب المنزلي (يدعم الروابط الآمنة http/https)',
    example: 'https://example.com/homework.pdf',
    required: true,
  })
  @Trim()
  @IsUrl({}, { message: 'الرجاء إدخال رابط صالح يبدأ بـ' })
  fileUrl!: string;
}
