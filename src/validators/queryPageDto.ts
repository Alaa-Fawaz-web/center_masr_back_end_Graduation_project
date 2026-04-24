import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export default class QueryPageDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'page must be an integer' })
  @Min(1)
  @Max(100)
  page: number = 1;
}
