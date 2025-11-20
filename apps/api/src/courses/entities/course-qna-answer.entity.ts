import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseQnA } from './course-qna.entity';
import { User } from '../../users/entities/user.entity';

@Entity('course_qna_answers')
export class CourseQnAAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'qna_id' })
  qnaId: number;

  @ManyToOne(() => CourseQnA, qna => qna.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'qna_id' })
  qna: CourseQnA;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'parent_answer_id', nullable: true })
  parentAnswerId: number;

  @ManyToOne(() => CourseQnAAnswer, answer => answer.replies, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_answer_id' })
  parentAnswer: CourseQnAAnswer;

  @OneToMany(() => CourseQnAAnswer, answer => answer.parentAnswer, { cascade: true })
  replies: CourseQnAAnswer[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

