import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('daily_learning_summary')
@Unique(['userId', 'date'])
export class DailyLearningStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'total_seconds', default: 0 })
  totalSeconds: number;

  @Column({ name: 'session_count', default: 0 })
  sessionCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
