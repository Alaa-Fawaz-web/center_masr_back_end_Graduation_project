import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateExamDto {
  @ApiProperty({
    description: 'رابط ملف الامتحان (pdf, doc, أو صورة)',
    example: 'https://example.com/exam.pdf',
    required: true,
  })
  @Trim()
  @IsUrl({}, { message: 'يجب أن يكون رابطاً صالحاً يبدأ' })
  fileUrl!: string;
}
