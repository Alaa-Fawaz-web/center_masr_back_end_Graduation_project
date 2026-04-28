import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  userReviewId!: string;

  @IsString()
  @IsNotEmpty()
  rate!: number;

  @IsString()
  @IsNotEmpty()
  comment!: string;
}
