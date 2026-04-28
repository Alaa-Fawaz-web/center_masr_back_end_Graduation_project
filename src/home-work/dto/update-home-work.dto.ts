import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeWorkDto } from './create-home-work.dto';

export class UpdateHomeWorkDto extends PartialType(CreateHomeWorkDto) {}
