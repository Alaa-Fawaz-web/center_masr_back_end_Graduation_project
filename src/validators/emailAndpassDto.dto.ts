import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export default class EmailAndPassDto {
  @ApiProperty({
    description: 'البريد الإلكتروني',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'بريد إلكتروني غير صالح' })
  email!: string;

  @ApiProperty({
    description:
      'كلمة المرور (9 أحرف على الأقل، 3 أحرف كبيرة، 3 أحرف صغيرة، 3 أرقام)',
    example: 'StrongPass123',
    required: true,
  })
  @IsStrongPassword(
    {
      minLength: 9,
      minUppercase: 3,
      minLowercase: 3,
      minNumbers: 3,
      minSymbols: 0,
    },
    { message: 'كلمة المرور ضعيفة' },
  )
  password!: string;
}
