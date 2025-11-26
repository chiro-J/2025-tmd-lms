import apiClient from './client';
import type { QuestionData } from '../../types/question';

/**
 * 문제 목록 조회
 * GET /api/questions
 */
export const getQuestions = async (params: { courseId?: number; examId?: number } = {}): Promise<QuestionData[]> => {
  try {
    const response = await apiClient.get<any[]>('/questions', { params });
    // 백엔드 응답을 QuestionData 타입으로 변환
    return response.data.map(q => ({
      id: q.id.toString(),
      type: q.type as QuestionData['type'],
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      points: q.points,
      explanation: q.explanation || '',
      status: q.status as QuestionData['status'],
      createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: q.updatedAt ? new Date(q.updatedAt).toISOString() : new Date().toISOString(),
      usedInExams: q.examId ? [q.examId.toString()] : [],
    }));
  } catch (error) {
    console.error('문제 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 문제 상세 조회
 * GET /api/questions/:id
 */
export const getQuestion = async (id: number): Promise<QuestionData> => {
  try {
    const response = await apiClient.get<any>(`/questions/${id}`);
    const q = response.data;
    return {
      id: q.id.toString(),
      type: q.type as QuestionData['type'],
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      points: q.points,
      explanation: q.explanation || '',
      status: q.status as QuestionData['status'],
      createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: q.updatedAt ? new Date(q.updatedAt).toISOString() : new Date().toISOString(),
      usedInExams: q.examId ? [q.examId.toString()] : [],
    };
  } catch (error) {
    console.error('문제 조회 실패:', error);
    throw error;
  }
};

/**
 * 시험 정보 조회 (문제 관리용)
 * GET /api/questions/exams-info/:courseId
 */
export const getExamsInfo = async (courseId: number): Promise<Record<string, { id: string; title: string; type: string }>> => {
  try {
    const response = await apiClient.get<Record<string, { id: string; title: string; type: string }>>(`/questions/exams-info/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('시험 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 문제 생성
 * POST /api/questions
 */
export const createQuestion = async (data: Partial<QuestionData>): Promise<QuestionData> => {
  try {
    const response = await apiClient.post<any>('/questions', data);
    const q = response.data;
    // 백엔드 응답을 QuestionData 타입으로 변환
    return {
      id: q.id.toString(),
      type: q.type as QuestionData['type'],
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      points: q.points,
      explanation: q.explanation || '',
      status: q.status as QuestionData['status'],
      createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: q.updatedAt ? new Date(q.updatedAt).toISOString() : new Date().toISOString(),
      usedInExams: q.examId ? [q.examId.toString()] : [],
    };
  } catch (error) {
    console.error('문제 생성 실패:', error);
    throw error;
  }
};

/**
 * 문제 수정
 * PUT /api/questions/:id
 */
export const updateQuestion = async (id: number, data: Partial<QuestionData>): Promise<QuestionData> => {
  try {
    const response = await apiClient.put<any>(`/questions/${id}`, data);
    const q = response.data;
    // 백엔드 응답을 QuestionData 타입으로 변환
    return {
      id: q.id.toString(),
      type: q.type as QuestionData['type'],
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      points: q.points,
      explanation: q.explanation || '',
      status: q.status as QuestionData['status'],
      createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: q.updatedAt ? new Date(q.updatedAt).toISOString() : new Date().toISOString(),
      usedInExams: q.examId ? [q.examId.toString()] : [],
    };
  } catch (error) {
    console.error('문제 수정 실패:', error);
    throw error;
  }
};

/**
 * 문제 삭제
 * DELETE /api/questions/:id
 */
export const deleteQuestion = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/questions/${id}`);
  } catch (error) {
    console.error('문제 삭제 실패:', error);
    throw error;
  }
};
