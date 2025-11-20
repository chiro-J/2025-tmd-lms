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
  } catch (error) {
    console.error('시험 목록 조회 실패:', error);
    throw error;
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
  } catch (error) {
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

