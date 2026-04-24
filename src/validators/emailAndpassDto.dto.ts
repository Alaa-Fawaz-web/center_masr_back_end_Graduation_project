import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, Matches } from 'class-validator';

export default class EmailAndPassDto {
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsStrongPassword({
    minLength: 9,
    minUppercase: 3,
    minLowercase: 3,
    minNumbers: 3,
    minSymbols: 0,
  })
  password!: string;
}
