import { IsNumber, IsOptional } from 'class-validator';

export class UpdateLearningProgressDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  courseId: number;

  @IsOptional()
  @IsNumber()
  lessonId?: number | null;
}









