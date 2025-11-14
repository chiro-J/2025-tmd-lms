import axios from 'axios';

// 환경 변수에서 API URL 가져오기 (Vite는 VITE_ 접두사 필요)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - JWT 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 갱신 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 시 자동 갱신 (단, /auth/me와 /auth/login은 제외)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // /auth/me 엔드포인트는 토큰이 없을 때 401이 정상이므로 갱신 시도하지 않고 조용히 처리
      if (originalRequest.url?.includes('/auth/me')) {
        // 401 에러를 조용히 reject (콘솔 에러 출력 방지)
        return Promise.reject(error);
      }

      // /auth/login 엔드포인트는 로그인 실패이므로 갱신 시도하지 않음
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃 처리 (단, /auth/me와 /auth/login은 제외)
        if (!originalRequest.url?.includes('/auth/me') && !originalRequest.url?.includes('/auth/login')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          // 로그인 페이지로 리다이렉트하지 않음 (초기 로드 시)
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;


