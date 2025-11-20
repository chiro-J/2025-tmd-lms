import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SubAdmin } from './entities/sub-admin.entity';
import { Instructor } from './entities/instructor.entity';
import { Student } from './entities/student.entity';
import { Notice } from './entities/notice.entity';
import { FAQ } from '../faq/entities/faq.entity';
import { Inquiry } from './entities/inquiry.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { toKSTDateString, toKSTDateTimeString } from '../utils/timezone';
import { User, UserRole } from '../users/entities/user.entity';
import { SubAdminResponseDto } from './dto/sub-admin-response.dto';
import { getUploadService } from '../utils/upload-helper';
import { StudentResponseDto } from './dto/student-response.dto';
import { InstructorResponseDto } from './dto/instructor-response.dto';
import { InquiryResponseDto } from './dto/inquiry-response.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(SubAdmin)
    private subAdminRepository: Repository<SubAdmin>,
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
    @InjectRepository(FAQ)
    private faqRepository: Repository<FAQ>,
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
    @InjectRepository(SystemSettings)
    private systemSettingsRepository: Repository<SystemSettings>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ========== 서브 관리자 관련 ==========
  async findAllSubAdmins(): Promise<SubAdminResponseDto[]> {
    const admins = await this.subAdminRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    // 프론트엔드 형식에 맞게 변환
    return admins.map((admin): SubAdminResponseDto => {
      // user_id가 있으면 users 테이블에서 가져오고, 없으면 기존 필드 사용
      const name = admin.user?.name || admin.name || '';
      const email = admin.user?.email || admin.email || '';
      const role = admin.user?.role || admin.role || 'Content Manager';

      return {
        id: admin.id,
        name,
        email,
        role,
        status: admin.status,
        userManagement: admin.userManagement,
        contentManagement: admin.contentManagement,
        systemSettings: admin.systemSettings,
        instructorApproval: admin.instructorApproval,
        permissions: {
          userManagement: admin.userManagement,
          contentManagement: admin.contentManagement,
          systemSettings: admin.systemSettings,
          instructorApproval: admin.instructorApproval,
        },
        createdAt: toKSTDateString(admin.createdAt instanceof Date
          ? admin.createdAt
          : new Date(admin.createdAt)),
        lastLogin: admin.lastLogin
          ? toKSTDateTimeString(admin.lastLogin instanceof Date
            ? admin.lastLogin
            : new Date(admin.lastLogin))
          : null,
      };
    });
  }

  async findSubAdminById(id: number): Promise<SubAdmin> {
    const admin = await this.subAdminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`서브 관리자를 찾을 수 없습니다 (ID: ${id})`);
    }
    return admin;
  }

  async createSubAdmin(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    permissions: {
      userManagement: boolean;
      contentManagement: boolean;
      systemSettings: boolean;
      instructorApproval: boolean;
    };
  }): Promise<SubAdmin> {
    // users 테이블에 먼저 생성
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const username = data.email.split('@')[0] + '_' + Date.now(); // 임시 username

    const user = this.userRepository.create({
      username,
      email: data.email,
      password: hashedPassword,
      role: UserRole.SUB_ADMIN,
      name: data.name,
    });
    const savedUser = await this.userRepository.save(user);

    // sub_admins 테이블에 생성
    const admin = this.subAdminRepository.create({
      userId: savedUser.id,
      role: data.role,
      userManagement: data.permissions.userManagement,
      contentManagement: data.permissions.contentManagement,
      systemSettings: data.permissions.systemSettings,
      instructorApproval: data.permissions.instructorApproval,
      status: 'pending',
    });
    return this.subAdminRepository.save(admin);
  }

  async updateSubAdmin(id: number, data: Partial<SubAdmin>): Promise<SubAdmin> {
    const admin = await this.findSubAdminById(id);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.assign(admin, data);
    return this.subAdminRepository.save(admin);
  }

  async deleteSubAdmin(id: number): Promise<void> {
    const admin = await this.findSubAdminById(id);
    await this.subAdminRepository.remove(admin);
  }

  // ========== 강사 관련 ==========
  async findAllInstructors(): Promise<InstructorResponseDto[]> {
    const instructors = await this.instructorRepository.find({
      relations: ['user'],
      order: { appliedDate: 'DESC' },
    });
    // 프론트엔드 형식에 맞게 변환
    return instructors.map((instructor): InstructorResponseDto => {
      const name = instructor.user?.name || instructor.name || '';
      const email = instructor.user?.email || instructor.email || '';
      const phone = instructor.user?.phone || instructor.phone || '';

      // appliedDate 안전하게 처리
      let appliedDateStr = '';
      if (instructor.appliedDate) {
        try {
          appliedDateStr = toKSTDateString(instructor.appliedDate instanceof Date
            ? instructor.appliedDate
            : new Date(instructor.appliedDate));
        } catch (error) {
          appliedDateStr = toKSTDateString(new Date());
        }
      } else {
        appliedDateStr = toKSTDateString(new Date());
      }

      return {
        id: instructor.id,
        userId: instructor.userId || instructor.user?.id,
        name,
        email,
        phone,
        specialization: instructor.specialization || '',
        experience: instructor.experience || '',
        education: instructor.education || '',
        appliedDate: appliedDateStr,
        status: instructor.status,
        documents: instructor.documents || [],
        portfolio: instructor.portfolio || '',
        motivation: instructor.motivation || '',
        previousExperience: instructor.previousExperience || '',
      };
    });
  }

  async findInstructorById(id: number): Promise<Instructor> {
    const instructor = await this.instructorRepository.findOne({ where: { id } });
    if (!instructor) {
      throw new NotFoundException(`강사를 찾을 수 없습니다 (ID: ${id})`);
    }
    return instructor;
  }

  async approveInstructor(id: number): Promise<Instructor> {
    const instructor = await this.findInstructorById(id);
    instructor.status = 'approved';
    return this.instructorRepository.save(instructor);
  }

  async rejectInstructor(id: number): Promise<Instructor> {
    const instructor = await this.findInstructorById(id);
    instructor.status = 'rejected';
    return this.instructorRepository.save(instructor);
  }

  async pendingInstructor(id: number): Promise<Instructor> {
    const instructor = await this.findInstructorById(id);
    instructor.status = 'pending';
    return this.instructorRepository.save(instructor);
  }

  async findInstructorByUserId(userId: number): Promise<Instructor | null> {
    return this.instructorRepository.findOne({
      where: { userId },
      relations: ['user']
    });
  }

  async getInstructorIntroduction(userId: number): Promise<string | null> {
    const instructor = await this.findInstructorByUserId(userId);
    return instructor?.introduction || null;
  }

  // 강의자 소개 파일 삭제 헬퍼 메서드
  private async deleteInstructorIntroductionFiles(introductionJson: string): Promise<void> {
    if (!introductionJson) {
      return;
    }

    try {
      const contentBlocks = JSON.parse(introductionJson);
      if (Array.isArray(contentBlocks)) {
        const uploadService = await getUploadService();

        for (const block of contentBlocks) {
          // PDF, 이미지, 비디오 블록의 파일 삭제
          if ((block.type === 'pdf' || block.type === 'image' || block.type === 'video') && block.content) {
            try {
              await uploadService.deleteFile(block.content);
              console.log(`✅ 강의자 소개 파일 삭제: ${block.content}`);
            } catch (error) {
              console.error(`❌ 강의자 소개 파일 삭제 실패: ${block.content}`, error);
            }
          }
        }
      }
    } catch (error) {
      console.warn('강의자 소개 JSON 파싱 실패 (파일 삭제 건너뜀):', error);
    }
  }

  async updateInstructorIntroduction(userId: number, introduction: string): Promise<Instructor> {
    let instructor = await this.findInstructorByUserId(userId);

    console.log('👤 InstructorIntroduction.update 호출:', {
      userId,
      introductionChanged: instructor?.introduction !== introduction,
      oldIntroductionLength: instructor?.introduction?.length,
      newIntroductionLength: introduction?.length
    });

    if (!instructor) {
      // 강의자가 없으면 생성
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다.`);
      }
      instructor = this.instructorRepository.create({
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: 'approved',
        introduction: introduction
      });
    } else {
      // 이전 introduction에서 삭제된 파일만 삭제 (새로운 파일은 유지)
      if (instructor.introduction && instructor.introduction !== introduction) {
        console.log('🗑️ 강의자 소개 파일 삭제 시작...');
        await this.deleteRemovedInstructorIntroductionFiles(instructor.introduction, introduction);
      }
      instructor.introduction = introduction;
    }

    return this.instructorRepository.save(instructor);
  }

  // 삭제된 파일만 삭제하는 헬퍼 메서드 (이전과 새로운 contentBlocks 비교)
  private async deleteRemovedInstructorIntroductionFiles(oldIntroduction: string, newIntroduction: string): Promise<void> {
    if (!oldIntroduction) {
      return;
    }

    try {
      const oldBlocks = JSON.parse(oldIntroduction);
      const newBlocks = newIntroduction ? JSON.parse(newIntroduction) : [];

      if (!Array.isArray(oldBlocks) || !Array.isArray(newBlocks)) {
        // JSON 형식이 아니면 전체 삭제 (기존 로직)
        await this.deleteInstructorIntroductionFiles(oldIntroduction);
        return;
      }

      // 새로운 contentBlocks에서 사용 중인 파일 URL 수집
      const newFileUrls = new Set<string>();
      newBlocks.forEach((block: any) => {
        if ((block.type === 'pdf' || block.type === 'image' || block.type === 'video') && block.content) {
          newFileUrls.add(block.content);
        }
      });

      console.log('📊 강의자 소개 파일 비교:', {
        oldBlocksCount: oldBlocks.length,
        newBlocksCount: newBlocks.length,
        oldFileCount: oldBlocks.filter((b: any) => (b.type === 'pdf' || b.type === 'image' || b.type === 'video') && b.content).length,
        newFileCount: newFileUrls.size
      });

      // 이전 contentBlocks에서 삭제된 파일만 찾아서 삭제
      const uploadService = await getUploadService();

      let deletedCount = 0;
      for (const block of oldBlocks) {
        if ((block.type === 'pdf' || block.type === 'image' || block.type === 'video') && block.content) {
          // 새로운 contentBlocks에 없는 파일만 삭제
          if (!newFileUrls.has(block.content)) {
            try {
              console.log(`🗑️ 강의자 소개 파일 삭제 시도: ${block.content}`);
              await uploadService.deleteFile(block.content);
              console.log(`✅ 삭제된 강의자 소개 파일 삭제 성공: ${block.content}`);
              deletedCount++;
            } catch (error) {
              console.error(`❌ 강의자 소개 파일 삭제 실패: ${block.content}`, error);
            }
          }
        }
      }
      console.log(`📊 강의자 소개 파일 삭제 완료: ${deletedCount}개 파일 삭제됨`);
    } catch (error) {
      console.warn('강의자 소개 JSON 비교 실패, 전체 삭제 시도:', error);
      // JSON 파싱 실패 시 기존 방식으로 전체 삭제
      await this.deleteInstructorIntroductionFiles(oldIntroduction);
    }
  }

  // ========== 수강생 관련 ==========
  async findAllStudents(): Promise<StudentResponseDto[]> {
    const students = await this.studentRepository.find({
      relations: ['user'],
      order: { enrolledDate: 'DESC' },
    });
    // 프론트엔드 형식에 맞게 변환
    return students.map((student): StudentResponseDto => {
      const name = student.user?.name || student.name || '';
      const email = student.user?.email || student.email || '';
      const phone = student.user?.phone || student.phone || '';

      return {
        id: student.id,
        name,
        email,
        phone,
        status: student.status,
        enrolledDate: toKSTDateString(student.enrolledDate instanceof Date
          ? student.enrolledDate
          : new Date(student.enrolledDate)),
        lastLogin: student.lastLogin
          ? toKSTDateTimeString(student.lastLogin instanceof Date
            ? student.lastLogin
            : new Date(student.lastLogin))
          : null,
      };
    });
  }

  async findStudentById(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`수강생을 찾을 수 없습니다 (ID: ${id})`);
    }
    return student;
  }

  async deleteStudent(id: number): Promise<void> {
    const student = await this.findStudentById(id);
    await this.studentRepository.remove(student);
  }

  // ========== 공지사항 관련 ==========
  async findAllNotices(): Promise<Notice[]> {
    return this.noticeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findNoticeById(id: number): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException(`공지사항을 찾을 수 없습니다 (ID: ${id})`);
    }
    return notice;
  }

  async createNotice(data: {
    title: string;
    content: string;
    author: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<Notice> {
    const notice = this.noticeRepository.create({
      title: data.title,
      content: data.content,
      author: data.author,
      priority: data.priority || 'medium',
      status: 'active',
    });
    return this.noticeRepository.save(notice);
  }

  async updateNotice(id: number, data: Partial<Notice>): Promise<Notice> {
    const notice = await this.findNoticeById(id);
    Object.assign(notice, data);
    return this.noticeRepository.save(notice);
  }

  async deleteNotice(id: number): Promise<void> {
    const notice = await this.findNoticeById(id);
    await this.noticeRepository.remove(notice);
  }

  // ========== FAQ 관련 (기존 Inquiries를 FAQ로 변경) ==========
  // ========== 문의사항(Inquiries) 관련 ==========
  // inquiries 테이블을 사용하여 사용자 문의사항 관리
  async findAllInquiries(): Promise<InquiryResponseDto[]> {
    // user_role 컬럼이 없을 수 있으므로 raw SQL 쿼리 사용
    const queryRunner = this.inquiryRepository.manager.connection.createQueryRunner();

    try {
      // user_role 컬럼 존재 여부 확인
      const columnExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'inquiries' AND column_name = 'user_role'
        )
      `);

      const hasUserRoleColumn = columnExists[0]?.exists || false;

      let inquiries: any[];
      if (hasUserRoleColumn) {
        inquiries = await queryRunner.query(`
          SELECT
            id, title, content, user_name as "userName",
            email, user_role as "userRole", status, response, "createdAt"
          FROM inquiries
          ORDER BY "createdAt" DESC
        `);
      } else {
        inquiries = await queryRunner.query(`
          SELECT
            id, title, content, user_name as "userName",
            email, NULL as "userRole", status, response, "createdAt"
          FROM inquiries
          ORDER BY "createdAt" DESC
        `);
      }

      // 각 inquiry에 대해 User 정보 조회하여 role 설정
      const inquiryDtos: InquiryResponseDto[] = [];
      for (const inquiry of inquiries) {
        let role: string | undefined;

        if (inquiry.userRole !== undefined && inquiry.userRole !== null) {
          role = inquiry.userRole === 2 ? 'instructor' : 'student';
        } else {
          const user = await this.userRepository.findOne({ where: { email: inquiry.email } });
          role = user?.role || undefined;
        }

        inquiryDtos.push({
          id: inquiry.id,
          title: inquiry.title,
          content: inquiry.content,
          user: inquiry.userName,
          userName: inquiry.userName,
          email: inquiry.email,
          role: role,
          createdDate: toKSTDateString(inquiry.createdAt instanceof Date
            ? inquiry.createdAt
            : new Date(inquiry.createdAt)),
          status: inquiry.status,
          response: inquiry.response || null,
        });
      }

      return inquiryDtos;
    } finally {
      await queryRunner.release();
    }
  }

  async findInquiryById(id: number): Promise<Inquiry> {
    const inquiry = await this.inquiryRepository.findOne({ where: { id } });
    if (!inquiry) {
      throw new NotFoundException(`문의사항을 찾을 수 없습니다 (ID: ${id})`);
    }
    return inquiry;
  }

  async respondToInquiry(id: number, response: string): Promise<Inquiry> {
    const inquiry = await this.findInquiryById(id);
    inquiry.response = response;
    inquiry.status = 'completed';
    return this.inquiryRepository.save(inquiry);
  }

  async createInquiry(
    data: {
      title: string;
      content: string;
      courseName?: string;
      courseNumber?: string;
    },
    userId: number,
  ): Promise<Inquiry> {
    // User 테이블에서 사용자 정보 조회
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 역할에 따라 userRole 설정: student = 1, instructor = 2
    const userRole = user.role === 'instructor' ? 2 : 1;

    const inquiry = this.inquiryRepository.create({
      title: data.title,
      content: data.content,
      userName: user.name,
      email: user.email,
      userRole: userRole,
      status: 'pending',
    });
    return this.inquiryRepository.save(inquiry);
  }

  async findInquiriesByEmail(email: string): Promise<InquiryResponseDto[]> {
    // user_role 컬럼이 없을 수 있으므로 raw SQL 쿼리 사용
    const queryRunner = this.inquiryRepository.manager.connection.createQueryRunner();

    try {
      // user_role 컬럼 존재 여부 확인
      const columnExists = await queryRunner.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'inquiries' AND column_name = 'user_role'
        )
      `);

      const hasUserRoleColumn = columnExists[0]?.exists || false;

      let inquiries: any[];
      if (hasUserRoleColumn) {
        inquiries = await queryRunner.query(`
          SELECT
            id, title, content, user_name as "userName",
            email, user_role as "userRole", status, response, "createdAt"
          FROM inquiries
          WHERE email = $1
          ORDER BY "createdAt" DESC
        `, [email]);
      } else {
        inquiries = await queryRunner.query(`
          SELECT
            id, title, content, user_name as "userName",
            email, NULL as "userRole", status, response, "createdAt"
          FROM inquiries
          WHERE email = $1
          ORDER BY "createdAt" DESC
        `, [email]);
      }

      // email로 User 조회하여 role 정보 가져오기 (userRole이 없는 경우 대비)
      const user = await this.userRepository.findOne({ where: { email } });

      // Inquiry를 InquiryResponseDto 형식으로 변환
      const inquiryDtos: InquiryResponseDto[] = [];
      for (const inquiry of inquiries) {
        let role: string | undefined;

        if (inquiry.userRole !== undefined && inquiry.userRole !== null) {
          role = inquiry.userRole === 2 ? 'instructor' : 'student';
        } else {
          role = user?.role || undefined;
        }

        inquiryDtos.push({
          id: inquiry.id,
          title: inquiry.title,
          content: inquiry.content,
          user: inquiry.userName,
          userName: inquiry.userName,
          email: inquiry.email,
          role: role,
          createdDate: toKSTDateString(inquiry.createdAt instanceof Date
            ? inquiry.createdAt
            : new Date(inquiry.createdAt)),
          status: inquiry.status,
          response: inquiry.response || null,
        });
      }

      return inquiryDtos;
    } finally {
      await queryRunner.release();
    }
  }

  // ========== 시스템 설정 관련 ==========
  async getSystemSettings(): Promise<SystemSettings> {
    let settings = await this.systemSettingsRepository.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.systemSettingsRepository.create({
        id: 1,
        emailNotifications: true,
        systemMaintenanceAlert: true,
        passwordMinLength: 8,
        sessionTimeout: 30,
        twoFactorAuth: false,
        platformName: 'LMS',
        defaultLanguage: 'ko',
        maintenanceMode: false,
        autoBackup: true,
        backupFrequency: 'daily',
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
      });
      settings = await this.systemSettingsRepository.save(settings);
    }
    return settings;
  }

  async updateSystemSettings(data: Partial<SystemSettings>): Promise<SystemSettings> {
    const settings = await this.getSystemSettings();
    Object.assign(settings, data);
    return this.systemSettingsRepository.save(settings);
  }
}
