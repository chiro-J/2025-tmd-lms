import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MemosService } from './memos.service';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('memos')
@UseGuards(JwtAuthGuard)
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  /**
   * Get all memos for the authenticated user
   * GET /memos
   */
  @Get()
  async getUserMemos(@Request() req) {
    const userId = req.user?.userId || req.user?.id;
    const memos = await this.memosService.getUserMemos(userId);

    return {
      success: true,
      data: memos,
      message: '메모를 성공적으로 조회했습니다.',
    };
  }

  /**
   * Get memos for a specific date
   * GET /memos/date/:date
   */
  @Get('date/:date')
  async getMemosForDate(@Request() req, @Param('date') date: string) {
    const userId = req.user?.userId || req.user?.id;
    const memos = await this.memosService.getMemosForDate(userId, date);

    return {
      success: true,
      data: memos,
      message: `${date} 날짜의 메모를 성공적으로 조회했습니다.`,
    };
  }

  /**
   * Get memos for a specific month
   * GET /memos/month/:yearMonth (e.g., 2025-11)
   */
  @Get('month/:yearMonth')
  async getMemosForMonth(@Request() req, @Param('yearMonth') yearMonth: string) {
    const userId = req.user?.userId || req.user?.id;
    const memos = await this.memosService.getMemosForMonth(userId, yearMonth);

    return {
      success: true,
      data: memos,
      message: `${yearMonth} 월의 메모를 성공적으로 조회했습니다.`,
    };
  }

  /**
   * Get a single memo by ID
   * GET /memos/:id
   */
  @Get(':id')
  async getMemoById(@Request() req, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.id;
    const memo = await this.memosService.getMemoById(userId, +id);

    return {
      success: true,
      data: memo,
      message: '메모를 성공적으로 조회했습니다.',
    };
  }

  /**
   * Create a new memo
   * POST /memos
   */
  @Post()
  async createMemo(@Request() req, @Body() createMemoDto: CreateMemoDto) {
    const userId = req.user?.userId || req.user?.id;
    const memo = await this.memosService.createMemo(userId, createMemoDto);

    return {
      success: true,
      data: memo,
      message: '메모를 성공적으로 생성했습니다.',
    };
  }

  /**
   * Update a memo
   * PUT /memos/:id
   */
  @Put(':id')
  async updateMemo(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMemoDto: UpdateMemoDto,
  ) {
    const userId = req.user?.userId || req.user?.id;
    const memo = await this.memosService.updateMemo(userId, +id, updateMemoDto);

    return {
      success: true,
      data: memo,
      message: '메모를 성공적으로 수정했습니다.',
    };
  }

  /**
   * Delete a memo
   * DELETE /memos/:id
   */
  @Delete(':id')
  async deleteMemo(@Request() req, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.id;
    await this.memosService.deleteMemo(userId, +id);

    return {
      success: true,
      message: '메모를 성공적으로 삭제했습니다.',
    };
  }
}






