import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateExamDto {
  @ApiProperty()
  @Trim()
  @IsUrl()
  fileUrl!: string;
}
