import { IsUUID } from 'class-validator';
import QueryPageDto from './queryPageDto';
import { ApiProperty } from '@nestjs/swagger';

export default class QueryDto extends QueryPageDto {
  @ApiProperty()
  @IsUUID()
  id!: string;
}
