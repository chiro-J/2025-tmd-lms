import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DailyLearningStats } from './entities/daily-learning-stats.entity';

@Injectable()
export class LearningSessionsService {
  constructor(
    @InjectRepository(DailyLearningStats)
    private dailyStatsRepo: Repository<DailyLearningStats>,
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

    // 요일별로 매핑
    const thisWeek: (number | null)[] = Array(7).fill(null);
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
}
