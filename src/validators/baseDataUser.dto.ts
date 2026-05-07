import { Role } from '@prisma/client';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import EmailAndPassDto from './emailAndpassDto.dto';
import { Trim } from './is-in-set.validator';

export default class BaseDataUserDto extends EmailAndPassDto {
  @Trim()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @IsEnum(Role)
  role!: Role;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsPhoneNumber('EG')
  phone!: string;
}
