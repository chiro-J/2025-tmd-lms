import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { AssignmentSubmission } from './entities/assignment-submission.entity';
import { UsersService } from '../users/users.service';
import { CourseEnrollment } from '../courses/entities/course-enrollment.entity';
import { getKSTDate, toKSTDateString, toKSTISOString } from '../utils/timezone';
import { getUploadService } from '../utils/upload-helper';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentSubmission)
    private submissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(CourseEnrollment)
    private courseEnrollmentRepository: Repository<CourseEnrollment>,
    private usersService: UsersService,
  ) {}

  async findAllByCourse(courseId: number) {
    const assignments = await this.assignmentRepository.find({
      where: { courseId },
      order: { dueDate: 'DESC' },
      relations: ['submissions'],
    });

    // 각 과제의 통계 계산 (KST 기준)
    const now = getKSTDate();
    const assignmentsWithStats = await Promise.all(
      assignments.map(async (assignment) => {
        const submissions = await this.submissionRepository.count({
          where: {
            assignmentId: assignment.id,
            status: In(['제출', '지연']),
          },
        });

        // 실제 강의에 등록된 수강생 수 조회
        const total = await this.courseEnrollmentRepository.count({
          where: { courseId: assignment.courseId },
        });

        const status = assignment.dueDate < now ? '마감' : '진행 중';

        return {
          id: assignment.id,
          courseId: assignment.courseId,
          title: assignment.title,
          description: assignment.description,
          dueDate: toKSTDateString(assignment.dueDate),
          maxScore: assignment.maxScore,
          instructions: assignment.instructions || [],
          contentBlocks: assignment.contentBlocks || [],
          submissions,
          total,
          status,
        };
      }),
    );

    return assignmentsWithStats;
  }

  async findOne(id: number) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['submissions'],
    });

    if (!assignment) {
      return null;
    }

    // 날짜 형식 변환 및 응답 형식 맞추기
    return {
      id: assignment.id,
      courseId: assignment.courseId,
      title: assignment.title,
      description: assignment.description,
      dueDate: toKSTDateString(assignment.dueDate), // yyyy-MM-dd 형식 (KST)
      maxScore: assignment.maxScore,
      instructions: assignment.instructions || [],
      contentBlocks: assignment.contentBlocks || [],
      submissions: assignment.submissions || [],
    };
  }

  async create(courseId: number, createDto: {
    title: string;
    description?: string;
    dueDate: string;
    maxScore?: number;
    instructions?: string[];
    contentBlocks?: any[];
  }) {
    const assignment = this.assignmentRepository.create({
      courseId,
      title: createDto.title,
      description: createDto.description,
      dueDate: new Date(createDto.dueDate),
      maxScore: createDto.maxScore || 100,
      instructions: createDto.instructions,
      contentBlocks: createDto.contentBlocks || [],
    });

    const saved = await this.assignmentRepository.save(assignment);

    // 생성된 데이터를 반환 (findOne과 동일한 형식)
    return {
      id: saved.id,
      courseId: saved.courseId,
      title: saved.title,
      description: saved.description,
      dueDate: saved.dueDate.toISOString().split('T')[0],
      maxScore: saved.maxScore,
      instructions: saved.instructions || [],
      contentBlocks: saved.contentBlocks || [],
    };
  }

  async update(id: number, updateDto: {
    title?: string;
    description?: string;
    dueDate?: string;
    maxScore?: number;
    instructions?: string[];
    contentBlocks?: any[];
  }) {
    const assignment = await this.assignmentRepository.findOne({ where: { id } });
    if (!assignment) {
      throw new Error('과제를 찾을 수 없습니다.');
    }

    // 모든 필드 업데이트 (undefined가 아닌 경우)
    if (updateDto.title !== undefined) assignment.title = updateDto.title;
    if (updateDto.description !== undefined) {
      assignment.description = updateDto.description || null;
    }
    if (updateDto.dueDate) assignment.dueDate = new Date(updateDto.dueDate);
    if (updateDto.maxScore !== undefined) assignment.maxScore = updateDto.maxScore;
    if (updateDto.instructions !== undefined) assignment.instructions = updateDto.instructions || [];
    if (updateDto.contentBlocks !== undefined) assignment.contentBlocks = updateDto.contentBlocks || [];

    const saved = await this.assignmentRepository.save(assignment);

    // 수정된 데이터를 반환 (findOne과 동일한 형식)
    return {
      id: saved.id,
      courseId: saved.courseId,
      title: saved.title,
      description: saved.description,
      dueDate: saved.dueDate.toISOString().split('T')[0],
      maxScore: saved.maxScore,
      instructions: saved.instructions || [],
      contentBlocks: saved.contentBlocks || [],
    };
  }

  async remove(id: number) {
    const assignment = await this.assignmentRepository.findOne({ where: { id } });
    if (!assignment) {
      throw new Error('과제를 찾을 수 없습니다.');
    }

    console.log(`🗑️ 과제 삭제 시작: ID ${id}`);

    // 해당 과제의 모든 제출물 조회
    const submissions = await this.submissionRepository.find({
      where: { assignmentId: id },
    });

    console.log(`📊 과제 제출물 개수: ${submissions.length}개`);

    // 각 제출물의 파일 삭제 및 제출물 삭제
    if (submissions.length > 0) {
      const uploadService = await getUploadService();

      for (const submission of submissions) {
        // 제출물의 파일 삭제
        if (submission.files && Array.isArray(submission.files)) {
          for (const file of submission.files) {
            if (file.url) {
              try {
                await uploadService.deleteFile(file.url);
                console.log(`✅ 과제 제출 파일 삭제: ${file.url}`);
              } catch (error) {
                console.error(`❌ 과제 제출 파일 삭제 실패: ${file.url}`, error);
              }
            }
          }
        }
      }

      // 제출물 DB 삭제
      await this.submissionRepository.remove(submissions);
      console.log(`✅ ${submissions.length}개 제출물 삭제 완료`);
    }

    // 과제 삭제
    await this.assignmentRepository.remove(assignment);
    console.log(`✅ 과제 삭제 완료: ID ${id}`);
  }

  // 제출물 조회
  async findSubmissionsByAssignment(assignmentId: number) {
    const submissions = await this.submissionRepository.find({
      where: { assignmentId },
      order: { submittedAt: 'DESC' },
    });

    // 날짜를 ISO 문자열로 변환
    return submissions.map(sub => ({
      ...sub,
      submittedAt: sub.submittedAt ? toKSTISOString(sub.submittedAt) : null,
    }));
  }

  // 학생의 특정 과제 제출물 조회
  async findStudentSubmission(assignmentId: number, userId: number) {
    console.log('제출물 조회:', { assignmentId, userId });

    // 모든 제출물 조회 (디버깅용)
    const allSubmissions = await this.submissionRepository.find({
      where: { assignmentId },
    });
    console.log('해당 과제의 모든 제출물:', allSubmissions.map(s => ({ id: s.id, assignmentId: s.assignmentId, userId: s.userId, status: s.status })));

    const submission = await this.submissionRepository.findOne({
      where: { assignmentId, userId },
      order: { submittedAt: 'DESC' },
    });

    console.log('제출물 조회 결과:', submission ? {
      id: submission.id,
      assignmentId: submission.assignmentId,
      userId: submission.userId,
      status: submission.status,
      submittedAt: submission.submittedAt,
    } : null);

    if (!submission) {
      console.log('제출물을 찾을 수 없음. 조건:', { assignmentId, userId });
      return null;
    }

    let studentName = submission.studentName;

    // studentName이 null이고 userId가 있으면 users 테이블에서 이름 가져오기
    if (!studentName && submission.userId) {
      try {
        const user = await this.usersService.findOne(submission.userId);
        if (user) {
          studentName = user.name;
        }
      } catch (error) {
        console.error('사용자 이름 조회 실패:', error);
      }
    }

    return {
      id: submission.id,
      assignmentId: submission.assignmentId,
      userId: submission.userId,
      studentName: studentName || '이름 없음',
      submittedAt: submission.submittedAt ? toKSTISOString(submission.submittedAt) : null,
      status: submission.status,
      score: submission.score,
      feedback: submission.feedback,
      files: submission.files,
    };
  }

  async findAllSubmissionsByCourse(courseId: number) {
    // 해당 강좌의 모든 과제 조회
    const assignments = await this.assignmentRepository.find({
      where: { courseId },
      select: ['id', 'title'],
    });

    // 각 과제의 제출물 조회
    const allSubmissions = [];
    for (const assignment of assignments) {
      const submissions = await this.submissionRepository.find({
        where: { assignmentId: assignment.id },
        order: { submittedAt: 'DESC' },
      });

      // 제출물에 과제명 추가 및 날짜 형식 변환
      for (const sub of submissions) {
        let studentName = sub.studentName;

        // studentName이 null이고 userId가 있으면 users 테이블에서 이름 가져오기
        if (!studentName && sub.userId) {
          try {
            const user = await this.usersService.findOne(sub.userId);
            if (user) {
              studentName = user.name;
            }
          } catch (error) {
            console.error('사용자 이름 조회 실패:', error);
          }
        }

        allSubmissions.push({
          id: sub.id,
          assignmentId: sub.assignmentId,
          studentName: studentName || '이름 없음',
          submittedAt: sub.submittedAt ? toKSTISOString(sub.submittedAt) : null,
          status: sub.status,
          score: sub.score,
          feedback: sub.feedback,
          files: sub.files,
          assignmentTitle: assignment.title,
        });
      }
    }

    return allSubmissions;
  }

  // 점수 및 피드백 업데이트
  async updateSubmissionScore(submissionId: number, score: number, feedback?: string) {
    const submission = await this.submissionRepository.findOne({ where: { id: submissionId } });
    if (!submission) {
      throw new Error('제출물을 찾을 수 없습니다.');
    }

    submission.score = score;
    if (feedback !== undefined) {
      submission.feedback = feedback;
    }

    return this.submissionRepository.save(submission);
  }

  // 제출물 삭제
  async deleteSubmission(submissionId: number) {
    const submission = await this.submissionRepository.findOne({ where: { id: submissionId } });
    if (!submission) {
      throw new Error('제출물을 찾을 수 없습니다.');
    }

    // 파일 삭제 (있는 경우) - UploadService 사용 (환경변수 기반 경로 처리)
    if (submission.files && Array.isArray(submission.files)) {
      const uploadService = await getUploadService();

      for (const file of submission.files) {
        if (file.url) {
          try {
            await uploadService.deleteFile(file.url);
            console.log(`✅ 과제 제출 파일 삭제: ${file.url}`);
          } catch (error) {
            console.error(`❌ 과제 제출 파일 삭제 실패: ${file.url}`, error);
          }
        }
      }
    }

    // DB에서 제출물 삭제
    await this.submissionRepository.remove(submission);
  }

  // 과제 제출
  async submitAssignment(courseId: number, assignmentId: number, userId: number, files: Express.Multer.File[], originalNames?: string[]) {
    console.log('과제 제출 서비스 호출:', { courseId, assignmentId, userId, filesCount: files.length });

    // 과제 존재 확인
    const assignment = await this.assignmentRepository.findOne({ where: { id: assignmentId, courseId } });
    if (!assignment) {
      throw new Error('과제를 찾을 수 없습니다.');
    }

    // 기존 제출물 확인 (중복 제출 방지 - 필요시 주석 해제)
    // const existingSubmission = await this.submissionRepository.findOne({
    //   where: { assignmentId, userId },
    // });
    // if (existingSubmission) {
    //   throw new Error('이미 제출한 과제입니다.');
    // }

    // 마감일 확인 (KST 기준)
    const now = getKSTDate();
    const dueDate = new Date(assignment.dueDate);
    // dueDate를 KST 기준으로 비교하기 위해 시간대 조정
    const dueDateKST = new Date(dueDate.getTime() + (9 * 60 * 60 * 1000));
    const status = now > dueDateKST ? '지연' : '제출';

    // 파일 정보 저장 (원본 파일명 유지)
    const fileInfos = files.map((file, index) => {
      // 원본 파일명 사용 (한글 인코딩 문제 해결)
      let originalName = originalNames && originalNames[index] ? originalNames[index] : file.originalname;

      // 한글 파일명 디코딩 시도
      try {
        // multer가 latin1로 인코딩한 경우 utf8로 디코딩
        if (originalName !== file.originalname) {
          // 이미 디코딩된 파일명 사용
        } else {
          // Buffer를 사용하여 한글 파일명 디코딩 시도
          const decoded = Buffer.from(file.originalname, 'latin1').toString('utf8');
          if (decoded && decoded !== file.originalname) {
            originalName = decoded;
          }
        }
      } catch (error) {
        // 디코딩 실패 시 원본 사용
        console.error('파일명 디코딩 실패:', error);
      }

      // 환경변수 기반 경로 사용
      const uploadPathAssignment = process.env.UPLOAD_PATH_ASSIGNMENT || 'assignments';
      return {
        name: originalName,
        size: file.size,
        url: `/${uploadPathAssignment}/${file.filename}`,
      };
    });

    // 사용자 이름 가져오기 (제출 시 저장)
    let studentName = null;
    try {
      const user = await this.usersService.findOne(userId);
      if (user) {
        studentName = user.name;
        console.log('제출자 이름 조회 성공:', studentName);
      } else {
        console.error('사용자를 찾을 수 없음:', userId);
      }
    } catch (error) {
      console.error('사용자 이름 조회 실패:', error);
    }

              // 제출물 생성 (KST 기준 시간 저장)
              const submission = this.submissionRepository.create({
                assignmentId,
                userId,
                studentName: studentName, // userId가 있으면 users 테이블에서 가져온 이름 저장
                submittedAt: getKSTDate(), // KST 기준 시간 저장
                status,
                files: fileInfos,
              });

    const saved = await this.submissionRepository.save(submission);
    console.log('제출물 저장 완료:', { id: saved.id, userId: saved.userId, studentName: saved.studentName });

    return {
      id: saved.id,
      assignmentId: saved.assignmentId,
      userId: saved.userId,
      studentName: saved.studentName,
      submittedAt: saved.submittedAt ? toKSTISOString(saved.submittedAt) : null,
      status: saved.status,
      files: saved.files,
    };
  }

  // 시드 데이터 생성 (개발용)
  async seedData(courseId: number) {
    const existing = await this.assignmentRepository.findOne({ where: { courseId } });
    if (existing) {
      return { message: '이미 과제 데이터가 존재합니다.', assignments: await this.findAllByCourse(courseId) };
    }

    const assignments = [
      {
        courseId,
        title: '과제 1: 소개 글 작성',
        description: '자기 소개와 본 과정에서의 목표를 300자 이상 작성하세요.',
        dueDate: new Date('2025-11-10'),
        maxScore: 100,
        instructions: ['PDF 또는 MD 파일 제출', '마감 시간 이후 제출은 지연 처리'],
      },
      {
        courseId,
        title: '과제 2: 1주차 퀴즈 해설',
        description: '틀린 문제를 3개 이상 선택해 해설 작성 후 제출하세요.',
        dueDate: new Date('2025-11-17'),
        maxScore: 50,
        instructions: ['문항 번호와 해설을 명확히 구분', '인용은 출처 표기'],
      },
      {
        courseId,
        title: '과제 3: 프로젝트 기획서',
        description: '팀 프로젝트 주제와 범위를 정의하고 일정/역할을 포함하세요.',
        dueDate: new Date('2025-10-25'),
        maxScore: 100,
        instructions: ['템플릿 준수', 'PDF 제출'],
      },
    ];

    const createdAssignments = [];
    for (const assignmentData of assignments) {
      const assignment = this.assignmentRepository.create(assignmentData);
      const saved = await this.assignmentRepository.save(assignment);

      // 각 과제에 대한 제출물 시드 데이터
      const submissions = [
        {
          assignmentId: saved.id,
          studentName: '홍길동',
          submittedAt: new Date('2025-11-08T14:22:00'),
          status: '제출' as const,
          score: 92,
          files: [{ name: 'assignment1_hong.pdf', size: 2458000, url: '/files/submission1.pdf' }],
          feedback: '좋은 내용입니다.',
        },
        {
          assignmentId: saved.id,
          studentName: '김철수',
          submittedAt: new Date('2025-11-09T16:30:00'),
          status: '제출' as const,
          score: 88,
          files: [{ name: 'assignment1_kim.md', size: 1520000, url: '/files/submission2.md' }],
        },
        {
          assignmentId: saved.id,
          studentName: '이영희',
          submittedAt: new Date('2025-11-10T23:45:00'),
          status: '지연' as const,
          score: 75,
          files: [{ name: 'assignment1_lee.zip', size: 3200000, url: '/files/submission3.zip' }],
          feedback: '마감 시간 이후 제출로 인해 감점 처리되었습니다.',
        },
      ];

      for (const submissionData of submissions) {
        const submission = this.submissionRepository.create(submissionData);
        await this.submissionRepository.save(submission);
      }

      createdAssignments.push(saved);
    }

    return {
      message: '과제 데이터가 성공적으로 생성되었습니다.',
      assignments: await this.findAllByCourse(courseId),
    };
  }
}

