import { IsDateString, IsUrl } from 'class-validator';

export class CreateExamDto {
  @IsUrl()
  fileUrl!: string;

  @IsDateString({}, { message: 'time must be a valid ISO date' })
  timeEnd!: string;

  @IsDateString({}, { message: 'time must be a valid ISO date' })
  duration!: string;
}
