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
import { ApiProperty } from '@nestjs/swagger';

export default class BaseDataUserDto extends EmailAndPassDto {
  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('EG', { message: 'invalid Egyptian phone number' })
  whatsApp?: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiProperty()
  @IsEnum(Role)
  role!: Role;

  @ApiProperty()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty()
  @IsPhoneNumber('EG')
  phone!: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  address!: string;
}
