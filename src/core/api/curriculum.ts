import apiClient from './client';

export interface CurriculumModule {
  id: number;
  courseId: number;
  title: string;
  order: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  curriculumModuleId: number;
  title: string;
  description: string;
  order: number;
}

/**
 * 강좌 커리큘럼 목록 조회
 * GET /api/courses/:courseId/curriculum
 */
export const getCurriculum = async (courseId: number): Promise<CurriculumModule[]> => {
  try {
    const response = await apiClient.get<CurriculumModule[]>(`/courses/${courseId}/curriculum`);
    return response.data;
  } catch (error) {
    console.error('커리큘럼 조회 실패:', error);
    throw error;
  }
};

/**
 * 강좌 커리큘럼 시드 데이터 생성
 * POST /api/courses/:courseId/curriculum/seed
 */
export const seedCurriculum = async (courseId: number): Promise<{ message: string; modules: CurriculumModule[] }> => {
  try {
    const response = await apiClient.post<{ message: string; modules: CurriculumModule[] }>(`/courses/${courseId}/curriculum/seed`);
    return response.data;
  } catch (error) {
    console.error('커리큘럼 시드 데이터 생성 실패:', error);
    throw error;
  }
};

/**
 * 커리큘럼 모듈 생성
 * POST /api/courses/:courseId/curriculum
 */
export const createCurriculum = async (courseId: number, data: { title: string; order?: number }): Promise<CurriculumModule> => {
  try {
    const response = await apiClient.post<CurriculumModule>(`/courses/${courseId}/curriculum`, data);
    return response.data;
  } catch (error) {
    console.error('커리큘럼 생성 실패:', error);
    throw error;
  }
};

/**
 * 커리큘럼 모듈 수정
 * PUT /api/courses/:courseId/curriculum/:id
 */
export const updateCurriculum = async (courseId: number, id: number, data: { title?: string; order?: number }): Promise<CurriculumModule> => {
  try {
    const response = await apiClient.put<CurriculumModule>(`/courses/${courseId}/curriculum/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('커리큘럼 수정 실패:', error);
    throw error;
  }
};

/**
 * 커리큘럼 모듈 삭제
 * DELETE /api/courses/:courseId/curriculum/:id
 */
export const deleteCurriculum = async (courseId: number, id: number): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/curriculum/${id}`);
  } catch (error) {
    console.error('커리큘럼 삭제 실패:', error);
    throw error;
  }
};

/**
 * 레슨 생성
 * POST /api/courses/:courseId/curriculum/:curriculumId/lessons
 */
export const createLesson = async (courseId: number, curriculumId: number, data: { title: string; description?: string; order?: number }): Promise<Lesson> => {
  try {
    const response = await apiClient.post<Lesson>(`/courses/${courseId}/curriculum/${curriculumId}/lessons`, data);
    return response.data;
  } catch (error) {
    console.error('레슨 생성 실패:', error);
    throw error;
  }
};

/**
 * 레슨 수정
 * PUT /api/courses/:courseId/curriculum/:curriculumId/lessons/:lessonId
 */
export const updateLesson = async (courseId: number, curriculumId: number, lessonId: number, data: { title?: string; description?: string }): Promise<Lesson> => {
  try {
    const response = await apiClient.put<Lesson>(`/courses/${courseId}/curriculum/${curriculumId}/lessons/${lessonId}`, data);
    return response.data;
  } catch (error) {
    console.error('레슨 수정 실패:', error);
    throw error;
  }
};

/**
 * 레슨 삭제
 * DELETE /api/courses/:courseId/curriculum/:curriculumId/lessons/:lessonId
 */
export const deleteLesson = async (courseId: number, curriculumId: number, lessonId: number): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/curriculum/${curriculumId}/lessons/${lessonId}`);
  } catch (error) {
    console.error('레슨 삭제 실패:', error);
    throw error;
  }
};

