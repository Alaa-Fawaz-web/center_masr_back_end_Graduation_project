import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @Matches(/^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/)
  oldPassword!: string;

  @ApiProperty()
  @Matches(/^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/, {
    message: 'Weak password',
  })
  newPassword!: string;
}
