import apiClient from './client';
import type { FAQItem } from '../../types';

/**
 * FAQ 목록 조회
 * GET /api/faq?targetRole=:targetRole
 */
export const getFAQ = async (targetRole?: 'student' | 'instructor'): Promise<FAQItem[]> => {
  try {
    const params = targetRole ? { targetRole } : {};
    const response = await apiClient.get<FAQItem[]>('/faq', { params });
    // 백엔드에서 이미 변환된 형식으로 반환되므로 그대로 사용
    return response.data;
  } catch (error) {
    console.error('FAQ 조회 실패:', error);
    throw error;
  }
};

/**
 * FAQ 상세 조회
 * GET /api/faq/:id
 */
export const getFAQItem = async (id: number): Promise<FAQItem> => {
  try {
    const response = await apiClient.get<FAQItem>(`/faq/${id}`);
    // 백엔드에서 이미 변환된 형식으로 반환되므로 그대로 사용
    return response.data;
  } catch (error) {
    console.error('FAQ 조회 실패:', error);
    throw error;
  }
};

