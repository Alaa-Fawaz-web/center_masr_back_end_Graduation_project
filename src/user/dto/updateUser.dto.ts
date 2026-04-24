import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import BaseDataUserDto from 'src/validators/baseDataUser.dto';
import { TeacherDto } from 'src/validators/teacher.dto';
import { CenterDto } from 'src/validators/center.dto';
import { StudentDto } from 'src/validators/student.dto';
import { PartialType } from '@nestjs/swagger';

export class BaseUserDto extends PartialType(
  OmitType(BaseDataUserDto, ['password'] as const),
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
