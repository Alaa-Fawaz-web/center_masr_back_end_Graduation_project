import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleTeacherAndCenterDto } from 'src/validators/roles.dto';

export class GetAllUsersDto {
  @ApiProperty()
  @IsEnum(RoleTeacherAndCenterDto)
  role!: RoleTeacherAndCenterDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  educationalStage?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  governorate?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  studyMaterial?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  classRoom?: string;
}
