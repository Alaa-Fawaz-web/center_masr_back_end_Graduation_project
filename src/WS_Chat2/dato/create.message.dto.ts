import { IsString, MinLength, MaxLength } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateMessageDto {
  @Trim()
  @IsString({ message: 'content is required' })
  @MinLength(3, { message: 'content must be at least 3 characters' })
  @MaxLength(500, { message: 'content must be less than 500 characters' })
  content!: string;
}
