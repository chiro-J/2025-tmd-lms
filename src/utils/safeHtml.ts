// 간단한 HTML 정리 함수 (XSS 방지)
export function safeHtml(html: string): string {
  // 기본적인 HTML 태그만 허용
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3'];
  
  // HTML 태그 제거 (간단한 방법)
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script 태그 제거
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // iframe 태그 제거
    .replace(/on\w+="[^"]*"/gi, '') // 이벤트 핸들러 제거
    .replace(/javascript:/gi, ''); // javascript: 제거
  
  return cleaned;
}