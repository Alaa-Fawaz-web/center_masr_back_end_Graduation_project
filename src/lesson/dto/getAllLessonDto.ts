import { PartialType, PickType } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';

export class GetAllLessonDto extends PartialType(
  PickType(CreateLessonDto, ['title']),
) {}
