import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Request,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { SubAdmin } from './entities/sub-admin.entity';
import { Instructor } from './entities/instructor.entity';
import { Student } from './entities/student.entity';
import { Notice } from './entities/notice.entity';
import { FAQ } from '../faq/entities/faq.entity';
import { Inquiry } from './entities/inquiry.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { SubAdminResponseDto } from './dto/sub-admin-response.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { InstructorResponseDto } from './dto/instructor-response.dto';
import { InquiryResponseDto } from './dto/inquiry-response.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== 서브 관리자 관련 ==========
  @Get('sub-admins')
  async getAllSubAdmins(): Promise<SubAdminResponseDto[]> {
    return this.adminService.findAllSubAdmins();
  }

  @Get('sub-admins/:id')
  async getSubAdmin(@Param('id', ParseIntPipe) id: number): Promise<SubAdmin> {
    return this.adminService.findSubAdminById(id);
  }

  @Post('sub-admins')
  async createSubAdmin(@Body() data: {
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
    return this.adminService.createSubAdmin(data);
  }

  @Put('sub-admins/:id')
  async updateSubAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<SubAdmin>,
  ): Promise<SubAdmin> {
    return this.adminService.updateSubAdmin(id, data);
  }

  @Delete('sub-admins/:id')
  async deleteSubAdmin(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.adminService.deleteSubAdmin(id);
    return { message: '서브 관리자가 삭제되었습니다.' };
  }

  // ========== 강사 관련 ==========
  @Get('instructors')
  async getAllInstructors(): Promise<InstructorResponseDto[]> {
    return this.adminService.findAllInstructors();
  }

  @Get('instructors/:id')
  async getInstructor(@Param('id', ParseIntPipe) id: number): Promise<Instructor> {
    return this.adminService.findInstructorById(id);
  }

  @Put('instructors/:id/approve')
  async approveInstructor(@Param('id', ParseIntPipe) id: number): Promise<Instructor> {
    return this.adminService.approveInstructor(id);
  }

  @Put('instructors/:id/reject')
  async rejectInstructor(@Param('id', ParseIntPipe) id: number): Promise<Instructor> {
    return this.adminService.rejectInstructor(id);
  }

  @Put('instructors/:id/pending')
  async pendingInstructor(@Param('id', ParseIntPipe) id: number): Promise<Instructor> {
    return this.adminService.pendingInstructor(id);
  }

  // 더 구체적인 라우트를 먼저 배치 (라우트 순서 중요)
  @UseGuards(JwtAuthGuard)
  @Get('instructors/user/:userId/introduction')
  async getInstructorIntroduction(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ): Promise<{ introduction: string | null }> {
    // 본인만 조회 가능 (JWT strategy는 req.user.userId를 사용)
    const userIdFromToken = req.user?.userId;
    if (!req.user || userIdFromToken !== userId) {
      throw new ForbiddenException('본인의 소개글만 조회할 수 있습니다.');
    }
    const introduction = await this.adminService.getInstructorIntroduction(userId);
    return { introduction };
  }

  @UseGuards(JwtAuthGuard)
  @Put('instructors/user/:userId/introduction')
  async updateInstructorIntroduction(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: { introduction: string },
    @Request() req,
  ): Promise<{ message: string; instructor: Instructor }> {
    // 본인만 수정 가능 (JWT strategy는 req.user.userId를 사용)
    const userIdFromToken = req.user?.userId;
    if (!req.user || userIdFromToken !== userId) {
      throw new ForbiddenException('본인의 소개글만 수정할 수 있습니다.');
    }
    const instructor = await this.adminService.updateInstructorIntroduction(userId, data.introduction);
    return { message: '소개글이 저장되었습니다.', instructor };
  }

  @Get('instructors/:instructorId/introduction')
  async getInstructorIntroductionPublic(
    @Param('instructorId', ParseIntPipe) instructorId: number,
  ): Promise<{ introduction: string | null }> {
    const instructor = await this.adminService.findInstructorById(instructorId);
    return { introduction: instructor.introduction || null };
  }

  // ========== 수강생 관련 ==========
  @Get('students')
  async getAllStudents(): Promise<StudentResponseDto[]> {
    return this.adminService.findAllStudents();
  }

  @Get('students/:id')
  async getStudent(@Param('id', ParseIntPipe) id: number): Promise<Student> {
    return this.adminService.findStudentById(id);
  }

  @Delete('students/:id')
  async deleteStudent(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.adminService.deleteStudent(id);
    return { message: '수강생이 삭제되었습니다.' };
  }

  // ========== 공지사항 관련 ==========
  @Get('notices')
  async getAllNotices(): Promise<Notice[]> {
    return this.adminService.findAllNotices();
  }

  @Get('notices/:id')
  async getNotice(@Param('id', ParseIntPipe) id: number): Promise<Notice> {
    return this.adminService.findNoticeById(id);
  }

  @Post('notices')
  async createNotice(@Body() data: {
    title: string;
    content: string;
    author: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<Notice> {
    return this.adminService.createNotice(data);
  }

  @Put('notices/:id')
  async updateNotice(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Notice>,
  ): Promise<Notice> {
    return this.adminService.updateNotice(id, data);
  }

  @Delete('notices/:id')
  async deleteNotice(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.adminService.deleteNotice(id);
    return { message: '공지사항이 삭제되었습니다.' };
  }

  // ========== 문의사항 관련 ==========
  @Get('inquiries')
  async getAllInquiries(): Promise<InquiryResponseDto[]> {
    return this.adminService.findAllInquiries();
  }

  @UseGuards(JwtAuthGuard)
  @Post('inquiries')
  async createInquiry(
    @Body() data: {
      title: string;
      content: string;
      courseName?: string;
      courseNumber?: string;
    },
    @Request() req,
  ): Promise<Inquiry> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ForbiddenException('로그인이 필요합니다.');
    }
    return this.adminService.createInquiry(data, userId);
  }

  // 구체적인 라우트를 동적 라우트보다 먼저 배치 (라우팅 순서 중요!)
  @UseGuards(JwtAuthGuard)
  @Get('inquiries/my')
  async getMyInquiries(
    @Request() req,
  ): Promise<InquiryResponseDto[]> {
    // JWT에서 직접 사용자 이메일 가져오기
    const userEmail = req.user?.email;
    if (!userEmail) {
      throw new ForbiddenException('사용자 정보를 찾을 수 없습니다.');
    }
    return this.adminService.findInquiriesByEmail(userEmail);
  }

  @Get('inquiries/:id')
  async getInquiry(@Param('id', ParseIntPipe) id: number): Promise<Inquiry> {
    return this.adminService.findInquiryById(id);
  }

  @Put('inquiries/:id/respond')
  async respondToInquiry(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { response: string },
  ): Promise<Inquiry> {
    return this.adminService.respondToInquiry(id, data.response);
  }

  // ========== 시스템 설정 관련 ==========
  @Get('system-settings')
  async getSystemSettings(): Promise<SystemSettings> {
    return this.adminService.getSystemSettings();
  }

  @Put('system-settings')
  async updateSystemSettings(@Body() data: Partial<SystemSettings>): Promise<SystemSettings> {
    return this.adminService.updateSystemSettings(data);
  }
}

