import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningProgress } from './entities/learning-progress.entity';
import { UpdateLearningProgressDto } from './dto/update-learning-progress.dto';

@Injectable()
export class LearningProgressService {
  constructor(
    @InjectRepository(LearningProgress)
    private learningProgressRepository: Repository<LearningProgress>,
  ) {}

  /**
   * Get learning progress for a specific user and course
   */
  async getProgress(userId: number, courseId: number): Promise<LearningProgress | null> {
    return this.learningProgressRepository.findOne({
      where: { userId, courseId },
    });
  }

  /**
   * Get all learning progress for a user (for last learned course feature)
   */
  async getUserProgress(userId: number): Promise<LearningProgress[]> {
    return this.learningProgressRepository.find({
      where: { userId },
      order: { lastAccessedAt: 'DESC' },
    });
  }

  /**
   * Update or create learning progress
   */
  async updateProgress(dto: UpdateLearningProgressDto): Promise<LearningProgress> {
    try {
      const existing = await this.learningProgressRepository.findOne({
        where: { userId: dto.userId, courseId: dto.courseId },
      });

      if (existing) {
        // Update existing progress
        existing.lessonId = dto.lessonId ?? null;
        existing.lastAccessedAt = new Date();
        return await this.learningProgressRepository.save(existing);
      } else {
        // Create new progress
        const newProgress = this.learningProgressRepository.create({
          userId: dto.userId,
          courseId: dto.courseId,
          lessonId: dto.lessonId ?? null,
          lastAccessedAt: new Date(),
        });
        return await this.learningProgressRepository.save(newProgress);
      }
    } catch (error) {
      console.error('학습 진행률 저장 중 오류 발생:', {
        error,
        dto,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Get the last learned course for a user
   */
  async getLastLearnedCourse(userId: number): Promise<LearningProgress | null> {
    const progress = await this.learningProgressRepository.find({
      where: { userId },
      order: { lastAccessedAt: 'DESC' },
      take: 1,
    });

    return progress.length > 0 ? progress[0] : null;
  }
}






