import { IsUUID } from 'class-validator';
import QueryPageDto from './queryPageDto';
import { ApiProperty } from '@nestjs/swagger';

export default class QueryDto extends QueryPageDto {
  @ApiProperty({
    description: 'المعرف الفريد (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID('all', { message: 'معرف غير صالح' })
  id!: string;
}
