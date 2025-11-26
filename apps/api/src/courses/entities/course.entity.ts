import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  instructor: string;

  @Column({ default: 0 })
  progress: number;

  @Column({ default: 'published' })
  status: string;

  @Column({ type: 'text', nullable: true })
  videoUrl: string; // 소개 영상 URL

  @Column({ type: 'text', nullable: true })
  content: string; // 강좌 소개 내용 (HTML)

  @Column({ unique: true, nullable: true })
  enrollmentCode: string; // 수강코드 (예: ABC123)

  @Column({ name: 'lecture_period_start', type: 'date', nullable: true })
  lecturePeriodStart: Date; // 강의 시작일

  @Column({ name: 'lecture_period_end', type: 'date', nullable: true })
  lecturePeriodEnd: Date; // 강의 종료일

  @Column({ name: 'education_duration', nullable: true })
  educationDuration: string; // 교육기간 (예: 6개월 과정)

  @Column({ name: 'education_schedule', type: 'text', nullable: true })
  educationSchedule: string; // 교육시간 (예: 매주 월~금 09:00 ~ 18:00)

  @Column({ name: 'instructor_introductions', type: 'jsonb', nullable: true })
  instructorIntroductions: any; // 강사 소개 (JSONB)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

