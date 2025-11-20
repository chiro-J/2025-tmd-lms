import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('faqs')
export class FAQ {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'varchar', length: 100 })
  category: string; // '강의', '과제', '시험', '계정' 등

  @Column({ name: 'target_role', type: 'varchar', length: 50, default: 'student' })
  targetRole: string; // 'student', 'instructor', 'all'

  @Column({ name: 'order', default: 0 })
  order: number; // 정렬 순서

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

