import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('instructors')
export class Instructor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 기존 필드 유지 (마이그레이션 전까지)
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  specialization: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  education: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'applied_date' })
  appliedDate: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column('text', { array: true, nullable: true })
  documents: string[];

  @Column({ type: 'text', nullable: true })
  portfolio: string;

  @Column({ type: 'text', nullable: true })
  motivation: string;

  @Column({ type: 'text', nullable: true, name: 'previous_experience' })
  previousExperience: string;

  @Column({ type: 'text', nullable: true })
  introduction: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

