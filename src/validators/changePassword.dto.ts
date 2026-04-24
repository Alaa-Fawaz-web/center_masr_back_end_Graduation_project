import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'كلمة المرور القديمة',
    example: 'OldPass123',
    required: true,
  })
  @Matches(/^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/, {
    message:
      'كلمة المرور القديمة ضعيفة - يجب أن تحتوي على 3 أحرف كبيرة و3 أحرف صغيرة و3 أرقام على الأقل وطول 9 أحرف',
  })
  oldPassword!: string;

  @ApiProperty({
    description: 'كلمة المرور الجديدة',
    example: 'NewPass456',
    required: true,
  })
  @Matches(/^(?=(?:.*[A-Z]){3,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){3,}).{9,}$/, {
    message:
      'كلمة المرور الجديدة ضعيفة - يجب أن تحتوي على 3 أحرف كبيرة و3 أحرف صغيرة و3 أرقام على الأقل وطول 9 أحرف',
  })
  newPassword!: string;
}
