import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import BaseDataUserDto from 'src/validators/baseDataUser.dto';
import { TeacherDto } from 'src/validators/teacher.dto';
import { CenterDto } from 'src/validators/center.dto';
import { StudentDto } from 'src/validators/student.dto';
import { Role } from '@prisma/client';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseUserDto extends PartialType(
  OmitType(BaseDataUserDto, ['password', 'role']),
) {}

class baseTeacherDto extends PartialType(TeacherDto) {}
class baseCenterDto extends PartialType(CenterDto) {}
class baseStudentDto extends PartialType(StudentDto) {}

export class UpdateUserDto {
  @ValidateNested()
  @Type(() => BaseUserDto)
  user?: BaseUserDto;

  @ValidateNested()
  @Type(() => baseTeacherDto)
  teacher?: baseTeacherDto;

  @ValidateNested()
  @Type(() => baseCenterDto)
  center?: baseCenterDto;

  @ValidateNested()
  @Type(() => baseStudentDto)
  student?: baseStudentDto;
}
