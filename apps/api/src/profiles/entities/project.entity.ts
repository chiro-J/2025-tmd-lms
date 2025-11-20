import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  role: string;

  @Column({ name: 'start_date' })
  startDate: string;

  @Column({ name: 'end_date', nullable: true })
  endDate: string;

  @Column({ default: false })
  current: boolean;

  @Column({ type: 'simple-array' })
  techStack: string[];

  @Column({ nullable: true })
  url: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
