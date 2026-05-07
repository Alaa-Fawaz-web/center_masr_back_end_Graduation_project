import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreatePostDto {
  @Trim()
  @IsString({ message: 'title is required' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  @MaxLength(500, { message: 'title must be less than 100 characters' })
  title!: string;

  @Trim()
  @IsOptional()
  @IsUrl({}, { message: 'imageUrl must be a valid URL' })
  imageUrl?: string;
}
