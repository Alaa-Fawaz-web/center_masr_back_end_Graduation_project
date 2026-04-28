import { IsEnum, IsOptional, IsString } from 'class-validator';
import QueryPageDto from 'src/validators/queryPageDto';
import { RoleTeacherAndCenterDto } from 'src/validators/roles.dto';

export class GetAllUsersDto extends QueryPageDto {
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
