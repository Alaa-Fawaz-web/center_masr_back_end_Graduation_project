import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleTeacherAndCenterDto } from 'src/validators/roles.dto';

export class GetAllUsersDto {
  @IsEnum(RoleTeacherAndCenterDto)
  role!: RoleTeacherAndCenterDto;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  educationalStage?: string;

  @IsOptional()
  @IsString()
  governorate?: string;

  @IsOptional()
  @IsString()
  studyMaterial?: string;

  @IsOptional()
  @IsString()
  classRoom?: string;
}
