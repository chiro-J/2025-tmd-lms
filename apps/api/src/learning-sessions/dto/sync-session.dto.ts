import { IsArray, IsString, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SessionIntervalDto {
  @IsString()
  timestamp: string; // 'YYYY-MM-DD HH:mm:ss'

  @IsNumber()
  durationSeconds: number;

  @IsBoolean()
  isActive: boolean;
}

export class SyncSessionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SessionIntervalDto)
  intervals: SessionIntervalDto[];

  @IsString()
  startedAt: string;
}
