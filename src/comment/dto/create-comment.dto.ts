import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateCommentDto {
  @ApiProperty()
  @Trim()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  content!: string;
}
