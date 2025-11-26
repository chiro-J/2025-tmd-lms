import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

@Controller('courses')
export class CoursesController {
  // 환경변수에서 resources 경로 읽어오기
  private getResourcesPath(): string {
    const uploadPathResource = process.env.UPLOAD_PATH_RESOURCE || 'resources';
    return path.join(process.cwd(), '..', 'public', uploadPathResource);
  }

  constructor(private readonly coursesService: CoursesService) {
    // resources 폴더가 없으면 생성
    if (!fs.existsSync(this.getResourcesPath())) {
      fs.mkdirSync(this.getResourcesPath(), { recursive: true });
    }
  }

  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get('enroll/:code')
  async findByEnrollmentCode(@Param('code') code: string): Promise<Course | null> {
    return this.coursesService.findByEnrollmentCode(code);
  }

  @Get('enrolled/:userId')
  async getUserEnrollments(@Param('userId') userId: string) {
    return this.coursesService.getUserEnrollments(+userId);
  }

  @Post('seed')
  async seedData(): Promise<{ message: string; course: Course }> {
    return this.coursesService.seedData();
  }

  // ========== 강좌별 공지사항 관련 (더 구체적인 경로를 먼저) ==========
  @Put(':id/notices/:noticeId')
  async updateCourseNotice(
    @Param('id') id: string,
    @Param('noticeId') noticeId: string,
    @Body() data: { title: string; content: string; attachments?: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null },
  ) {
    try {
      return await this.coursesService.updateCourseNotice(+id, +noticeId, data);
    } catch (error) {
      console.error('공지사항 수정 컨트롤러 에러:', error);
      throw error;
    }
  }

  @Get(':id/notices')
  async getCourseNotices(@Param('id') id: string) {
    return this.coursesService.getCourseNotices(+id);
  }

  @Post(':id/notices')
  async createCourseNotice(
    @Param('id') id: string,
    @Body() data: { title: string; content: string; attachments?: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null },
  ) {
    try {
      return await this.coursesService.createCourseNotice(+id, data);
    } catch (error) {
      console.error('공지사항 생성 컨트롤러 에러:', error);
      throw error;
    }
  }

  @Delete(':id/notices/:noticeId')
  async deleteCourseNotice(
    @Param('id') id: string,
    @Param('noticeId') noticeId: string,
  ) {
    try {
      await this.coursesService.deleteCourseNotice(+id, +noticeId);
      return { message: '공지사항이 삭제되었습니다.' };
    } catch (error) {
      console.error('공지사항 삭제 컨트롤러 에러:', error);
      throw error;
    }
  }

  // ========== 강좌별 강의 자료 관련 (더 구체적인 경로를 먼저) ==========
  @Get(':id/resources')
  async getCourseResources(@Param('id') id: string) {
    return this.coursesService.getCourseResources(+id);
  }

  @Post(':id/resources')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // 모든 강의 자료는 환경변수 기반 resources 폴더에 저장
          const uploadPathResource = process.env.UPLOAD_PATH_RESOURCE || 'resources';
          const resourcesPath = path.join(process.cwd(), '..', 'public', uploadPathResource);
          if (!fs.existsSync(resourcesPath)) {
            fs.mkdirSync(resourcesPath, { recursive: true });
          }
          cb(null, resourcesPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `resource-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async createCourseResource(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: { title: string; type: string; linkUrl?: string; code?: string },
  ) {
    const courseId = +id;
    const { title, type, linkUrl, code } = body;

    // 환경변수 기반 경로 사용
    const uploadPathResource = process.env.UPLOAD_PATH_RESOURCE || 'resources';

    // 타입별 유효성 검사
    if (type === 'pdf' || type === 'slide') {
      if (!file) {
        throw new BadRequestException('파일이 필요합니다.');
      }
      const fileUrl = `/${uploadPathResource}/${file.filename}`;
      return this.coursesService.createCourseResource(courseId, {
        title: title || file.originalname,
        type,
        fileUrl,
        fileSize: file.size,
      });
    } else if (type === 'image') {
      if (!file) {
        throw new BadRequestException('이미지 파일이 필요합니다.');
      }
      // multer가 이미 resources 폴더에 저장했으므로 파일명만 사용
      const fileUrl = `/${uploadPathResource}/${file.filename}`;
      return this.coursesService.createCourseResource(courseId, {
        title: title || file.originalname,
        type,
        fileUrl,
        fileSize: file.size,
      });
    } else if (type === 'link') {
      if (!linkUrl) {
        throw new BadRequestException('링크 URL이 필요합니다.');
      }
      return this.coursesService.createCourseResource(courseId, {
        title: title || '링크 자료',
        type,
        linkUrl,
      });
    } else if (type === 'code') {
      if (!code) {
        throw new BadRequestException('코드가 필요합니다.');
      }
      return this.coursesService.createCourseResource(courseId, {
        title: title || '코드 자료',
        type,
        code,
      });
    } else {
      throw new BadRequestException('유효하지 않은 자료 타입입니다.');
    }
  }

  @Delete(':id/resources/:resourceId')
  async deleteCourseResource(
    @Param('id') id: string,
    @Param('resourceId') resourceId: string,
  ) {
    const resource = await this.coursesService.getCourseResources(+id);
    const targetResource = resource.find(r => r.id === +resourceId);

    // 파일이 있으면 삭제 (UploadService 사용 - 환경변수 기반 경로 처리)
    if (targetResource?.fileUrl) {
      try {
        const { UploadService } = await import('../upload/upload.service');
        const { ConfigService } = await import('@nestjs/config');
        const configService = new ConfigService();
        const uploadService = new UploadService(configService);
        await uploadService.deleteFile(targetResource.fileUrl);
        console.log(`✅ 강의 자료 파일 삭제: ${targetResource.fileUrl}`);
      } catch (error) {
        console.error(`❌ 강의 자료 파일 삭제 실패: ${targetResource.fileUrl}`, error);
      }
    }

    return this.coursesService.deleteCourseResource(+id, +resourceId);
  }

  @Put(':id/resources/:resourceId/download-allowed')
  async updateCourseResourceDownloadAllowed(
    @Param('id') id: string,
    @Param('resourceId') resourceId: string,
    @Body() body: { downloadAllowed: boolean },
  ) {
    return this.coursesService.updateCourseResourceDownloadAllowed(+id, +resourceId, body.downloadAllowed);
  }

  // ========== 강좌별 수강자 관련 (더 구체적인 경로를 먼저) ==========
  @Get(':id/enrollments')
  async getCourseEnrollments(@Param('id') id: string) {
    return this.coursesService.getCourseEnrollments(+id);
  }

  @Post(':id/enroll')
  async enrollInCourse(
    @Param('id') id: string,
    @Body() body: { userId: number },
  ) {
    return this.coursesService.enrollInCourse(+id, body.userId);
  }

  @Delete(':id/enroll')
  async unenrollFromCourse(
    @Param('id') id: string,
    @Body() body: { userId: number },
  ) {
    await this.coursesService.unenrollFromCourse(+id, body.userId);
    return { message: '수강 취소 완료' };
  }

  // ========== 강좌별 QnA 관련 (더 구체적인 경로를 먼저) ==========
  @Get(':id/qna')
  async getCourseQnAs(@Param('id') id: string) {
    return this.coursesService.getCourseQnAs(+id);
  }

  @Post(':id/qna')
  async createCourseQnA(
    @Param('id') id: string,
    @Body() body: { userId: number; title: string; question: string; isPublic?: boolean },
  ) {
    return this.coursesService.createCourseQnA(+id, body.userId, body.title, body.question, body.isPublic ?? true);
  }

  @Delete(':id/qna/:qnaId')
  async deleteCourseQnA(
    @Param('id') id: string,
    @Param('qnaId') qnaId: string,
  ) {
    await this.coursesService.deleteCourseQnA(+qnaId);
    return { message: 'QnA 삭제 완료' };
  }

  @Post(':id/qna/:qnaId/answers')
  async createCourseQnAAnswer(
    @Param('id') id: string,
    @Param('qnaId') qnaId: string,
    @Body() body: { userId: number; content: string; parentAnswerId?: number },
  ) {
    return this.coursesService.createCourseQnAAnswer(+qnaId, body.userId, body.content, body.parentAnswerId);
  }

  // ========== 강좌 삭제 (더 구체적인 경로들보다 먼저 배치) ==========
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.coursesService.delete(+id);
    return { message: '강좌가 삭제되었습니다.' };
  }

  // ========== 기본 강좌 조회 (가장 마지막에 배치) ==========
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Course | null> {
    return this.coursesService.findOne(+id);
  }

  @Post()
  async create(@Body() createCourseDto: Partial<Course>): Promise<Course> {
    return this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: Partial<Course>): Promise<Course> {
    console.log('📥 Course.update API 호출:', {
      courseId: id,
      updateData: updateCourseDto,
      thumbnail: updateCourseDto.thumbnail,
      thumbnailType: typeof updateCourseDto.thumbnail
    });
    return this.coursesService.update(+id, updateCourseDto);
  }
}

