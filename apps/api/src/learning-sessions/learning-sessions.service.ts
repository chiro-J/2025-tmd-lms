import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyLearningStats } from './entities/daily-learning-stats.entity';
import { UserSession } from './entities/user-session.entity';
import { SyncSessionDto } from './dto/sync-session.dto';

@Injectable()
export class LearningSessionsService {
  constructor(
    @InjectRepository(DailyLearningStats)
    private dailyStatsRepo: Repository<DailyLearningStats>,
    @InjectRepository(UserSession)
    private userSessionRepo: Repository<UserSession>,
  ) {}

  /**
   * 학습 시간 누적 (간단한 방식)
   * - 매일 사이트 체류 시간을 누적
   * - 같은 날 여러 번 호출 시 누적
   */
  async addLearningTime(userId: number, date: string, seconds: number): Promise<void> {
    const dateObj = new Date(date);

    // 기존 레코드 찾기
    let stat = await this.dailyStatsRepo.findOne({
      where: {
        userId,
        date: dateObj,
      },
    });

    if (stat) {
      // 기존 데이터에 누적
      stat.totalSeconds += seconds;
      stat.sessionCount += 1;
      await this.dailyStatsRepo.save(stat);
    } else {
      // 새 레코드 생성
      stat = this.dailyStatsRepo.create({
        userId,
        date: dateObj,
        totalSeconds: seconds,
        sessionCount: 1,
      });
      await this.dailyStatsRepo.save(stat);
    }

    console.log(`[Learning Time] User ${userId}: +${seconds}s on ${date} (total: ${stat.totalSeconds}s)`);
  }

  /**
   * 주간 학습 데이터 조회
   * - 이번 주/지난 주 학습 시간 반환 (시간 단위)
   */
  async getWeeklyLearningData(userId: number): Promise<{
    thisWeek: (number | null)[];
    lastWeek: number[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mondayThisWeek = this.getMonday(today);
    const mondayLastWeek = new Date(mondayThisWeek);
    mondayLastWeek.setDate(mondayLastWeek.getDate() - 7);

    const sundayThisWeek = new Date(mondayThisWeek);
    sundayThisWeek.setDate(sundayThisWeek.getDate() + 6);

    // 지난 주 월요일 ~ 이번 주 일요일 데이터 조회
    const stats = await this.dailyStatsRepo.find({
      where: {
        userId,
        date: Between(mondayLastWeek, sundayThisWeek),
      },
      order: { date: 'ASC' },
    });

    // 요일별로 매핑 - 이번 주도 0으로 초기화 (null 대신)
    const thisWeek: number[] = Array(7).fill(0);
    const lastWeek: number[] = Array(7).fill(0);

    stats.forEach(stat => {
      const statDate = new Date(stat.date);
      const daysSinceLastMonday = Math.floor(
        (statDate.getTime() - mondayLastWeek.getTime()) / (1000 * 60 * 60 * 24)
      );

      const hours = stat.totalSeconds / 3600;

      if (daysSinceLastMonday >= 7 && daysSinceLastMonday < 14) {
        // 이번 주 (7~13일)
        const dayIndex = daysSinceLastMonday - 7;
        thisWeek[dayIndex] = hours;
      } else if (daysSinceLastMonday >= 0 && daysSinceLastMonday < 7) {
        // 지난 주 (0~6일)
        lastWeek[daysSinceLastMonday] = hours;
      }
    });

    return { thisWeek, lastWeek };
  }

  /**
   * 유틸: 해당 주의 월요일 구하기
   */
  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  /**
   * 학습 세션 동기화 (자정 넘어가는 경우 날짜별 자동 분리)
   * - 각 interval의 timestamp를 파싱
   * - 날짜별로 그룹핑하여 학습 시간 누적
   */
  async syncSession(sessionId: number, dto: SyncSessionDto): Promise<void> {
    // Get session to find userId
    const session = await this.userSessionRepo.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      console.error(`[Sync] Session ${sessionId} not found`);
      return;
    }

    const userId = session.userId;

    // Group intervals by date
    const dateGroups = new Map<string, number>();

    dto.intervals.forEach((interval) => {
      // Parse timestamp: "2025-11-26 23:50:00"
      const date = interval.timestamp.split(' ')[0]; // "2025-11-26"
      const currentSeconds = dateGroups.get(date) || 0;
      dateGroups.set(date, currentSeconds + interval.durationSeconds);
    });

    // Save each date's learning time
    for (const [date, totalSeconds] of dateGroups.entries()) {
      await this.addLearningTime(userId, date, totalSeconds);
    }

    console.log(
      `[Sync] Session ${sessionId} synced: ${dateGroups.size} dates, total ${dto.intervals.length} intervals`,
    );
  }

  /**
   * 14일 이상 된 학습 데이터 자동 삭제
   * - 매일 자정(00:00)에 실행
   * - 최근 14일 데이터만 유지
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldLearningData(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);
    cutoffDate.setHours(0, 0, 0, 0);

    try {
      const result = await this.dailyStatsRepo.delete({
        date: LessThan(cutoffDate),
      });

      if (result.affected && result.affected > 0) {
        console.log(
          `[Cleanup] Deleted ${result.affected} old learning records (before ${cutoffDate.toISOString().split('T')[0]})`,
        );
      }
    } catch (error) {
      console.error('[Cleanup] Failed to delete old learning data:', error);
    }
  }
}
