import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'رابط الملف المرفق (صورة، فيديو، وثيقة)',
    example: 'https://example.com/uploads/note.pdf',
    required: true,
  })
  @Trim()
  @IsUrl({}, { message: 'يجب أن يكون رابطاً صالحاً' })
  fileUrl!: string;
}
