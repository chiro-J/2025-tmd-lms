import apiClient from './client';

// ========== 타입 정의 ==========
export interface SubAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: {
    userManagement: boolean;
    contentManagement: boolean;
    systemSettings: boolean;
    instructorApproval: boolean;
  };
  createdAt: string;
  lastLogin: string;
  // 백엔드에서 받는 필드들
  userManagement?: boolean;
  contentManagement?: boolean;
  systemSettings?: boolean;
  instructorApproval?: boolean;
}

export interface CreateSubAdminData {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: {
    userManagement: boolean;
    contentManagement: boolean;
    systemSettings: boolean;
    instructorApproval: boolean;
  };
}

export interface Instructor {
  id: number;
  userId?: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  education: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  portfolio: string;
  motivation: string;
  previousExperience: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  enrolledDate: string;
  lastLogin: string;
  enrolledCourses?: string[]; // 컴포넌트에서 사용하는 필드
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  status: 'active' | 'inactive' | 'pending';
  enrolledStudents: number;
  createdAt: string;
  description: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'inactive';
  createdDate: string;
}

export interface CreateNoticeData {
  title: string;
  content: string;
  author: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Inquiry {
  id: number;
  title: string;
  user: string;
  email: string;
  content: string;
  createdDate: string;
  status: 'pending' | 'completed';
  response?: string;
  // 백엔드에서 받는 필드
  userName?: string;
}

export interface SystemSettings {
  id: number;
  emailNotifications: boolean;
  systemMaintenanceAlert: boolean;
  passwordMinLength: number;
  sessionTimeout: number;
  twoFactorAuth: boolean;
  platformName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
}

// ========== 서브 관리자 관련 ==========
export const getSubAdmins = async (): Promise<SubAdmin[]> => {
  try {
    const response = await apiClient.get<SubAdmin[]>('/admin/sub-admins');
    return response.data;
  } catch (error) {
    console.error('서브 관리자 목록 조회 실패:', error);
    throw error;
  }
};

export const getSubAdmin = async (id: number): Promise<SubAdmin> => {
  try {
    const response = await apiClient.get<SubAdmin>(`/admin/sub-admins/${id}`);
    return response.data;
  } catch (error) {
    console.error('서브 관리자 조회 실패:', error);
    throw error;
  }
};

export const createSubAdmin = async (data: CreateSubAdminData): Promise<SubAdmin> => {
  try {
    const response = await apiClient.post<SubAdmin>('/admin/sub-admins', data);
    return response.data;
  } catch (error) {
    console.error('서브 관리자 생성 실패:', error);
    throw error;
  }
};

export const updateSubAdmin = async (id: number, data: Partial<SubAdmin>): Promise<SubAdmin> => {
  try {
    const response = await apiClient.put<SubAdmin>(`/admin/sub-admins/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('서브 관리자 수정 실패:', error);
    throw error;
  }
};

export const deleteSubAdmin = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/sub-admins/${id}`);
  } catch (error) {
    console.error('서브 관리자 삭제 실패:', error);
    throw error;
  }
};

// ========== 강사 관련 ==========
export const getInstructors = async (): Promise<Instructor[]> => {
  try {
    const response = await apiClient.get<Instructor[]>('/admin/instructors');
    return response.data;
  } catch (error) {
    console.error('강사 목록 조회 실패:', error);
    throw error;
  }
};

export const getInstructor = async (id: number): Promise<Instructor> => {
  try {
    const response = await apiClient.get<Instructor>(`/admin/instructors/${id}`);
    return response.data;
  } catch (error) {
    console.error('강사 조회 실패:', error);
    throw error;
  }
};

export const approveInstructor = async (id: number): Promise<Instructor> => {
  try {
    const response = await apiClient.put<Instructor>(`/admin/instructors/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('강사 승인 실패:', error);
    throw error;
  }
};

export const rejectInstructor = async (id: number): Promise<Instructor> => {
  try {
    const response = await apiClient.put<Instructor>(`/admin/instructors/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error('강사 거부 실패:', error);
    throw error;
  }
};

export const pendingInstructor = async (id: number): Promise<Instructor> => {
  try {
    const response = await apiClient.put<Instructor>(`/admin/instructors/${id}/pending`);
    return response.data;
  } catch (error) {
    console.error('강사 대기 상태 변경 실패:', error);
    throw error;
  }
};

export const deleteInstructor = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/instructors/${id}`);
  } catch (error) {
    console.error('강사 삭제 실패:', error);
    throw error;
  }
};

// 강의자 소개 관련
export const getInstructorIntroduction = async (userId: number): Promise<string | null> => {
  try {
    const response = await apiClient.get<{ introduction: string | null }>(`/admin/instructors/user/${userId}/introduction`);
    return response.data.introduction;
  } catch (error) {
    console.error('강의자 소개 조회 실패:', error);
    throw error;
  }
};

export const updateInstructorIntroduction = async (userId: number, introduction: string): Promise<void> => {
  try {
    await apiClient.put(`/admin/instructors/user/${userId}/introduction`, { introduction });
  } catch (error) {
    console.error('강의자 소개 저장 실패:', error);
    throw error;
  }
};

export const getInstructorIntroductionPublic = async (instructorId: number): Promise<string | null> => {
  try {
    const response = await apiClient.get<{ introduction: string | null }>(`/admin/instructors/${instructorId}/introduction`);
    return response.data.introduction;
  } catch (error) {
    console.error('강의자 소개 조회 실패:', error);
    throw error;
  }
};

// ========== 수강생 관련 ==========
export const getStudents = async (): Promise<Student[]> => {
  try {
    const response = await apiClient.get<Student[]>('/admin/students');
    return response.data;
  } catch (error) {
    console.error('수강생 목록 조회 실패:', error);
    throw error;
  }
};

export const getStudent = async (id: number): Promise<Student> => {
  try {
    const response = await apiClient.get<Student>(`/admin/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('수강생 조회 실패:', error);
    throw error;
  }
};

export const deleteStudent = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/students/${id}`);
  } catch (error) {
    console.error('수강생 삭제 실패:', error);
    throw error;
  }
};

// ========== 공지사항 관련 ==========
export const getNotices = async (): Promise<Notice[]> => {
  try {
    const response = await apiClient.get<Notice[]>('/admin/notices');
    return response.data;
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error);
    throw error;
  }
};

export const getNotice = async (id: number): Promise<Notice> => {
  try {
    const response = await apiClient.get<Notice>(`/admin/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error('공지사항 조회 실패:', error);
    throw error;
  }
};

export const createNotice = async (data: CreateNoticeData): Promise<Notice> => {
  try {
    const response = await apiClient.post<Notice>('/admin/notices', data);
    return response.data;
  } catch (error) {
    console.error('공지사항 생성 실패:', error);
    throw error;
  }
};

export const updateNotice = async (id: number, data: Partial<Notice>): Promise<Notice> => {
  try {
    const response = await apiClient.put<Notice>(`/admin/notices/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('공지사항 수정 실패:', error);
    throw error;
  }
};

export const deleteNotice = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/notices/${id}`);
  } catch (error) {
    console.error('공지사항 삭제 실패:', error);
    throw error;
  }
};

// ========== 문의사항 관련 ==========
export const getInquiries = async (): Promise<Inquiry[]> => {
  try {
    const response = await apiClient.get<Inquiry[]>('/admin/inquiries');
    return response.data;
  } catch (error) {
    console.error('문의사항 목록 조회 실패:', error);
    throw error;
  }
};

export const getInquiry = async (id: number): Promise<Inquiry> => {
  try {
    const response = await apiClient.get<Inquiry>(`/admin/inquiries/${id}`);
    return response.data;
  } catch (error) {
    console.error('문의사항 조회 실패:', error);
    throw error;
  }
};

export const createInquiry = async (data: {
  title: string;
  content: string;
  courseName?: string;
  courseNumber?: string;
}): Promise<Inquiry> => {
  try {
    const response = await apiClient.post<Inquiry>('/admin/inquiries', data);
    return response.data;
  } catch (error) {
    console.error('문의사항 생성 실패:', error);
    throw error;
  }
};

export const getMyInquiries = async (): Promise<Inquiry[]> => {
  try {
    const response = await apiClient.get<Inquiry[]>('/admin/inquiries/my');
    return response.data;
  } catch (error) {
    console.error('내 문의사항 조회 실패:', error);
    throw error;
  }
};

export const respondToInquiry = async (id: number, response: string): Promise<Inquiry> => {
  try {
    const response_data = await apiClient.put<Inquiry>(`/admin/inquiries/${id}/respond`, { response });
    return response_data.data;
  } catch (error) {
    console.error('문의사항 답변 실패:', error);
    throw error;
  }
};

// ========== 시스템 설정 관련 ==========
export const getSystemSettings = async (): Promise<SystemSettings> => {
  try {
    const response = await apiClient.get<SystemSettings>('/admin/system-settings');
    return response.data;
  } catch (error) {
    console.error('시스템 설정 조회 실패:', error);
    throw error;
  }
};

export const updateSystemSettings = async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
  try {
    const response = await apiClient.put<SystemSettings>('/admin/system-settings', data);
    return response.data;
  } catch (error) {
    console.error('시스템 설정 수정 실패:', error);
    throw error;
  }
};

// ========== 강좌 관련 (관리자용) ==========
export const getCoursesForAdmin = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.get<Course[]>('/courses');
    return response.data;
  } catch (error) {
    console.error('강좌 목록 조회 실패:', error);
    throw error;
  }
};

export const approveCourse = async (id: number): Promise<Course> => {
  try {
    const response = await apiClient.put<Course>(`/courses/${id}`, { status: 'active' });
    return response.data;
  } catch (error) {
    console.error('강좌 승인 실패:', error);
    throw error;
  }
};

export const rejectCourse = async (id: number): Promise<Course> => {
  try {
    const response = await apiClient.put<Course>(`/courses/${id}`, { status: 'inactive' });
    return response.data;
  } catch (error) {
    console.error('강좌 거부 실패:', error);
    throw error;
  }
};

export const deleteCourse = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${id}`);
  } catch (error) {
    console.error('강좌 삭제 실패:', error);
    throw error;
  }
};

export interface CreateCourseData {
  title: string;
  instructor: string;
  thumbnail?: string;
  content?: string;
  videoUrl?: string;
  status?: string;
}

export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  try {
    const response = await apiClient.post<Course>('/courses', data);
    return response.data;
  } catch (error) {
    console.error('강좌 생성 실패:', error);
    throw error;
  }
};

export const updateCourse = async (id: number, data: Partial<Course>): Promise<Course> => {
  try {
    const response = await apiClient.put<Course>(`/courses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('강좌 수정 실패:', error);
    throw error;
  }
};



