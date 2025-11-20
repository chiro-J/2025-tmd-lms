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

@Entity('language_skills')
export class LanguageSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.languageSkills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column()
  language: string;

  @Column({ nullable: true })
  certificate: string;

  @Column({ name: 'certificate_date', nullable: true })
  certificateDate: string;

  @Column({
    type: 'enum',
    enum: ['basic', 'conversational', 'business', 'native'],
    default: 'conversational',
  })
  level: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
