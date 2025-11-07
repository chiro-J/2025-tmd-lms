import apiClient from './client';

// ========== 타입 정의 ==========
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'instructor' | 'student' | 'admin' | 'sub-admin';
  name: string;
  phone?: string;
  avatar?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  role?: 'instructor' | 'student' | 'admin' | 'sub-admin';
  phone?: string;
}

// ========== Auth API ==========
export const register = async (data: RegisterData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh');
    return response.data;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    throw error;
  }
};

// ========== 이메일 인증 관련 API ==========

export const sendVerificationCode = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>('/auth/send-verification-code', { email });
    return response.data;
  } catch (error: any) {
    console.error('인증 코드 발송 실패:', error);
    // 404 오류인 경우 백엔드 서버가 실행되지 않았을 가능성
    if (error.response?.status === 404) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw new Error(error.response?.data?.message || '인증 코드 발송에 실패했습니다.');
  }
};

export const verifyCode = async (email: string, code: string): Promise<{ verified: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{ verified: boolean; message: string }>('/auth/verify-code', { email, code });
    return response.data;
  } catch (error: any) {
    console.error('인증 코드 검증 실패:', error);
    if (error.response?.status === 404) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw new Error(error.response?.data?.message || '인증 코드 검증에 실패했습니다.');
  }
};

export interface RegisterWithVerificationData {
  email: string;
  password: string;
  name: string;
  username: string;
  phone?: string;
  role?: 'instructor' | 'student' | 'admin' | 'sub-admin';
}

export const registerWithVerification = async (data: RegisterWithVerificationData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/register-with-verification', data);
    return response.data;
  } catch (error: any) {
    console.error('회원가입 실패:', error);
    if (error.response?.status === 404) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
  }
};



