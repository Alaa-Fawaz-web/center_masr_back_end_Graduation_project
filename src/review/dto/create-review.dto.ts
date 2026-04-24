import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsUUID()
  userReviewId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rate!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment!: string;
}
