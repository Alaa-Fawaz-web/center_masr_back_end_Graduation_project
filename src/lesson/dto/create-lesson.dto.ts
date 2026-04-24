import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

const videoUrlRegex =
  /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?.*\.(mp4|mov|avi|webm)$/i;

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  description!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(videoUrlRegex)
  videoUrl?: string;
}
