import { IsUUID } from 'class-validator';
import QueryPageDto from './queryPageDto';

export default class QueryDto extends QueryPageDto {
  @IsUUID()
  id!: string;
}
