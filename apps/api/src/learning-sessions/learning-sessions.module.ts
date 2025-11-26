import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningSessionsService } from './learning-sessions.service';
import { LearningSessionsController } from './learning-sessions.controller';
import { DailyLearningStats } from './entities/daily-learning-stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyLearningStats]),
  ],
  controllers: [LearningSessionsController],
  providers: [LearningSessionsService],
  exports: [LearningSessionsService],
})
export class LearningSessionsModule {}
