import { PickType, PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export default class GetAllCourseDto extends PartialType(
  PickType(CreateCourseDto, ['classRoom']),
) {}
