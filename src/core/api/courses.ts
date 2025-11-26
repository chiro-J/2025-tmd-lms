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
  attachments?: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null;
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
  data: { title: string; content: string; attachments?: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null }
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
  data: { title: string; content: string; attachments?: Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }> | null }
): Promise<CourseNotice> => {
  try {
    const response = await apiClient.put<CourseNotice>(`/courses/${courseId}/notices/${noticeId}`, data);
    return response.data;
  } catch (error) {
    console.error('강좌별 공지사항 수정 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 공지사항 삭제
 * DELETE /api/courses/:id/notices/:noticeId
 */
export const deleteCourseNotice = async (
  courseId: number,
  noticeId: number
): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/notices/${noticeId}`);
  } catch (error) {
    console.error('강좌별 공지사항 삭제 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 강의 자료 조회
 * GET /api/courses/:id/resources
 */
export interface CourseResource {
  id: number;
  courseId: number;
  title: string;
  type: 'pdf' | 'slide' | 'code' | 'link' | 'image';
  fileUrl?: string;
  linkUrl?: string;
  code?: string;
  fileSize?: number;
  downloadAllowed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getCourseResources = async (courseId: number): Promise<CourseResource[]> => {
  try {
    const response = await apiClient.get<CourseResource[]>(`/courses/${courseId}/resources`);
    return response.data;
  } catch (error) {
    console.error('강좌별 강의 자료 조회 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 강의 자료 생성
 * POST /api/courses/:id/resources
 */
export const createCourseResource = async (
  courseId: number,
  data: {
    title: string;
    type?: 'pdf' | 'slide' | 'code' | 'link' | 'image';
    file?: File;
    linkUrl?: string;
    code?: string;
  }
): Promise<CourseResource> => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);

    // 파일이 있으면 파일 확장자로 타입 자동 감지
    let type = data.type
    if (data.file && !type) {
      const fileName = data.file.name.toLowerCase()
      const ext = fileName.substring(fileName.lastIndexOf('.') + 1)
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
        type = 'image'
      } else if (ext === 'pdf') {
        type = 'pdf'
      } else {
        type = 'slide' // 기본값
      }
    }
    formData.append('type', type || 'pdf')

    if (data.file) {
      formData.append('file', data.file);
    }
    if (data.linkUrl) {
      formData.append('linkUrl', data.linkUrl);
    }
    if (data.code) {
      formData.append('code', data.code);
    }

    const response = await apiClient.post<CourseResource>(
      `/courses/${courseId}/resources`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('강좌별 강의 자료 생성 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 강의 자료 삭제
 * DELETE /api/courses/:id/resources/:resourceId
 */
export const deleteCourseResource = async (
  courseId: number,
  resourceId: number
): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/resources/${resourceId}`);
  } catch (error) {
    console.error('강좌별 강의 자료 삭제 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 강의 자료 다운로드 허용/금지 토글
 * PUT /api/courses/:id/resources/:resourceId/download-allowed
 */
export const updateCourseResourceDownloadAllowed = async (
  courseId: number,
  resourceId: number,
  downloadAllowed: boolean
): Promise<CourseResource> => {
  try {
    const response = await apiClient.put<CourseResource>(
      `/courses/${courseId}/resources/${resourceId}/download-allowed`,
      { downloadAllowed }
    );
    return response.data;
  } catch (error) {
    console.error('강좌별 강의 자료 다운로드 허용/금지 수정 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 수강자 목록 조회
 * GET /api/courses/:id/enrollments
 */
export interface CourseEnrollment {
  id: number;
  courseId: number;
  userId: number;
  enrolledAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    username: string;
  };
}

export const getCourseEnrollments = async (courseId: number): Promise<CourseEnrollment[]> => {
  try {
    const response = await apiClient.get<CourseEnrollment[]>(`/courses/${courseId}/enrollments`);
    return response.data;
  } catch (error) {
    console.error('강좌별 수강자 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자별 수강 목록 조회
 * GET /api/courses/enrolled/:userId
 */
export const getUserEnrollments = async (userId: number): Promise<CourseEnrollment[]> => {
  try {
    const response = await apiClient.get<CourseEnrollment[]>(`/courses/enrolled/${userId}`);
    return response.data;
  } catch (error) {
    console.error('사용자별 수강 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 강좌 수강 등록
 * POST /api/courses/:id/enroll
 */
export const enrollInCourse = async (courseId: number, userId: number): Promise<CourseEnrollment> => {
  try {
    const response = await apiClient.post<CourseEnrollment>(`/courses/${courseId}/enroll`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('강좌 수강 등록 실패:', error);
    throw error;
  }
};

/**
 * 강좌 수강 취소
 * DELETE /api/courses/:id/enroll
 */
export const unenrollFromCourse = async (courseId: number, userId: number): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/enroll`, {
      data: { userId },
    });
  } catch (error) {
    console.error('강좌 수강 취소 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 QnA 조회
 * GET /api/courses/:id/qna
 */
export interface CourseQnA {
  id: number;
  courseId: number;
  userId: number;
  title: string;
  question: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    username: string;
  };
  answers: CourseQnAAnswer[];
}

export interface CourseQnAAnswer {
  id: number;
  qnaId: number;
  userId: number;
  content: string;
  parentAnswerId?: number;
  replies?: CourseQnAAnswer[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    username: string;
  };
}

export const getCourseQnAs = async (courseId: number): Promise<CourseQnA[]> => {
  try {
    const response = await apiClient.get<CourseQnA[]>(`/courses/${courseId}/qna`);
    return response.data;
  } catch (error) {
    console.error('강좌별 QnA 조회 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 QnA 생성
 * POST /api/courses/:id/qna
 */
export const createCourseQnA = async (
  courseId: number,
  userId: number,
  title: string,
  question: string,
  isPublic: boolean = true
): Promise<CourseQnA> => {
  try {
    const response = await apiClient.post<CourseQnA>(`/courses/${courseId}/qna`, {
      userId,
      title,
      question,
      isPublic,
    });
    return response.data;
  } catch (error) {
    console.error('강좌별 QnA 생성 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 QnA 삭제
 * DELETE /api/courses/:id/qna/:qnaId
 */
export const deleteCourseQnA = async (courseId: number, qnaId: number): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${courseId}/qna/${qnaId}`);
  } catch (error) {
    console.error('강좌별 QnA 삭제 실패:', error);
    throw error;
  }
};

/**
 * 강좌별 QnA 답변 생성
 * POST /api/courses/:id/qna/:qnaId/answers
 */
export const createCourseQnAAnswer = async (
  courseId: number,
  qnaId: number,
  userId: number,
  content: string,
  parentAnswerId?: number
): Promise<CourseQnAAnswer> => {
  try {
    const response = await apiClient.post<CourseQnAAnswer>(
      `/courses/${courseId}/qna/${qnaId}/answers`,
      {
        userId,
        content,
        parentAnswerId,
      }
    );
    return response.data;
  } catch (error) {
    console.error('강좌별 QnA 답변 생성 실패:', error);
    throw error;
  }
};

