import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column()
  email: string;

  @Column({ name: 'user_role', type: 'int', default: 1, nullable: true })
  userRole?: number; // 1: 수강생, 2: 강의자

  @Column({ default: 'pending' })
  status: 'pending' | 'completed';

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'jsonb', nullable: true })
  attachments: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'createdDate' })
  createdDate: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

