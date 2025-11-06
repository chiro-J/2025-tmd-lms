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

export interface RegisterWithVerificationData extends RegisterData {
  verificationCode: string;
}

// ========== Auth API ==========
// 이메일 인증 코드 발송
export const sendVerificationCode = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post<{ message: string }>('/auth/send-verification-code', { email });
    return response.data;
  } catch (error) {
    console.error('인증 코드 발송 실패:', error);
    throw error;
  }
};

// 인증 코드 검증
export const verifyCode = async (email: string, code: string): Promise<{ verified: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{ verified: boolean; message: string }>('/auth/verify-code', { email, code });
    return response.data;
  } catch (error) {
    console.error('인증 코드 검증 실패:', error);
    throw error;
  }
};

// 인증 완료 후 회원가입
export const registerWithVerification = async (data: RegisterWithVerificationData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/register-with-verification', data);
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

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


