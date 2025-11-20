import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findAllByUser(userId: number): Promise<Notification[]> {
    try {
      return await this.notificationRepository.find({
        where: { userId },
        relations: ['course'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      // 테이블이 없거나 에러 발생 시 빈 배열 반환
      console.error('알림 조회 실패:', error);
      return [];
    }
  }

  async findUnreadCount(userId: number): Promise<number> {
    try {
      return await this.notificationRepository.count({
        where: { userId, read: false },
      });
    } catch (error) {
      // 테이블이 없거나 에러 발생 시 0 반환
      console.error('읽지 않은 알림 개수 조회 실패:', error);
      return 0;
    }
  }

  async markAsRead(id: number, userId: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (notification) {
      notification.read = true;
      return await this.notificationRepository.save(notification);
    }

    return notification;
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, read: false },
      { read: true },
    );
  }

  async create(notificationData: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(notificationData);
    return await this.notificationRepository.save(notification);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.notificationRepository.delete({ id, userId });
  }
}

