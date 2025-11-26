import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningProgressController } from './learning-progress.controller';
import { LearningProgressService } from './learning-progress.service';
import { LearningProgress } from './entities/learning-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LearningProgress])],
  controllers: [LearningProgressController],
  providers: [LearningProgressService],
  exports: [LearningProgressService],
})
export class LearningProgressModule {}









