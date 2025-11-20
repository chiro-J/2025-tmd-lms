import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query, NotFoundException } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FAQ } from './entities/faq.entity';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  async findAll(@Query('targetRole') targetRole?: string) {
    try {
      const faqs = await this.faqService.findAll(targetRole);
      // 프론트엔드 호환성을 위해 FAQ 엔티티를 FAQItem 형식으로 변환
      return faqs.map(faq => ({
        id: faq.id.toString(),
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
      }));
    } catch (error) {
      console.error('FAQ controller findAll error:', error);
      // 에러 발생 시 빈 배열 반환
      return [];
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const faq = await this.faqService.findOne(id);
    if (!faq) {
      throw new NotFoundException(`FAQ를 찾을 수 없습니다 (ID: ${id})`);
    }
    // 프론트엔드 호환성을 위해 FAQ 엔티티를 FAQItem 형식으로 변환
    return {
      id: faq.id.toString(),
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    };
  }

  @Post()
  async create(@Body() createFaqDto: Partial<FAQ>) {
    return this.faqService.create(createFaqDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaqDto: Partial<FAQ>,
  ) {
    return this.faqService.update(id, updateFaqDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.faqService.remove(id);
    return { message: 'FAQ가 삭제되었습니다.' };
  }
}

