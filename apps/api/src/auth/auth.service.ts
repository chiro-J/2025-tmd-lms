import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { Student } from '../admin/entities/student.entity';
import { Instructor } from '../admin/entities/instructor.entity';
import { SubAdmin } from '../admin/entities/sub-admin.entity';
import { EmailService } from '../common/services/email.service';

// 인증 코드 저장소 (메모리 기반, 프로덕션에서는 Redis 권장)
interface VerificationCode {
  code: string;
  email: string;
  expiresAt: Date;
  attempts: number;
}

@Injectable()
export class AuthService {
  private verificationCodes: Map<string, VerificationCode> = new Map();
  private readonly CODE_EXPIRY_MINUTES = 10;
  private readonly MAX_ATTEMPTS = 5;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
    @InjectRepository(SubAdmin)
    private subAdminRepository: Repository<SubAdmin>,
  ) {
    // 만료된 코드 정리 (5분마다)
    setInterval(() => {
      this.cleanupExpiredCodes();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredCodes() {
    const now = new Date();
    for (const [email, codeData] of this.verificationCodes.entries()) {
      if (now > codeData.expiresAt) {
        this.verificationCodes.delete(email);
      }
    }
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return null;
      }

      // 비밀번호 검증
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('validateUser error:', error);
      return null;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        accessToken,
        refreshToken,
        user: user.toJSON(),
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(`로그인 실패: ${error.message || '알 수 없는 오류'}`);
    }
  }

  async register(userData: Partial<User>) {
    try {
      // Check if user already exists
      const existingUserByEmail = await this.usersService.findByEmail(userData.email);
      if (existingUserByEmail) {
        throw new ConflictException('Email already exists');
      }

      const existingUserByUsername = await this.usersService.findByUsername(userData.username);
      if (existingUserByUsername) {
        throw new ConflictException('Username already exists');
      }

      // Create new user in users table
      const user = await this.usersService.create(userData);

      // Create role-specific record based on user role
      const role = userData.role || user.role;

      // name 필드가 필수이므로 확인
      const name = userData.name || user.name;
      const email = userData.email || user.email;
      const phone = userData.phone || user.phone;

      if (!name) {
        throw new BadRequestException('이름(name) 필드는 필수입니다.');
      }

      try {
        if (role === UserRole.STUDENT) {
          const student = this.studentRepository.create({
            userId: user.id,
            name: name,
            email: email,
            phone: phone,
            password: userData.password || '', // students 테이블에 password 필드가 NOT NULL인 경우
            status: 'active',
            enrolledDate: new Date(),
          });
          await this.studentRepository.save(student);
        } else if (role === UserRole.INSTRUCTOR) {
          const instructor = this.instructorRepository.create({
            userId: user.id,
            name: name,
            email: email,
            phone: phone,
            status: 'pending', // 강사는 승인 필요
            appliedDate: new Date(),
          });
          await this.instructorRepository.save(instructor);
        } else if (role === UserRole.SUB_ADMIN) {
          const subAdmin = this.subAdminRepository.create({
            userId: user.id,
            status: 'pending', // 서브 관리자도 승인 필요
            role: 'Content Manager',
            userManagement: false,
            contentManagement: false,
            systemSettings: false,
            instructorApproval: false,
          });
          await this.subAdminRepository.save(subAdmin);
        }
        // 'admin' 역할은 별도 확장 테이블 없음 (users 테이블만 사용)
      } catch (roleError) {
        console.error('Error creating role-specific record:', roleError);
        console.error('Role:', role, 'Name:', name, 'Email:', email);
        // role-specific record 생성 실패해도 user는 생성되었으므로 계속 진행
        // (나중에 수동으로 추가 가능)
      }

      const payload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      return {
        accessToken,
        refreshToken,
        user: user.toJSON(),
      };
    } catch (error) {
      console.error('Register error:', error);
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`회원가입 실패: ${error.message || '알 수 없는 오류'}`);
    }
  }

  async refreshToken(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getProfile(userId: number) {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user.toJSON();
    } catch (error) {
      console.error('getProfile error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(`프로필 조회 실패: ${error.message || '알 수 없는 오류'}`);
    }
  }

  /**
   * 이메일 중복 체크
   */
  async checkEmailExists(email: string): Promise<boolean> {
    return await this.usersService.checkEmailExists(email);
  }

  /**
   * 전화번호 중복 체크
   */
  async checkPhoneExists(phone: string): Promise<boolean> {
    if (!phone) return false;
    return await this.usersService.checkPhoneExists(phone);
  }

  /**
   * 이메일 인증 코드 발송
   */
  async sendVerificationCode(email: string): Promise<{ message: string }> {
    // 이메일 중복 확인
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    // 인증 코드 생성
    const code = this.generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.CODE_EXPIRY_MINUTES);

    // 기존 코드가 있으면 업데이트, 없으면 새로 생성
    this.verificationCodes.set(email, {
      code,
      email,
      expiresAt,
      attempts: 0,
    });

    // 이메일 발송
    await this.emailService.sendVerificationCode(email, code);

    return {
      message: '인증 코드가 이메일로 전송되었습니다.',
    };
  }

  /**
   * 인증 코드 검증
   */
  async verifyCode(email: string, code: string): Promise<{ verified: boolean; message: string }> {
    const codeData = this.verificationCodes.get(email);

    if (!codeData) {
      throw new BadRequestException('인증 코드를 먼저 요청해주세요.');
    }

    // 만료 확인
    if (new Date() > codeData.expiresAt) {
      this.verificationCodes.delete(email);
      throw new BadRequestException('인증 코드가 만료되었습니다. 다시 요청해주세요.');
    }

    // 시도 횟수 확인
    if (codeData.attempts >= this.MAX_ATTEMPTS) {
      this.verificationCodes.delete(email);
      throw new BadRequestException(
        `인증 코드 시도 횟수를 초과했습니다. 최대 ${this.MAX_ATTEMPTS}회까지 시도할 수 있습니다.`,
      );
    }

    // 코드 검증
    codeData.attempts++;
    if (codeData.code !== code) {
      if (codeData.attempts >= this.MAX_ATTEMPTS) {
        this.verificationCodes.delete(email);
        throw new BadRequestException(
          `인증 코드가 올바르지 않습니다. 시도 횟수를 초과했습니다.`,
        );
      }
      throw new BadRequestException(
        `인증 코드가 올바르지 않습니다. (남은 시도: ${this.MAX_ATTEMPTS - codeData.attempts}회)`,
      );
    }

    // 검증 성공 - 코드를 verified로 표시
    codeData.code = 'VERIFIED';
    this.verificationCodes.set(email, codeData);

    return {
      verified: true,
      message: '인증 코드가 확인되었습니다.',
    };
  }

  /**
   * 인증 완료 후 회원가입
   */
  async registerWithVerification(userData: {
    email: string;
    password: string;
    name: string;
    username: string;
    phone?: string;
    role?: UserRole;
  }) {
    try {
      // 이메일 인증 확인
      const codeData = this.verificationCodes.get(userData.email);
      if (!codeData || codeData.code !== 'VERIFIED') {
        throw new BadRequestException('이메일 인증을 먼저 완료해주세요.');
      }

      // 만료 확인
      if (new Date() > codeData.expiresAt) {
        this.verificationCodes.delete(userData.email);
        throw new BadRequestException('인증이 만료되었습니다. 다시 인증해주세요.');
      }

      // role이 없으면 기본값으로 student 설정
      if (!userData.role) {
        userData.role = UserRole.STUDENT;
      }

      // 회원가입 진행
      const result = await this.register(userData);

      // 인증 코드 삭제
      this.verificationCodes.delete(userData.email);

      return result;
    } catch (error) {
      console.error('registerWithVerification error:', error);
      throw error;
    }
  }
}
