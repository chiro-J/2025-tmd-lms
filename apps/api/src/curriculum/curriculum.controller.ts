import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CurriculumModule } from './entities/curriculum.entity';
import { Lesson } from './entities/lesson.entity';

@Controller('courses/:courseId/curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get()
  async findAll(@Param('courseId') courseId: string): Promise<CurriculumModule[]> {
    return this.curriculumService.findAllByCourse(+courseId);
  }

  @Post('seed')
  async seedData(@Param('courseId') courseId: string): Promise<{ message: string; modules: CurriculumModule[] }> {
    return this.curriculumService.seedData(+courseId);
  }

  @Post()
  async create(@Param('courseId') courseId: string, @Body() createDto: { title: string; order?: number }): Promise<CurriculumModule> {
    return this.curriculumService.create(+courseId, createDto);
  }

  @Post(':curriculumId/lessons')
  async createLesson(
    @Param('curriculumId') curriculumId: string,
    @Body() createDto: { title: string; description?: string; order?: number }
  ): Promise<Lesson> {
    return this.curriculumService.createLesson(+curriculumId, createDto);
  }

  @Get(':curriculumId/lessons/:lessonId')
  async getLesson(
    @Param('courseId') courseId: string,
    @Param('curriculumId') curriculumId: string,
    @Param('lessonId') lessonId: string
  ): Promise<Lesson> {
    return this.curriculumService.findOneLesson(+lessonId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: { title?: string; order?: number }): Promise<CurriculumModule> {
    return this.curriculumService.update(+id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.curriculumService.remove(+id);
  }

  @Put(':curriculumId/lessons/:lessonId')
  async updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() updateDto: { title?: string; description?: string }
  ): Promise<Lesson> {
    return this.curriculumService.updateLesson(+lessonId, updateDto);
  }

  @Delete(':curriculumId/lessons/:lessonId')
  async removeLesson(@Param('lessonId') lessonId: string): Promise<void> {
    return this.curriculumService.removeLesson(+lessonId);
  }
}

