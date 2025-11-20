import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './entities/assignment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('courses/:courseId/assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAll(@Param('courseId') courseId: string) {
    return this.assignmentsService.findAllByCourse(+courseId);
  }

  // 구체적인 라우트를 동적 라우트보다 먼저 배치
  @Post('seed')
  async seedData(@Param('courseId') courseId: string) {
    return this.assignmentsService.seedData(+courseId);
  }

  @Get(':assignmentId/submissions')
  async getSubmissions(@Param('assignmentId') assignmentId: string) {
    return this.assignmentsService.findSubmissionsByAssignment(+assignmentId);
  }

  @Get(':assignmentId/my-submission')
  @UseGuards(JwtAuthGuard)
  async getMySubmission(
    @Param('assignmentId') assignmentId: string,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || req.user?.id;
    console.log('내 제출물 조회 요청:', { assignmentId, userId, user: req.user });
    if (!userId) {
      throw new BadRequestException('로그인이 필요합니다.');
    }
    const submission = await this.assignmentsService.findStudentSubmission(+assignmentId, userId);
    if (!submission) {
      // 404 대신 null 반환 (프론트엔드에서 처리)
      return null;
    }
    return submission;
  }

  @Post(':assignmentId/submit')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const assignmentsPath = path.join(process.cwd(), '..', 'public', 'assignments');
          if (!fs.existsSync(assignmentsPath)) {
            fs.mkdirSync(assignmentsPath, { recursive: true });
          }
          cb(null, assignmentsPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          // 한글 파일명을 안전하게 처리하기 위해 고유한 파일명 사용
          cb(null, `submission-${uniqueSuffix}${ext}`);
        },
      }),
      // 한글 파일명 처리
      fileFilter: (req, file, cb) => {
        // 파일명 인코딩 문제 해결을 위해 원본 파일명을 req에 저장
        if (!req.body.originalNames) {
          req.body.originalNames = [];
        }
        // 한글 파일명 디코딩
        try {
          const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
          req.body.originalNames.push(decodedName);
        } catch (error) {
          req.body.originalNames.push(file.originalname);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async submitAssignment(
    @Param('courseId') courseId: string,
    @Param('assignmentId') assignmentId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    console.log('과제 제출 요청 받음:', { courseId, assignmentId, filesCount: files?.length, user: req.user });

    if (!files || files.length === 0) {
      console.error('파일이 없음');
      throw new BadRequestException('제출할 파일이 필요합니다.');
    }

    // JWT Strategy에서 반환하는 형식: { userId, email, role }
    const userId = req.user?.userId || req.user?.id;
    console.log('제출 시 userId:', userId, 'req.user:', req.user);
    if (!userId) {
      console.error('사용자 ID 없음:', { user: req.user, headers: req.headers });
      throw new BadRequestException('로그인이 필요합니다. 사용자 정보를 확인할 수 없습니다.');
    }

    // 원본 파일명 가져오기 (프론트엔드에서 전송한 파일명 우선 사용)
    let originalNames: string[] = [];
    if (req.body?.fileNames) {
      try {
        originalNames = JSON.parse(req.body.fileNames);
      } catch (error) {
        console.error('파일명 파싱 실패:', error);
        originalNames = req.body?.originalNames || files.map(f => f.originalname);
      }
    } else {
      originalNames = req.body?.originalNames || files.map(f => f.originalname);
    }

    try {
      return await this.assignmentsService.submitAssignment(+courseId, +assignmentId, userId, files, originalNames);
    } catch (error) {
      console.error('과제 제출 서비스 에러:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(+id);
  }

  @Post()
  async create(
    @Param('courseId') courseId: string,
    @Body() createDto: {
      title: string;
      description?: string;
      dueDate: string;
      maxScore?: number;
      instructions?: string[];
      contentBlocks?: any[];
    },
  ) {
    return this.assignmentsService.create(+courseId, createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: {
      title?: string;
      description?: string;
      dueDate?: string;
      maxScore?: number;
      instructions?: string[];
      contentBlocks?: any[];
    },
  ) {
    return this.assignmentsService.update(+id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.assignmentsService.remove(+id);
    return { message: '과제가 삭제되었습니다.' };
  }
}

// 제출물 조회용 별도 컨트롤러
@Controller('courses/:courseId/assignment-submissions')
export class AssignmentSubmissionsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  async findAllSubmissions(@Param('courseId') courseId: string) {
    return this.assignmentsService.findAllSubmissionsByCourse(+courseId);
  }

  @Put(':submissionId/score')
  async updateSubmissionScore(
    @Param('courseId') courseId: string,
    @Param('submissionId') submissionId: string,
    @Body() updateDto: { score: number; feedback?: string },
  ) {
    return this.assignmentsService.updateSubmissionScore(+submissionId, updateDto.score, updateDto.feedback);
  }

  @Delete(':submissionId')
  async deleteSubmission(
    @Param('courseId') courseId: string,
    @Param('submissionId') submissionId: string,
  ) {
    await this.assignmentsService.deleteSubmission(+submissionId);
    return { message: '제출물이 삭제되었습니다.' };
  }
}
