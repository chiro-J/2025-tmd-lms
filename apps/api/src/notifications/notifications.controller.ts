import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return [];
      }
      return this.notificationsService.findAllByUser(userId);
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
      return [];
    }
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return { count: 0 };
      }
      return { count: await this.notificationsService.findUnreadCount(userId) };
    } catch (error) {
      console.error('읽지 않은 알림 개수 조회 실패:', error);
      return { count: 0 };
    }
  }

  @Put(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    return this.notificationsService.markAsRead(id, userId);
  }

  @Put('read-all')
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    await this.notificationsService.markAllAsRead(userId);
    return { message: '모든 알림이 읽음 처리되었습니다.' };
  }

  @Post()
  async create(@Body() createNotificationDto: Partial<Notification>) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    await this.notificationsService.remove(id, userId);
    return { message: '알림이 삭제되었습니다.' };
  }
}

