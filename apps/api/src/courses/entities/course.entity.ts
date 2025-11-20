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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

