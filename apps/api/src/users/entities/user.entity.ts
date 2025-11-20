import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
  ADMIN = 'admin',
  SUB_ADMIN = 'sub-admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ name: 'bio', nullable: true })
  bio: string;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ name: 'github_url', nullable: true })
  githubUrl: string;

  @Column({ name: 'notion_url', nullable: true })
  notionUrl: string;

  @Column({ name: 'job', nullable: true })
  job: string;

  @Column({ name: 'language', nullable: true })
  language: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      // bcrypt로 해시된 비밀번호가 아닐 경우에만 해시
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    try {
      const { password, ...result } = this;
      // 프로필 필드가 없을 수 있으므로 안전하게 처리
      return {
        ...result,
        bio: this.bio || null,
        address: this.address || null,
        githubUrl: this.githubUrl || null,
        notionUrl: this.notionUrl || null,
        job: this.job || null,
        language: this.language || null,
      };
    } catch (error) {
      console.error('toJSON error:', error);
      // 에러 발생 시 기본 필드만 반환
      const { password, bio, address, githubUrl, notionUrl, job, language, ...result } = this;
      return result;
    }
  }
}
