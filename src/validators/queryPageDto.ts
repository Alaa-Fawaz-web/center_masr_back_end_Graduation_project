import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export default class QueryPageDto {
  @ApiProperty({
    description: 'رقم الصفحة (يبدأ من 1)',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'page يجب أن يكون رقماً صحيحاً' })
  @Min(1)
  @Max(100)
  page: number = 1;
}
