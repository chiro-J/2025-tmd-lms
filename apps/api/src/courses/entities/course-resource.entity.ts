import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from './course.entity';

@Entity('course_resources')
export class CourseResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  title: string;

  @Column()
  type: string; // 'pdf', 'slide', 'code', 'link'

  @Column({ name: 'file_url', nullable: true })
  fileUrl?: string;

  @Column({ name: 'link_url', nullable: true })
  linkUrl?: string;

  @Column({ type: 'text', nullable: true })
  code?: string;

  @Column({ name: 'file_size', nullable: true })
  fileSize?: number;

  @Column({ name: 'download_allowed', default: true })
  downloadAllowed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}




