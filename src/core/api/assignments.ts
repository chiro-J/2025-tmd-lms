import apiClient from './client';
import type { Assignment, AssignmentSubmission } from '../../types/assignment';

/**
 * 강좌별 과제 목록 조회
 * GET /api/courses/:courseId/assignments
 */
export const getAssignments = async (courseId: number): Promise<Assignment[]> => {
  try {
    const response = await apiClient.get<Assignment[]>(`/courses/${courseId}/assignments`);
    return response.data;
  } catch (error) {
    console.error('과제 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 과제 상세 조회
 * GET /api/courses/:courseId/assignments/:id
 */
export const getAssignment = async (courseId: number, assignmentId: number): Promise<Assignment> => {
  try {
    const response = await apiClient.get<Assignment>(`/courses/${courseId}/assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    console.error('과제 조회 실패:', error);
    throw error;
  }
};

/**
 * 과제 생성
 * POST /api/courses/:courseId/assignments
 */
export const createAssignment = async (
  courseId: number,
  data: {
    title: string;
    description?: string;
    dueDate: string;
    maxScore?: number;
    instructions?: string[];
    allowedFileTypes?: string[];
    maxFileSize?: number;
  }
): Promise<Assignment> => {
  try {
    const response = await apiClient.post<Assignment>(`/courses/${courseId}/assignments`, data);
    return response.data;
  } catch (error) {
    console.error('과제 생성 실패:', error);
    throw error;
  }
};

/**
 * 과제 수정
 * PUT /api/courses/:courseId/assignments/:id
 */
export const updateAssignment = async (
  courseId: number,
  assignmentId: number,
  data: {
    title?: string;
    description?: string;
    dueDate?: string;
    maxScore?: number;
    instructions?: string[];
    allowedFileTypes?: string[];
    maxFileSize?: number;
    contentBlocks?: any[];
  }
): Promise<Assignment> => {
  try {
    const response = await apiClient.put<Assignment>(`/courses/${courseId}/assignments/${assignmentId}`, data);
    return response.data;
  } catch (error) {
    console.error('과제 수정 실패:', error);
    throw error;
  }
};

/**
 * 과제 삭제
 * DELETE /api/courses/:courseId/assignments/:id
 */
export const deleteAssignment = async (courseId: number, assignmentId: number): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/assignments/${assignmentId}`);
  } catch (error) {
    console.error('과제 삭제 실패:', error);
    throw error;
  }
};

/**
 * 과제별 제출물 조회
 * GET /api/courses/:courseId/assignments/:assignmentId/submissions
 */
export const getSubmissionsByAssignment = async (
  courseId: number,
  assignmentId: number
): Promise<AssignmentSubmission[]> => {
  try {
    const response = await apiClient.get<AssignmentSubmission[]>(
      `/courses/${courseId}/assignments/${assignmentId}/submissions`
    );
    return response.data;
  } catch (error) {
    console.error('제출물 조회 실패:', error);
    throw error;
  }
};

/**
 * 강좌의 모든 제출물 조회 (제출물 조회 페이지용)
 * GET /api/courses/:courseId/assignment-submissions
 */
export const getAllSubmissionsByCourse = async (
  courseId: number
): Promise<(AssignmentSubmission & { assignmentTitle: string })[]> => {
  try {
    const response = await apiClient.get<(AssignmentSubmission & { assignmentTitle: string })[]>(
      `/courses/${courseId}/assignment-submissions`
    );
    return response.data;
  } catch (error) {
    console.error('전체 제출물 조회 실패:', error);
    throw error;
  }
};

/**
 * 제출물 점수 및 피드백 업데이트
 * PUT /api/courses/:courseId/assignment-submissions/:submissionId/score
 */
export const updateSubmissionScore = async (
  courseId: number,
  submissionId: number,
  data: { score: number; feedback?: string }
): Promise<AssignmentSubmission> => {
  try {
    const response = await apiClient.put<AssignmentSubmission>(
      `/courses/${courseId}/assignment-submissions/${submissionId}/score`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('제출물 점수 업데이트 실패:', error);
    throw error;
  }
};

/**
 * 시드 데이터 생성 (개발용)
 * POST /api/courses/:courseId/assignments/seed
 */
export const seedAssignments = async (courseId: number): Promise<{ message: string; assignments: Assignment[] }> => {
  try {
    const response = await apiClient.post<{ message: string; assignments: Assignment[] }>(
      `/courses/${courseId}/assignments/seed`
    );
    return response.data;
  } catch (error) {
    console.error('시드 데이터 생성 실패:', error);
    throw error;
  }
};

