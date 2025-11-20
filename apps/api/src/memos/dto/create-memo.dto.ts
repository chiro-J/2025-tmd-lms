import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateMemoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'memoDate must be in YYYY-MM-DD format',
  })
  memoDate: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'color must be a valid hex color code (e.g., #3B82F6)',
  })
  color?: string;
}






