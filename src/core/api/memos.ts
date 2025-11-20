import apiClient from './client';
import type { Memo } from '../../types/calendar';

/**
 * 내 메모 목록 조회
 * GET /api/memos
 */
export const getMemos = async (): Promise<Memo[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: any[] }>('/memos');
    return response.data.data.map(memo => ({
      id: memo.id.toString(),
      title: memo.title,
      content: memo.content,
      date: memo.memoDate, // Backend uses memoDate
      color: memo.color,
      createdAt: new Date(memo.createdAt),
      updatedAt: new Date(memo.updatedAt),
    }));
  } catch (error) {
    console.error('메모 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 날짜의 메모 조회
 * GET /api/memos/date/:date
 */
export const getMemosForDate = async (date: string): Promise<Memo[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(`/memos/date/${date}`);
    return response.data.data.map(memo => ({
      id: memo.id.toString(),
      title: memo.title,
      content: memo.content,
      date: memo.memoDate,
      color: memo.color,
      createdAt: new Date(memo.createdAt),
      updatedAt: new Date(memo.updatedAt),
    }));
  } catch (error) {
    console.error('날짜별 메모 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 월의 메모 조회
 * GET /api/memos/month/:yearMonth
 */
export const getMemosForMonth = async (yearMonth: string): Promise<Memo[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(`/memos/month/${yearMonth}`);
    return response.data.data.map(memo => ({
      id: memo.id.toString(),
      title: memo.title,
      content: memo.content,
      date: memo.memoDate,
      color: memo.color,
      createdAt: new Date(memo.createdAt),
      updatedAt: new Date(memo.updatedAt),
    }));
  } catch (error) {
    console.error('월별 메모 조회 실패:', error);
    throw error;
  }
};

/**
 * 메모 상세 조회
 * GET /api/memos/:id
 */
export const getMemo = async (id: number): Promise<Memo> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: any }>(`/memos/${id}`);
    const memo = response.data.data;
    return {
      id: memo.id.toString(),
      title: memo.title,
      content: memo.content,
      date: memo.memoDate,
      color: memo.color,
      createdAt: new Date(memo.createdAt),
      updatedAt: new Date(memo.updatedAt),
    };
  } catch (error) {
    console.error('메모 조회 실패:', error);
    throw error;
  }
};

/**
 * 메모 생성
 * POST /api/memos
 */
export const createMemo = async (data: {
  title: string;
  content: string;
  memoDate: string;
  color?: string;
}): Promise<Memo> => {
  try {
    const response = await apiClient.post<{ success: boolean; data: any }>('/memos', data);
    const memo = response.data.data;
    return {
      id: memo.id.toString(),
      title: memo.title,
      content: memo.content,
      date: memo.memoDate,
      color: memo.color,
      createdAt: new Date(memo.createdAt),
      updatedAt: new Date(memo.updatedAt),
    };
  } catch (error) {
    console.error('메모 생성 실패:', error);
    throw error;
  }
};

/**
 * 메모 수정
 * PUT /api/memos/:id
 */
export const updateMemo = async (
  id: number,
  data: {
    title?: string;
    content?: string;
    memoDate?: string;
    color?: string;
  }
): Promise<Memo> => {
  try {
    const response = await apiClient.put<{ success: boolean; data: any }>(`/memos/${id}`, data);
    const memo = response.data.data;
    return {
      id: memo.id.toString(),
      title: memo.title,
      content: memo.content,
      date: memo.memoDate,
      color: memo.color,
      createdAt: new Date(memo.createdAt),
      updatedAt: new Date(memo.updatedAt),
    };
  } catch (error) {
    console.error('메모 수정 실패:', error);
    throw error;
  }
};

/**
 * 메모 삭제
 * DELETE /api/memos/:id
 */
export const deleteMemo = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/memos/${id}`);
  } catch (error) {
    console.error('메모 삭제 실패:', error);
    throw error;
  }
};






