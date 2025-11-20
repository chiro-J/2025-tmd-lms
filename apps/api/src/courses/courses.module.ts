import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CourseNotice } from './entities/course-notice.entity';
import { CourseResource } from './entities/course-resource.entity';
import { CourseEnrollment } from './entities/course-enrollment.entity';
import { CourseQnA } from './entities/course-qna.entity';
import { CourseQnAAnswer } from './entities/course-qna-answer.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseNotice, CourseResource, CourseEnrollment, CourseQnA, CourseQnAAnswer, User])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}



