import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Memo } from './entities/memo.entity';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';

@Injectable()
export class MemosService {
  constructor(
    @InjectRepository(Memo)
    private readonly memosRepository: Repository<Memo>,
  ) {}

  /**
   * Get all memos for a user
   */
  async getUserMemos(userId: number): Promise<Memo[]> {
    return this.memosRepository.find({
      where: { userId },
      order: { memoDate: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Get memos for a specific date
   */
  async getMemosForDate(userId: number, date: string): Promise<Memo[]> {
    return this.memosRepository.find({
      where: { userId, memoDate: date },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get memos for a specific month (YYYY-MM format)
   */
  async getMemosForMonth(userId: number, yearMonth: string): Promise<Memo[]> {
    // Parse YYYY-MM format
    const [year, month] = yearMonth.split('-').map(Number);

    // Calculate start and end dates of the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    return this.memosRepository.find({
      where: {
        userId,
        memoDate: Between(startDateStr, endDateStr),
      },
      order: { memoDate: 'ASC', createdAt: 'DESC' },
    });
  }

  /**
   * Create a new memo
   */
  async createMemo(userId: number, createMemoDto: CreateMemoDto): Promise<Memo> {
    const memo = this.memosRepository.create({
      userId,
      ...createMemoDto,
      color: createMemoDto.color || '#3B82F6',
    });

    return this.memosRepository.save(memo);
  }

  /**
   * Update a memo
   */
  async updateMemo(
    userId: number,
    memoId: number,
    updateMemoDto: UpdateMemoDto,
  ): Promise<Memo> {
    const memo = await this.memosRepository.findOne({
      where: { id: memoId },
    });

    if (!memo) {
      throw new NotFoundException(`Memo with ID ${memoId} not found`);
    }

    // Check if the user owns this memo
    if (memo.userId !== userId) {
      throw new ForbiddenException('You can only update your own memos');
    }

    // Update memo fields
    Object.assign(memo, updateMemoDto);

    return this.memosRepository.save(memo);
  }

  /**
   * Delete a memo
   */
  async deleteMemo(userId: number, memoId: number): Promise<void> {
    const memo = await this.memosRepository.findOne({
      where: { id: memoId },
    });

    if (!memo) {
      throw new NotFoundException(`Memo with ID ${memoId} not found`);
    }

    // Check if the user owns this memo
    if (memo.userId !== userId) {
      throw new ForbiddenException('You can only delete your own memos');
    }

    await this.memosRepository.remove(memo);
  }

  /**
   * Get a single memo by ID
   */
  async getMemoById(userId: number, memoId: number): Promise<Memo> {
    const memo = await this.memosRepository.findOne({
      where: { id: memoId },
    });

    if (!memo) {
      throw new NotFoundException(`Memo with ID ${memoId} not found`);
    }

    // Check if the user owns this memo
    if (memo.userId !== userId) {
      throw new ForbiddenException('You can only view your own memos');
    }

    return memo;
  }
}









