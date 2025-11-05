import axios from 'axios';

// 환경 변수에서 API URL 가져오기 (Vite는 VITE_ 접두사 필요)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;


