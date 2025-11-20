import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('sub_admins')
export class SubAdmin {
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
  password: string;

  @Column({ default: 'Content Manager' })
  role: string;

  @Column({ default: 'pending' })
  status: 'active' | 'inactive' | 'pending';

  @Column({ default: false, name: 'user_management' })
  userManagement: boolean;

  @Column({ default: false, name: 'content_management' })
  contentManagement: boolean;

  @Column({ default: false, name: 'system_settings' })
  systemSettings: boolean;

  @Column({ default: false, name: 'instructor_approval' })
  instructorApproval: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'lastLogin' })
  lastLogin: Date;
}

