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

  @Column({ type: 'jsonb', nullable: true })
  profile: any; // 이력서 및 프로필 상세 정보 (JSONB)

  @Column({ name: 'google_linked', default: false })
  googleLinked: boolean;

  @Column({ name: 'kakao_linked', default: false })
  kakaoLinked: boolean;

  @Column({ name: 'google_linked_date', nullable: true })
  googleLinkedDate: string;

  @Column({ name: 'kakao_linked_date', nullable: true })
  kakaoLinkedDate: string;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPasswordOnInsert() {
    if (this.password && !this.password.startsWith('$2b$')) {
      // bcrypt로 해시된 비밀번호가 아닐 경우에만 해시
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    // update 시에는 password가 변경된 경우에만 해시
    // TypeORM의 변경 감지로 인해 password가 실제로 변경되었는지 확인
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
