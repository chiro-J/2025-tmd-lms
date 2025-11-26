import { Controller, Get, Put, Param, ParseIntPipe, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  async getProfile(@Param('id', ParseIntPipe) id: number, @Request() req) {
    try {
      // 본인 프로필만 조회 가능하도록 검증
      const userId = req.user?.userId || req.user?.sub || req.user?.id;
      if (userId !== id) {
        throw new ForbiddenException('You can only access your own profile');
      }
      return await this.usersService.getProfile(id);
    } catch (error) {
      console.error('getProfile controller error:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/profile')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
    @Request() req
  ) {
    try {
      // 본인 프로필만 수정 가능하도록 검증
      const userId = req.user?.userId || req.user?.sub || req.user?.id;
      if (userId !== id) {
        throw new ForbiddenException('You can only update your own profile');
      }
      return await this.usersService.updateProfile(id, data);
    } catch (error) {
      console.error('updateProfile controller error:', error);
      throw error;
    }
  }
}

