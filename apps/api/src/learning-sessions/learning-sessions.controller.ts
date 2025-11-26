import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { LearningSessionsService } from './learning-sessions.service';

@Controller('users/:userId/learning')
export class LearningSessionsController {
  constructor(private readonly service: LearningSessionsService) {}

  /**
   * 학습 시간 추가/누적
   * POST /users/:userId/learning/time
   */
  @Post('time')
  async addLearningTime(
    @Param('userId', ParseIntPipe) userId: number,
    @Body('date') date: string,
    @Body('seconds') seconds: number,
  ) {
    await this.service.addLearningTime(userId, date, seconds);
    return { success: true, message: 'Learning time added successfully' };
  }

  /**
   * 주간 학습 데이터 조회
   * GET /users/:userId/learning/weekly
   */
  @Get('weekly')
  async getWeeklyData(@Param('userId', ParseIntPipe) userId: number) {
    return await this.service.getWeeklyLearningData(userId);
  }
}
