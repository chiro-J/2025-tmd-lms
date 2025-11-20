import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Assignment } from './assignment.entity';

@Entity('assignment_submissions')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'assignment_id' })
  assignmentId: number;

  @ManyToOne(() => Assignment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @Column({ name: 'user_id', nullable: true })
  userId: number; // 향후 users 테이블 참조

  @Column({ name: 'student_name', nullable: true })
  studentName: string; // 임시 필드 (user_id가 없을 때 사용)

  @Column({ name: 'submitted_at', type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: '미제출'
  })
  status: '제출' | '지연' | '미제출';

  @Column({ nullable: true })
  score: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  // 파일 정보는 JSON으로 저장 (향후 submission_files 테이블로 분리 가능)
  @Column({ type: 'jsonb', nullable: true })
  files: { name: string; size: number; url: string }[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

