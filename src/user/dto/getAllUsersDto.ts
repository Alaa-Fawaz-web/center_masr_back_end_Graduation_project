import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleTeacherAndCenterDto } from 'src/validators/roles.dto';

export class GetAllUsersDto {
  @ApiProperty({
    description: 'دور المستخدم (معلم أو مركز)',
    enum: RoleTeacherAndCenterDto,
    example: RoleTeacherAndCenterDto.TEACHER,
    required: true,
  })
  @IsEnum(RoleTeacherAndCenterDto, {
    message: 'يجب أن يكون الدور إما teacher أو center',
  })
  role!: RoleTeacherAndCenterDto;

  @ApiPropertyOptional({
    description: 'اسم المستخدم (بحث جزئي)',
    example: 'أحمد',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'المرحلة التعليمية',
    example: 'secondary',
  })
  @IsOptional()
  @IsString()
  educationalStage?: string;

  @ApiPropertyOptional({
    description: 'المحافظة',
    example: 'القاهرة',
  })
  @IsOptional()
  @IsString()
  governorate?: string;

  @ApiPropertyOptional({
    description: 'المادة الدراسية',
    example: 'math',
  })
  @IsOptional()
  @IsString()
  studyMaterial?: string;

  @ApiPropertyOptional({
    description: 'الصف الدراسي',
    example: 'first grade elementary',
  })
  @IsOptional()
  @IsString()
  classRoom?: string;
}
