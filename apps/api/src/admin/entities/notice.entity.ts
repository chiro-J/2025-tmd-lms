import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notices')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  author: string;

  @Column({ default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'createdDate' })
  createdDate: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}

