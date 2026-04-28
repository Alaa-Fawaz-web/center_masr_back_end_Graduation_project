import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherCenterDto } from './create-teacher-center.dto';

export class UpdateTeacherCenterDto extends PartialType(CreateTeacherCenterDto) {}
