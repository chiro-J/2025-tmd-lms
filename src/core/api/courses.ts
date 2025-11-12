import apiClient from './client';
import type { Course } from '../../types';

/**
 * 강의 목록 조회
 * GET /api/courses
 */
export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.get<Course[]>('/courses');
    return response.data;
  } catch (error) {
    console.error('강의 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 강의 상세 조회
 * GET /api/courses/:id
 */
export const getCourse = async (id: number): Promise<Course> => {
  try {
    const response = await apiClient.get<Course>(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('강의 조회 실패:', error);
    throw error;
  }
};

/**
 * 강의 생성
 * POST /api/courses
 */
export const createCourse = async (data: Partial<Course>): Promise<Course> => {
  try {
    const response = await apiClient.post<Course>('/courses', data);
    return response.data;
  } catch (error) {
    console.error('강의 생성 실패:', error);
    throw error;
  }
};

/**
 * 강의 정보 수정
 * PUT /api/courses/:id
 */
export const updateCourse = async (id: number, data: Partial<Course>): Promise<Course> => {
  try {
    const response = await apiClient.put<Course>(`/courses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('강의 수정 실패:', error);
    throw error;
  }
};

/**
 * 수강코드로 강좌 조회
 * GET /api/courses/enroll/:code
 */
export const getCourseByEnrollmentCode = async (code: string): Promise<Course> => {
  try {
    const response = await apiClient.get<Course>(`/courses/enroll/${code}`);
    return response.data;
  } catch (error) {
    console.error('수강코드로 강좌 조회 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 공지사항 조회
 * GET /api/courses/:id/notices
 */
export interface CourseNotice {
  id: number;
  courseId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const getCourseNotices = async (courseId: number): Promise<CourseNotice[]> => {
  try {
    const response = await apiClient.get<CourseNotice[]>(`/courses/${courseId}/notices`);
    return response.data;
  } catch (error) {
    console.error('강좌별 공지사항 조회 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 공지사항 생성
 * POST /api/courses/:id/notices
 */
export const createCourseNotice = async (
  courseId: number,
  data: { title: string; content: string }
): Promise<CourseNotice> => {
  try {
    const response = await apiClient.post<CourseNotice>(`/courses/${courseId}/notices`, data);
    return response.data;
  } catch (error) {
    console.error('강좌별 공지사항 생성 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 공지사항 수정
 * PUT /api/courses/:id/notices/:noticeId
 */
export const updateCourseNotice = async (
  courseId: number,
  noticeId: number,
  data: { title: string; content: string }
): Promise<CourseNotice> => {
  try {
    const response = await apiClient.put<CourseNotice>(`/courses/${courseId}/notices/${noticeId}`, data);
    return response.data;
  } catch (error) {
    console.error('강좌별 공지사항 수정 실패:', error);
    throw error;
  }
};

