import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Education } from './education.entity';
import { Experience } from './experience.entity';
import { Project } from './project.entity';
import { Certificate } from './certificate.entity';
import { LanguageSkill } from './language-skill.entity';
import { Training } from './training.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'resume_photo', nullable: true })
  resumePhoto: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage: string;

  @Column({ name: 'portfolio_url', nullable: true })
  portfolioUrl: string;

  @Column({ name: 'resume_template', default: 'modern' })
  resumeTemplate: string;

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ name: 'google_linked', default: false })
  googleLinked: boolean;

  @Column({ name: 'kakao_linked', default: false })
  kakaoLinked: boolean;

  @Column({ name: 'google_linked_date', nullable: true })
  googleLinkedDate: string;

  @Column({ name: 'kakao_linked_date', nullable: true })
  kakaoLinkedDate: string;

  @OneToMany(() => Education, (education) => education.profile, {
    cascade: true,
    eager: true,
  })
  education: Education[];

  @OneToMany(() => Experience, (experience) => experience.profile, {
    cascade: true,
    eager: true,
  })
  experience: Experience[];

  @OneToMany(() => Project, (project) => project.profile, {
    cascade: true,
    eager: true,
  })
  projects: Project[];

  @OneToMany(() => Certificate, (certificate) => certificate.profile, {
    cascade: true,
    eager: true,
  })
  certificates: Certificate[];

  @OneToMany(() => LanguageSkill, (languageSkill) => languageSkill.profile, {
    cascade: true,
    eager: true,
  })
  languageSkills: LanguageSkill[];

  @OneToMany(() => Training, (training) => training.profile, {
    cascade: true,
    eager: true,
  })
  trainings: Training[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
