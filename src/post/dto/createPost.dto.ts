import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreatePostDto {
  @ApiProperty()
  @Trim()
  @IsString({ message: 'title is required' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  @MaxLength(100, { message: 'title must be less than 100 characters' })
  title!: string;

  @ApiProperty()
  @Trim()
  @IsString({ message: 'content is required' })
  @MinLength(3, { message: 'content must be at least 3 characters' })
  @MaxLength(500, { message: 'content must be less than 500 characters' })
  content!: string;

  @ApiProperty()
  @Trim()
  @IsOptional()
  @IsUrl({}, { message: 'imageUrl must be a valid URL' })
  imageUrl?: string;
}
