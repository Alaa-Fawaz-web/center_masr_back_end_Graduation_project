import { IsUrl } from 'class-validator';

export class CreateNoteDto {
  @IsUrl()
  fileUrl!: string;
}
