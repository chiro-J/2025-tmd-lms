import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exam } from '../../exams/entities/exam.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_id', nullable: true })
  examId: number;

  @ManyToOne(() => Exam, exam => exam.questions, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column({ type: 'varchar', length: 50 })
  type: string; // 'multiple-choice', 'true-false', 'short-answer'

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'jsonb', nullable: true })
  options: string[]; // 객관식 선택지

  @Column({ name: 'correct_answer', type: 'jsonb' })
  correctAnswer: any; // 정답 (타입에 따라 number, boolean, string)

  @Column({ default: 10 })
  points: number;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'varchar', length: 50, default: 'completed' })
  status: string; // 'draft', 'completed', 'review'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

