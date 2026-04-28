import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import BaseDataUserDto from 'src/validators/baseDataUser.dto';
import { TeacherDto } from 'src/validators/teacher.dto';
import { CenterDto } from 'src/validators/center.dto';
import { StudentDto } from 'src/validators/student.dto';

export class BaseUserDto extends PartialType(
  OmitType(BaseDataUserDto, ['password']),
) {}

class baseTeacherDto extends PartialType(TeacherDto) {}
class baseCenterDto extends PartialType(CenterDto) {}
class baseStudentDto extends PartialType(StudentDto) {}

export class UpdateUserDto extends IntersectionType(
  BaseUserDto,
  baseTeacherDto,
  baseCenterDto,
  baseStudentDto,
) {}
