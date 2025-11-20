import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { CurriculumModule as CurriculumModuleEntity } from './entities/curriculum.entity';
import { Lesson } from './entities/lesson.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurriculumModuleEntity, Lesson, Course])],
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}

