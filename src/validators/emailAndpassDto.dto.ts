import { IsEmail, IsStrongPassword, Matches } from 'class-validator';

export default class EmailAndPassDto {
  @IsEmail()
  email!: string;

  @IsStrongPassword({
    minLength: 9,
    minUppercase: 3,
    minLowercase: 3,
    minNumbers: 3,
    minSymbols: 0,
  })
  password!: string;
}
