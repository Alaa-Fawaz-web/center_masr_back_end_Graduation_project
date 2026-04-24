import { Role } from '@prisma/client';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import EmailAndPassDto from './emailAndpassDto.dto';

export default class BaseDataUserDto extends EmailAndPassDto {
  @ApiPropertyOptional({
    description: 'رقم الواتساب (اختياري)',
    example: '+201234567890',
  })
  @IsOptional()
  @IsPhoneNumber('EG')
  whatsApp?: string;

  @ApiProperty({
    description: 'الاسم الكامل للمستخدم',
    example: 'أحمد محمد',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'دور المستخدم (طالب، معلم، مركز، مشرف)',
    enum: Role,
    example: Role.student,
    required: true,
  })
  @IsEnum(Role)
  role!: Role;

  @ApiPropertyOptional({
    description: 'رابط الصورة الشخصية (اختياري)',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'رقم الهاتف (مصري)',
    example: '+201234567890',
    required: true,
  })
  @IsPhoneNumber('EG')
  phone!: string;

  @ApiProperty({
    description: 'العنوان بالكامل',
    example: 'القاهرة - مصر الجديدة',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  address!: string;
}
