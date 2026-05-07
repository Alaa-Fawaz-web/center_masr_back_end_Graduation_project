import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import BaseDataUserDto from 'src/validators/baseDataUser.dto';
import { TeacherDto } from 'src/validators/teacher.dto';

class baseDataUser extends OmitType(BaseDataUserDto, [
  'password',
  'email',
  'role',
]) {}

export class CreateTeachersDto extends IntersectionType(
  TeacherDto,
  baseDataUser,
) {}
