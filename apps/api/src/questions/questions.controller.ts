import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async findAll(@Query('courseId') courseId?: number) {
    return this.questionsService.findAll(courseId ? Number(courseId) : undefined);
  }

  @Get('exams-info/:courseId')
  async getExamsInfo(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.questionsService.getExamsInfo(courseId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.findOne(id);
  }

  @Post()
  async create(@Body() createQuestionDto: Partial<Question>) {
    return this.questionsService.create(createQuestionDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: Partial<Question>,
  ) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.questionsService.remove(id);
    return { message: '문제가 삭제되었습니다.' };
  }
}

