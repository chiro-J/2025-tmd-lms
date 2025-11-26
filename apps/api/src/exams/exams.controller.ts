import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { Exam } from './entities/exam.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  async submitExam(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { answers: Record<string, any>; timeSpent: number },
    @Request() req,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }
    return this.examsService.submitExam(id, userId, body.answers, body.timeSpent);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/my-submission')
  async getMySubmission(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }
    return this.examsService.getMySubmission(id, userId);
  }
}

