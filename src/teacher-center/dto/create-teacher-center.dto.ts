import { IsOptional, IsPhoneNumber } from 'class-validator';
import { TeacherDto } from 'src/validators/teacher.dto';

export class CreateTeacherCenterDto extends TeacherDto {
  @IsOptional()
  @IsPhoneNumber('EG', { message: 'invalid Egyptian phone number' })
  whatsApp?: string;
}
