import apiClient from '../core/api/client';

/**
 * 썸네일 URL을 정규화하고 절대 URL로 변환합니다.
 * - 절대 URL (http://localhost:3000/thumbnails/...) → 그대로 반환
 * - 상대 경로 (/thumbnails/...) → 절대 URL로 변환
 * - /photo/ 경로 → /thumbnails/로 변환 후 절대 URL로 변환
 * - 빈 값이거나 없으면 기본 썸네일 반환
 */
export const normalizeThumbnailUrl = (thumbnail?: string | null, defaultThumbnail: string = '/thumbnails/aaa.jpg'): string => {
  let processedUrl = thumbnail || defaultThumbnail;

  // /photo/ 경로를 /thumbnails/로 변환
  if (processedUrl.startsWith('/photo/')) {
    processedUrl = processedUrl.replace('/photo/', '/thumbnails/');
  }

  // 이미 절대 URL인 경우 그대로 반환
  if (processedUrl.startsWith('http://') || processedUrl.startsWith('https://')) {
    return processedUrl;
  }

  // 상대 경로인 경우 절대 URL로 변환
  const baseURL = apiClient.defaults.baseURL || 'http://localhost:3000/api';
  // /api 부분을 제거하고 public 경로를 직접 참조하도록 함
  const absoluteBase = baseURL.replace('/api', '');
  return `${absoluteBase}${processedUrl}`;
};

