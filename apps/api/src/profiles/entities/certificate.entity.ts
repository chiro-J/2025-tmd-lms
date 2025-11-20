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

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.certificates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column()
  name: string;

  @Column()
  issuer: string;

  @Column({ name: 'issue_date' })
  issueDate: string;

  @Column({ name: 'expiry_date', nullable: true })
  expiryDate: string;

  @Column({ name: 'credential_id', nullable: true })
  credentialId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
