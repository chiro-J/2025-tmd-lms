import apiClient from './client';

// ========== 타입 정의 ==========
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'instructor' | 'student' | 'admin' | 'sub-admin';
  name: string;
  phone?: string;
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
    // 로그아웃 실패는 조용히 처리 (refresh token이 없을 수 있음)
    // console.error('로그아웃 실패:', error);
    // throw하지 않고 조용히 처리
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    // 401을 정상 응답으로 처리하기 위해 validateStatus 설정
    const response = await apiClient.get<User>('/auth/me', {
      validateStatus: (status) => status < 500, // 500 이상만 에러로 처리
    });

    // 401인 경우 에러로 처리
    if (response.status === 401) {
      const error: any = new Error('Unauthorized');
      error.response = { status: 401 };
      error.silent = true;
      throw error;
    }

    return response.data;
  } catch (error: any) {
    // 401 에러는 로그인하지 않은 상태로 정상적인 상황이므로 조용히 처리
    if (error.response?.status === 401) {
      error.silent = true;
      error.config = error.config || {};
      error.config.silent = true;
      // 에러 메시지를 빈 문자열로 설정하여 콘솔 출력 최소화
      error.message = '';
      throw error;
    }
    // 네트워크 오류 (서버가 실행되지 않음)
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      // /auth/me는 초기 로드 시 호출되므로 조용히 처리
      error.silent = true;
      error.config = error.config || {};
      error.config.silent = true;
      error.message = '';
      throw error;
    }
    // 다른 에러는 로깅
    if (!error.silent) {
      console.error('프로필 조회 실패:', error);
    }
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

// ========== 중복 체크 관련 API ==========

export const checkEmail = async (email: string): Promise<{ exists: boolean; available: boolean }> => {
  try {
    const response = await apiClient.post<{ exists: boolean; available: boolean }>('/auth/check-email', { email });
    return response.data;
  } catch (error: any) {
    console.error('이메일 중복 체크 실패:', error);
    // 에러 발생 시 중복으로 간주
    return { exists: true, available: false };
  }
};

export const checkPhone = async (phone: string): Promise<{ exists: boolean; available: boolean }> => {
  try {
    if (!phone) {
      return { exists: false, available: true };
    }
    const response = await apiClient.post<{ exists: boolean; available: boolean }>('/auth/check-phone', { phone });
    return response.data;
  } catch (error: any) {
    console.error('전화번호 중복 체크 실패:', error);
    // 에러 발생 시 중복으로 간주
    return { exists: true, available: false };
  }
};

// ========== 회원 탈퇴 관련 API ==========

export const deleteAccount = async (): Promise<void> => {
  try {
    await apiClient.delete('/auth/account');
  } catch (error: any) {
    console.error('회원 탈퇴 실패:', error);
    throw new Error(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
  }
};



