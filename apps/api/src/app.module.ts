import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { CourseNotice } from './courses/entities/course-notice.entity';
import { CourseResource } from './courses/entities/course-resource.entity';
import { CourseEnrollment } from './courses/entities/course-enrollment.entity';
import { CourseQnA } from './courses/entities/course-qna.entity';
import { CourseQnAAnswer } from './courses/entities/course-qna-answer.entity';
import { CurriculumModule } from './curriculum/curriculum.module';
import { CurriculumModule as CurriculumModuleEntity } from './curriculum/entities/curriculum.entity';
import { Lesson } from './curriculum/entities/lesson.entity';
import { AssignmentsModule } from './assignments/assignments.module';
import { Assignment } from './assignments/entities/assignment.entity';
import { AssignmentSubmission } from './assignments/entities/assignment-submission.entity';
import { AdminModule } from './admin/admin.module';
import { SubAdmin } from './admin/entities/sub-admin.entity';
import { Instructor } from './admin/entities/instructor.entity';
import { Student } from './admin/entities/student.entity';
import { Notice } from './admin/entities/notice.entity';
import { SystemSettings } from './admin/entities/system-settings.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { UploadModule } from './upload/upload.module';
import { ExamsModule } from './exams/exams.module';
import { Exam } from './exams/entities/exam.entity';
import { ExamSubmission } from './exams/entities/exam-submission.entity';
import { QuestionsModule } from './questions/questions.module';
import { Question } from './questions/entities/question.entity';
import { FaqModule } from './faq/faq.module';
import { FAQ } from './faq/entities/faq.entity';
import { Inquiry } from './admin/entities/inquiry.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/entities/notification.entity';
import { LearningProgressModule } from './learning-progress/learning-progress.module';
import { LearningProgress } from './learning-progress/entities/learning-progress.entity';
import { MemosModule } from './memos/memos.module';
import { Memo } from './memos/entities/memo.entity';
import { LearningSessionsModule } from './learning-sessions/learning-sessions.module';
import { UserSession } from './learning-sessions/entities/user-session.entity';
import { DailyLearningStats } from './learning-sessions/entities/daily-learning-stats.entity';

// .env 파일 로드 (모듈 로드 전에 실행 - TypeORM 설정 시 환경 변수 필요)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// 한국 시간대(KST) 설정
process.env.TZ = 'Asia/Seoul';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'monstera',
      database: process.env.DB_DATABASE || 'lms',
      entities: [
        Course,
        CurriculumModuleEntity,
        Lesson,
        Assignment,
        AssignmentSubmission,
        SubAdmin,
        Instructor,
        Student,
        Notice,
        SystemSettings,
        User,
        CourseNotice,
        CourseResource,
        CourseEnrollment,
        CourseQnA,
        CourseQnAAnswer,
        Exam,
        ExamSubmission,
        Question,
        FAQ,
        Inquiry,
        Notification,
        LearningProgress,
        Memo,
        UserSession,
        DailyLearningStats,
      ],
      synchronize: false, // 공유 DB 사용 시 false로 설정 (스키마 수동 관리)
    }),
    CoursesModule,
    CurriculumModule,
    AssignmentsModule,
    AdminModule,
    UsersModule,
    AuthModule,
    UploadModule,
    ExamsModule,
    QuestionsModule,
    FaqModule,
    NotificationsModule,
    LearningProgressModule,
    MemosModule,
    LearningSessionsModule,
  ],
})
export class AppModule {}

