import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { LearningSessionsService } from './learning-sessions.service';
import { SyncSessionDto } from './dto/sync-session.dto';

@Controller()
export class LearningSessionsController {
  constructor(private readonly service: LearningSessionsService) {}

  /**
   * 학습 시간 추가/누적
   * POST /users/:userId/learning/time
   */
  @Post('users/:userId/learning/time')
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
  @Get('users/:userId/learning/weekly')
  async getWeeklyData(@Param('userId', ParseIntPipe) userId: number) {
    return await this.service.getWeeklyLearningData(userId);
  }

  /**
   * 학습 세션 동기화 (날짜별 자동 분리)
   * POST /api/learning/sessions/:sessionId/sync
   */
  @Post('api/learning/sessions/:sessionId/sync')
  async syncSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body() dto: SyncSessionDto,
  ) {
    await this.service.syncSession(sessionId, dto);
    return {
      success: true,
      message: 'Session synced successfully',
      intervalCount: dto.intervals.length
    };
  }
}
