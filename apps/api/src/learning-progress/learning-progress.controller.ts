import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LearningProgressService } from './learning-progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateLearningProgressDto } from './dto/update-learning-progress.dto';

@Controller('learning-progress')
export class LearningProgressController {
  constructor(private readonly learningProgressService: LearningProgressService) {}

  /**
   * Get learning progress for a specific course
   * GET /learning-progress/:userId/course/:courseId
   */
  @UseGuards(JwtAuthGuard)
  @Get(':userId/course/:courseId')
  async getProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    const progress = await this.learningProgressService.getProgress(
      +userId,
      +courseId,
    );

    return {
      success: true,
      data: progress,
      message: progress
        ? '학습 진행률을 성공적으로 조회했습니다.'
        : '학습 진행률이 없습니다.',
    };
  }

  /**
   * Get all learning progress for a user
   * GET /learning-progress/:userId
   */
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserProgress(@Param('userId') userId: string) {
    const progress = await this.learningProgressService.getUserProgress(+userId);

    return {
      success: true,
      data: progress,
      message: '학습 진행률을 성공적으로 조회했습니다.',
    };
  }

  /**
   * Get the last learned course for a user
   * GET /learning-progress/:userId/last-learned
   */
  @UseGuards(JwtAuthGuard)
  @Get(':userId/last-learned')
  async getLastLearnedCourse(@Param('userId') userId: string) {
    const progress = await this.learningProgressService.getLastLearnedCourse(+userId);

    return {
      success: true,
      data: progress,
      message: progress
        ? '마지막 학습 강의를 성공적으로 조회했습니다.'
        : '학습 기록이 없습니다.',
    };
  }

  /**
   * Update or create learning progress
   * POST /learning-progress
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async updateProgress(@Body() dto: UpdateLearningProgressDto) {
    try {
      const progress = await this.learningProgressService.updateProgress(dto);

      return {
        success: true,
        data: progress,
        message: '학습 진행률이 성공적으로 업데이트되었습니다.',
      };
    } catch (error) {
      console.error('학습 진행률 업데이트 오류:', error);
      // 데이터베이스 오류 등 상세 정보 포함
      throw error;
    }
  }
}






