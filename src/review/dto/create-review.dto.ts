import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'معرف المستخدم الذي يقوم بالمراجعة',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsUUID('all', { message: 'يجب أن يكون معرف المستخدم UUID صالحاً' })
  userReviewId!: string;

  @ApiProperty({
    description: 'التقييم (من 1 إلى 5)',
    example: 4.5,
    minimum: 1,
    maximum: 5,
    required: true,
  })
  @IsNumber({}, { message: 'التقييم يجب أن يكون رقماً' })
  @Min(1, { message: 'التقييم لا يمكن أن يكون أقل من 1' })
  @Max(5, { message: 'التقييم لا يمكن أن يكون أكبر من 5' })
  @IsNotEmpty({ message: 'التقييم مطلوب' })
  rate!: number;

  @ApiProperty({
    description: 'نص المراجعة',
    example: 'خدمة ممتازة وسريعة',
    required: true,
  })
  @IsString({ message: 'نص المراجعة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'نص المراجعة مطلوب' })
  comment!: string;
}
