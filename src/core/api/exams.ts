import apiClient from './client';
import type { Exam } from '../../types/exam';

/**
 * 강좌별 시험 목록 조회
 * GET /api/courses/:courseId/exams
 */
export const getExamsByCourse = async (courseId: number): Promise<Exam[]> => {
  try {
    const response = await apiClient.get<Exam[]>(`/courses/${courseId}/exams`);
    return response.data;
  } catch (error: any) {
    // 네트워크 오류나 서버 오류는 조용히 처리
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      console.warn('시험 목록 조회 실패 (서버 연결 불가):', courseId);
      return [];
    }
    console.error('시험 목록 조회 실패:', error);
    return [];
  }
};

/**
 * 시험 상세 조회
 * GET /api/courses/:courseId/exams/:id
 */
export const getExam = async (courseId: number, examId: number): Promise<Exam> => {
  try {
    const response = await apiClient.get<Exam>(`/courses/${courseId}/exams/${examId}`);
    return response.data;
  } catch (error: any) {
    // 네트워크 오류나 서버 오류는 조용히 처리
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      console.warn('시험 조회 실패 (서버 연결 불가):', { courseId, examId });
      throw error;
    }
    console.error('시험 조회 실패:', error);
    throw error;
  }
};

/**
 * 시험 생성
 * POST /api/courses/:courseId/exams
 */
export const createExam = async (courseId: number, data: Partial<Exam>): Promise<Exam> => {
  try {
    const response = await apiClient.post<Exam>(`/courses/${courseId}/exams`, data);
    return response.data;
  } catch (error) {
    console.error('시험 생성 실패:', error);
    throw error;
  }
};

/**
 * 시험 수정
 * PUT /api/courses/:courseId/exams/:id
 */
export const updateExam = async (courseId: number, examId: number, data: Partial<Exam>): Promise<Exam> => {
  try {
    const response = await apiClient.put<Exam>(`/courses/${courseId}/exams/${examId}`, data);
    return response.data;
  } catch (error) {
    console.error('시험 수정 실패:', error);
    throw error;
  }
};

/**
 * 시험 삭제
 * DELETE /api/courses/:courseId/exams/:id
 */
export const deleteExam = async (courseId: number, examId: number): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/exams/${examId}`);
  } catch (error) {
    console.error('시험 삭제 실패:', error);
    throw error;
  }
};

/**
 * 시험 답안 제출
 * POST /api/courses/:courseId/exams/:id/submit
 */
export const submitExam = async (
  courseId: number,
  examId: number,
  answers: Record<string, any>,
  timeSpent: number,
): Promise<any> => {
  try {
    const response = await apiClient.post<any>(`/courses/${courseId}/exams/${examId}/submit`, {
      answers,
      timeSpent,
    });
    return response.data;
  } catch (error: any) {
    // 네트워크 오류나 서버 오류는 명확한 에러 메시지와 함께 throw
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      const networkError = new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
      networkError.name = 'NetworkError';
      throw networkError;
    }
    console.error('시험 제출 실패:', error);
    throw error;
  }
};

/**
 * 내 시험 제출물 조회
 * GET /api/courses/:courseId/exams/:id/my-submission
 */
export const getMyExamSubmission = async (courseId: number, examId: number): Promise<any | null> => {
  try {
    const response = await apiClient.get<any>(`/courses/${courseId}/exams/${examId}/my-submission`);
    return response.data;
  } catch (error: any) {
    // 401 (인증 실패) 또는 404 (제출물 없음)는 정상적인 경우이므로 조용히 처리
    if (error.response?.status === 401 || error.response?.status === 404) {
      return null;
    }
    // 네트워크 오류나 서버 오류는 조용히 처리
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      return null;
    }
    // 다른 에러는 로그만 출력하고 null 반환
    if (error.response?.status !== 401 && error.response?.status !== 404) {
      console.error('시험 제출물 조회 실패:', error);
    }
    return null;
  }
};

