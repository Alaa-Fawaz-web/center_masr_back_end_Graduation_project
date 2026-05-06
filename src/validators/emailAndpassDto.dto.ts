import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsLowercase,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export default class EmailAndPassDto {
  @IsEmail()
  @Transform(({ value }) => value?.toLocaleLowerCase())
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
