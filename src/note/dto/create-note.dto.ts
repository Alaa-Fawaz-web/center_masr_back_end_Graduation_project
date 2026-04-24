import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateNoteDto {
  @ApiProperty()
  @Trim()
  @IsUrl()
  fileUrl!: string;
}
