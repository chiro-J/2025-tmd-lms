import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { AssignmentSubmission } from './assignment-submission.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({ name: 'max_score', default: 100, nullable: true })
  maxScore: number;

  @Column({ type: 'text', array: true, nullable: true })
  instructions: string[];

  @Column({ name: 'allowed_file_types', type: 'text', array: true, nullable: true })
  allowedFileTypes: string[];

  @Column({ name: 'max_file_size', nullable: true })
  maxFileSize: number; // MB

  @Column({ name: 'content_blocks', type: 'jsonb', nullable: true })
  contentBlocks: any[]; // 이미지, PDF, 동영상 등 콘텐츠 블록

  @OneToMany(() => AssignmentSubmission, submission => submission.assignment)
  submissions: AssignmentSubmission[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

