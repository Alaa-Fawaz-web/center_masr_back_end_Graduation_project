import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsDateString({}, { message: 'time must be a valid ISO date' })
  time!: string;

  @IsNotEmpty()
  @IsString()
  studyMaterial!: string;

  @IsNotEmpty()
  @IsString()
  classRoom!: string;
}
