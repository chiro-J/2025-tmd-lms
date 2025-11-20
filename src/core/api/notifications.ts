import apiClient from './client';
import type { Notification } from '../../types';

/**
 * 사용자 알림 목록 조회
 * GET /api/notifications
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await apiClient.get<any[]>('/notifications');
    return response.data.map((notif: any) => ({
      id: notif.id,
      type: notif.type as Notification['type'],
      title: notif.title,
      message: notif.message,
      createdAt: notif.createdAt,
      read: notif.read,
      link: notif.link,
      courseId: notif.courseId,
      courseTitle: notif.course?.title || undefined,
    }));
  } catch (error: any) {
    // 500 에러나 테이블이 없는 경우 빈 배열 반환 (에러 로깅은 서버에서만)
    if (error.response?.status === 500 || error.response?.status === 404) {
      return [];
    }
    // 다른 에러는 로깅하지 않고 빈 배열 반환
    return [];
  }
};

/**
 * 읽지 않은 알림 개수 조회
 * GET /api/notifications/unread-count
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  } catch (error: any) {
    // 500 에러나 테이블이 없는 경우 0 반환 (에러 로깅은 서버에서만)
    if (error.response?.status === 500 || error.response?.status === 404) {
      return 0;
    }
    // 다른 에러도 0 반환
    return 0;
  }
};

/**
 * 알림 읽음 처리
 * PUT /api/notifications/:id/read
 */
export const markNotificationAsRead = async (id: number): Promise<Notification> => {
  try {
    const response = await apiClient.put<Notification>(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
    throw error;
  }
};

/**
 * 모든 알림 읽음 처리
 * PUT /api/notifications/read-all
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await apiClient.put('/notifications/read-all');
  } catch (error) {
    console.error('모든 알림 읽음 처리 실패:', error);
    throw error;
  }
};

/**
 * 알림 삭제
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/notifications/${id}`);
  } catch (error) {
    console.error('알림 삭제 실패:', error);
    throw error;
  }
};

