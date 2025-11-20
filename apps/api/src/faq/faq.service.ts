import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FAQ } from './entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FAQ)
    private faqRepository: Repository<FAQ>,
  ) {}

  async findAll(targetRole?: string): Promise<FAQ[]> {
    try {
      const query = this.faqRepository.createQueryBuilder('faq');

      if (targetRole) {
        query.where('faq.target_role = :targetRole OR faq.target_role = :all', {
          targetRole,
          all: 'all',
        });
      }

      return await query
        .orderBy('faq."order"', 'ASC')
        .addOrderBy('faq.created_at', 'DESC')
        .getMany();
    } catch (error) {
      console.error('FAQ findAll error:', error);
      // 테이블이 없거나 컬럼명이 다를 수 있으므로 빈 배열 반환
      return [];
    }
  }

  async findOne(id: number): Promise<FAQ> {
    return await this.faqRepository.findOne({ where: { id } });
  }

  async create(faqData: Partial<FAQ>): Promise<FAQ> {
    const faq = this.faqRepository.create(faqData);
    return await this.faqRepository.save(faq);
  }

  async update(id: number, faqData: Partial<FAQ>): Promise<FAQ> {
    const faq = await this.findOne(id);
    Object.assign(faq, faqData);
    return await this.faqRepository.save(faq);
  }

  async remove(id: number): Promise<void> {
    const faq = await this.findOne(id);
    await this.faqRepository.remove(faq);
  }
}

