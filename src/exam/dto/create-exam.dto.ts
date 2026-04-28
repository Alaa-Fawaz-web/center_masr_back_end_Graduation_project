import { IsDateString, IsUrl } from 'class-validator';

export class CreateExamDto {
  @IsUrl()
  fileUrl!: string;

  @IsDateString()
  timeEnd!: string;

  @IsDateString()
  duration!: string;
}
