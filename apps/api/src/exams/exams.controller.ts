import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { Exam } from './entities/exam.entity';

@Controller('courses/:courseId/exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  async findAll(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.examsService.findAllByCourse(courseId);
  }

  @Get(':id')
  async findOne(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.examsService.findOne(id);
  }

  @Post()
  async create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createExamDto: Partial<Exam>,
  ) {
    return this.examsService.create(courseId, createExamDto);
  }

  @Put(':id')
  async update(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamDto: Partial<Exam>,
  ) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  async remove(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.examsService.remove(id);
    return { message: '시험이 삭제되었습니다.' };
  }
}

