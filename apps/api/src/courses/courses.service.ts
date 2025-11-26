import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseNotice } from './entities/course-notice.entity';
import { CourseResource } from './entities/course-resource.entity';
import { CourseEnrollment } from './entities/course-enrollment.entity';
import { CourseQnA } from './entities/course-qna.entity';
import { CourseQnAAnswer } from './entities/course-qna-answer.entity';
import { User } from '../users/entities/user.entity';
import { getUploadService } from '../utils/upload-helper';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(CourseNotice)
    private courseNoticeRepository: Repository<CourseNotice>,
    @InjectRepository(CourseResource)
    private courseResourceRepository: Repository<CourseResource>,
    @InjectRepository(CourseEnrollment)
    private courseEnrollmentRepository: Repository<CourseEnrollment>,
    @InjectRepository(CourseQnA)
    private courseQnARepository: Repository<CourseQnA>,
    @InjectRepository(CourseQnAAnswer)
    private courseQnAAnswerRepository: Repository<CourseQnAAnswer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Course[]> {
    const courses = await this.courseRepository.find({
      order: { createdAt: 'DESC' },
    });

    // 수강코드가 없는 강좌에 자동으로 부여
    for (const course of courses) {
      if (!course.enrollmentCode) {
        course.enrollmentCode = await this.generateUniqueEnrollmentCode();
        await this.courseRepository.save(course);
      }
    }

    return courses;
  }

  async findOne(id: number): Promise<Course | null> {
    const course = await this.courseRepository.findOne({ where: { id } });

    // 수강코드가 없으면 자동으로 부여
    if (course && !course.enrollmentCode) {
      course.enrollmentCode = await this.generateUniqueEnrollmentCode();
      await this.courseRepository.save(course);
    }

    return course;
  }

  /**
   * 수강코드 생성 (예: ABC123)
   */
  private generateEnrollmentCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    let code = '';

    // 3자리 알파벳
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // 3자리 숫자
    for (let i = 0; i < 3; i++) {
      code += nums.charAt(Math.floor(Math.random() * nums.length));
    }

    return code;
  }

  /**
   * 고유한 수강코드 생성 (중복 체크)
   */
  private async generateUniqueEnrollmentCode(): Promise<string> {
    let code: string;
    let exists: boolean;

    do {
      code = this.generateEnrollmentCode();
      const existing = await this.courseRepository.findOne({
        where: { enrollmentCode: code }
      });
      exists = !!existing;
    } while (exists);

    return code;
  }

  async create(createCourseDto: Partial<Course>): Promise<Course> {
    // 수강코드가 없으면 자동 생성
    if (!createCourseDto.enrollmentCode) {
      createCourseDto.enrollmentCode = await this.generateUniqueEnrollmentCode();
    }

    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async update(id: number, updateCourseDto: Partial<Course>): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }


    // 썸네일이 변경되거나 삭제되는 경우 기존 파일 삭제
    if (updateCourseDto.thumbnail !== undefined) {
      const oldThumbnail = course.thumbnail;
      const newThumbnail = updateCourseDto.thumbnail;


      // 기존 썸네일이 있고, 새로운 썸네일과 다르며, 기본 썸네일이 아닌 경우 삭제
      if (oldThumbnail && oldThumbnail !== newThumbnail &&
          !oldThumbnail.includes('aaa.jpg') && !oldThumbnail.includes('bbb.jpg') && !oldThumbnail.includes('ccc.jpg')) {
        try {
          // UploadService를 통해 파일 삭제 (환경변수 기반 경로 처리)
          const { UploadService } = await import('../upload/upload.service');
          const { ConfigService } = await import('@nestjs/config');
          const configService = new ConfigService();
          const uploadService = new UploadService(configService);
          await uploadService.deleteFile(oldThumbnail);
        } catch (error) {
          console.error('썸네일 파일 삭제 실패:', error instanceof Error ? error.message : String(error));
          // 파일 삭제 실패해도 계속 진행
        }
      }
    }

    Object.assign(course, updateCourseDto);
    const savedCourse = await this.courseRepository.save(course);
    return savedCourse;
  }

  async delete(id: number): Promise<void> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`강좌를 찾을 수 없습니다.`);
    }

    // 강좌 삭제 (CASCADE로 관련 데이터도 자동 삭제됨)
    await this.courseRepository.remove(course);
  }

  /**
   * 수강코드로 강좌 조회
   */
  async findByEnrollmentCode(code: string): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { enrollmentCode: code }
    });
  }

  async seedData(): Promise<{ message: string; course: Course }> {
    // 이미 데이터가 있는지 확인
    const existing = await this.courseRepository.findOne({
      where: { title: '(1회차) 풀스택 과정' }
    });

    if (existing) {
      return {
        message: '강좌가 이미 존재합니다.',
        course: existing,
      };
    }

    // 강사 페이지에 보이는 강좌 데이터 생성
    const enrollmentCode = await this.generateUniqueEnrollmentCode();
    // 환경변수 기반 기본 썸네일 경로
    const uploadPathThumbnail = process.env.UPLOAD_PATH_THUMBNAIL || 'thumbnails';
    const DEFAULT_THUMBNAIL = `/${uploadPathThumbnail}/aaa.jpg`;
    const course = this.courseRepository.create({
      title: '(1회차) 풀스택 과정',
      instructor: '박강사', // 빠른 로그인 계정 이름으로 변경
      thumbnail: DEFAULT_THUMBNAIL,
      progress: 0,
      status: 'published',
      enrollmentCode: enrollmentCode,
    });

    const saved = await this.courseRepository.save(course);

    return {
      message: '강좌 데이터가 성공적으로 생성되었습니다.',
      course: saved,
    };
  }

  // ========== 강좌별 공지사항 관련 ==========
  async getCourseNotices(courseId: number): Promise<CourseNotice[]> {
    return this.courseNoticeRepository.find({
      where: { courseId },
      order: { createdAt: 'DESC' },
    });
  }

  async createCourseNotice(courseId: number, data: { title: string; content: string; attachments?: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null }): Promise<CourseNotice> {
    try {
      // attachments 처리: 빈 배열이면 null로 변환
      let attachmentsData = null;
      if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
        attachmentsData = data.attachments;
      }

      const notice = this.courseNoticeRepository.create({
        courseId,
        title: data.title,
        content: data.content,
        attachments: attachmentsData,
      });
      return await this.courseNoticeRepository.save(notice);
    } catch (error) {
      console.error('공지사항 생성 실패:', error);
      throw error;
    }
  }

  async updateCourseNotice(courseId: number, noticeId: number, data: { title: string; content: string; attachments?: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null }): Promise<CourseNotice> {
    try {
      const notice = await this.courseNoticeRepository.findOne({
        where: { id: noticeId, courseId },
      });
      if (!notice) {
        throw new Error('공지사항을 찾을 수 없습니다.');
      }

      // 첨부파일이 변경되는 경우, 이전 첨부파일 삭제
      if (data.attachments !== undefined && notice.attachments) {
        const uploadService = await getUploadService();
        const oldAttachments = Array.isArray(notice.attachments) ? notice.attachments : [];
        const newAttachments = data.attachments ? (Array.isArray(data.attachments) ? data.attachments : []) : [];

        // 이전 첨부파일 중 새로운 목록에 없는 파일 삭제
        const newUrls = new Set(newAttachments.map(a => a.url));
        for (const attachment of oldAttachments) {
          if (!newUrls.has(attachment.url)) {
            try {
              await uploadService.deleteFile(attachment.url);
            } catch (error) {
              console.error(`강의 공지사항 첨부파일 삭제 실패: ${attachment.url}`, error);
            }
          }
        }
      }

      // attachments 처리: 빈 배열이면 null로 변환
      let attachmentsData = null;
      if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
        attachmentsData = data.attachments;
      }

      notice.title = data.title;
      notice.content = data.content;
      notice.attachments = attachmentsData;
      return await this.courseNoticeRepository.save(notice);
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      throw error;
    }
  }

  async deleteCourseNotice(courseId: number, noticeId: number): Promise<void> {
    try {
      const notice = await this.courseNoticeRepository.findOne({
        where: { id: noticeId, courseId },
      });
      if (!notice) {
        throw new Error('공지사항을 찾을 수 없습니다.');
      }

      // 첨부파일 삭제
      if (notice.attachments && Array.isArray(notice.attachments)) {
        const uploadService = await getUploadService();
        for (const attachment of notice.attachments) {
          try {
            await uploadService.deleteFile(attachment.url);
          } catch (error) {
            console.error(`강의 공지사항 첨부파일 삭제 실패: ${attachment.url}`, error);
          }
        }
      }

      await this.courseNoticeRepository.remove(notice);
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      throw error;
    }
  }

  // ========== 강좌별 강의 자료 관련 ==========
  async getCourseResources(courseId: number): Promise<CourseResource[]> {
    return this.courseResourceRepository.find({
      where: { courseId },
      order: { createdAt: 'DESC' },
    });
  }

  async createCourseResource(
    courseId: number,
    data: {
      title: string;
      type: string;
      fileUrl?: string;
      linkUrl?: string;
      code?: string;
      fileSize?: number;
      downloadAllowed?: boolean;
    }
  ): Promise<CourseResource> {
    try {
      const resource = this.courseResourceRepository.create({
        courseId,
        title: data.title,
        type: data.type,
        fileUrl: data.fileUrl,
        linkUrl: data.linkUrl,
        code: data.code,
        fileSize: data.fileSize,
        downloadAllowed: data.downloadAllowed ?? true,
      });
      return await this.courseResourceRepository.save(resource);
    } catch (error) {
      console.error('강의 자료 생성 실패:', error);
      throw error;
    }
  }

  async deleteCourseResource(courseId: number, resourceId: number): Promise<void> {
    try {
      const resource = await this.courseResourceRepository.findOne({
        where: { id: resourceId, courseId },
      });
      if (!resource) {
        throw new Error('강의 자료를 찾을 수 없습니다.');
      }
      await this.courseResourceRepository.remove(resource);
    } catch (error) {
      console.error('강의 자료 삭제 실패:', error);
      throw error;
    }
  }

  async updateCourseResourceDownloadAllowed(
    courseId: number,
    resourceId: number,
    downloadAllowed: boolean
  ): Promise<CourseResource> {
    try {
      const resource = await this.courseResourceRepository.findOne({
        where: { id: resourceId, courseId },
      });
      if (!resource) {
        throw new Error('강의 자료를 찾을 수 없습니다.');
      }
      resource.downloadAllowed = downloadAllowed;
      return await this.courseResourceRepository.save(resource);
    } catch (error) {
      console.error('강의 자료 수정 실패:', error);
      throw error;
    }
  }

  // ========== 강좌별 수강자 관련 ==========
  async getCourseEnrollments(courseId: number) {
    return this.courseEnrollmentRepository.find({
      where: { courseId },
      relations: ['user'],
      order: { enrolledAt: 'DESC' },
    });
  }

  async getUserEnrollments(userId: number) {
    return this.courseEnrollmentRepository.find({
      where: { userId },
      relations: ['course'],
      order: { enrolledAt: 'DESC' },
    });
  }

  async enrollInCourse(courseId: number, userId: number): Promise<CourseEnrollment> {
    // 강좌 정보 조회
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('강좌를 찾을 수 없습니다.');
    }

    // 공개/비공개 설정 확인
    const isPublic = course.status === '공개' || course.status === 'published';
    if (!isPublic) {
      throw new BadRequestException('비공개 강좌는 수강 신청이 불가능합니다.');
    }

    // 이미 등록되어 있는지 확인
    const existing = await this.courseEnrollmentRepository.findOne({
      where: { courseId, userId },
    });

    if (existing) {
      return existing;
    }

    // 수강 등록 생성
    const enrollment = this.courseEnrollmentRepository.create({
      courseId,
      userId,
    });

    return await this.courseEnrollmentRepository.save(enrollment);
  }

  async unenrollFromCourse(courseId: number, userId: number): Promise<void> {
    await this.courseEnrollmentRepository.delete({
      courseId,
      userId,
    });
  }


  async createCourseQnA(courseId: number, userId: number, title: string, question: string, isPublic: boolean = true): Promise<CourseQnA> {
    try {
      const qna = this.courseQnARepository.create({
        courseId,
        userId,
        title,
        question,
        isPublic,
      });
      return await this.courseQnARepository.save(qna);
    } catch (error) {
      console.error('QnA 생성 실패:', error);
      throw error;
    }
  }

  async deleteCourseQnA(qnaId: number): Promise<void> {
    await this.courseQnARepository.delete(qnaId);
  }

  async getCourseQnAs(courseId: number, userId?: number): Promise<CourseQnA[]> {
    // 강의자는 모든 QnA를 볼 수 있고, 수강생은 공개된 QnA와 자신의 QnA만 볼 수 있음
    const qnas = await this.courseQnARepository.find({
      where: { courseId },
      relations: ['user', 'answers', 'answers.user', 'answers.replies', 'answers.replies.user'],
      order: { createdAt: 'DESC' },
    });

    // userId가 제공되면 필터링 (강의자는 모든 QnA를 볼 수 있으므로 별도 필터링 불필요)
    // 실제 필터링은 프론트엔드나 권한 체크에서 처리
    return qnas;
  }

  async createCourseQnAAnswer(qnaId: number, userId: number, content: string, parentAnswerId?: number): Promise<CourseQnAAnswer> {
    try {
      const answer = this.courseQnAAnswerRepository.create({
        qnaId,
        userId,
        content,
        parentAnswerId: parentAnswerId || null,
      });
      return await this.courseQnAAnswerRepository.save(answer);
    } catch (error) {
      console.error('QnA 답변 생성 실패:', error);
      throw error;
    }
  }
}

