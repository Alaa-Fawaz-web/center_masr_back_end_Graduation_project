import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

const videoUrlRegex =
  /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?.*\.(mp4|mov|avi|webm)$/i;

export class CreateLessonDto {
  @Trim()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title!: string;

  @Trim()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  duration!: string;

  @Trim()
  @IsOptional()
  @IsString()
  @Matches(videoUrlRegex)
  videoUrl?: string;
}
