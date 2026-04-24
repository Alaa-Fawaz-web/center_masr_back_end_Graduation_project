import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/validators/is-in-set.validator';

export class CreateCourseDto {
  @ApiProperty()
  @Trim()
  @IsNotEmpty()
  @IsDateString({}, { message: 'time must be a valid ISO date' })
  time!: string;

  @ApiProperty()
  @Trim()
  @IsNotEmpty()
  @IsString()
  studyMaterial!: string;

  @ApiProperty()
  @Trim()
  @IsNotEmpty()
  @IsString()
  classRoom!: string;
}
