/**
 * 첨부파일 다운로드 URL 생성
 * @param attachment 첨부파일 정보
 * @returns 다운로드 URL
 */
export function getDownloadUrl(attachment: { url: string; filename: string; originalname: string }): string {
  // URL에서 filename 추출 (예: http://localhost:3000/notices/file-xxx.png)
  const url = new URL(attachment.url);
  const filename = url.pathname.split('/').pop() || attachment.filename;

  // 다운로드 엔드포인트로 변환
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const pathParts = url.pathname.split('/').filter(Boolean);

  if (pathParts[0] === 'notices') {
    return `${baseUrl}/api/download/notices/${filename}?originalname=${encodeURIComponent(attachment.originalname)}`;
  } else if (pathParts[0] === 'inquiries') {
    return `${baseUrl}/api/download/inquiries/${filename}?originalname=${encodeURIComponent(attachment.originalname)}`;
  }

  // 알 수 없는 경로는 원본 URL 반환
  return attachment.url;
}
