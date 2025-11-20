import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  title: string;

  @Column({ type: 'varchar', length: 50, default: '시험' })
  type: string; // '시험' 또는 '과제'

  @Column({ type: 'varchar', length: 50, default: '예정' })
  status: string; // '예정', '진행중', '완료'

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ name: 'time_limit', nullable: true })
  timeLimit: number; // 분 단위

  @Column({ name: 'author_id', nullable: true })
  authorId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ nullable: true })
  group: string; // '전체', 'A그룹', 'B그룹' 등

  @Column({ name: 'total_questions', default: 0 })
  totalQuestions: number;

  @Column({ name: 'participants', default: 0 })
  participants: number;

  @OneToMany(() => Question, question => question.exam, { cascade: true })
  questions: Question[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

