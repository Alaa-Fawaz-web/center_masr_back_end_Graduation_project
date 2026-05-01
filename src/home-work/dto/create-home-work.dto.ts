import { IsDateString, IsUrl } from 'class-validator';

export class CreateHomeWorkDto {
  @IsUrl()
  fileUrl!: string;

  // @IsDateString({}, { message: 'time must be a valid ISO date' })
  timeEnd!: string;
}
