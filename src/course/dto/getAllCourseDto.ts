import { PartialType, PickType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';

export default class GetAllCourseDto extends PartialType(
  PickType(CreateCourseDto, ['classRoom'] as const),
) {}
