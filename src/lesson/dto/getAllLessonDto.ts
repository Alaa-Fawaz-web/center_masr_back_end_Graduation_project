import { PickType, PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';

export class GetAllLessonDto extends PartialType(
  PickType(CreateLessonDto, ['title']),
) {}
