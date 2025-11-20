/**
 * 한국 시간(KST, UTC+9) 관련 유틸리티 함수
 *
 * 서버의 타임존이 'Asia/Seoul'로 설정되어 있으므로,
 * new Date()는 이미 KST 기준으로 생성됩니다.
 * 하지만 DB에 저장된 시간이 UTC일 수 있으므로 변환 함수를 제공합니다.
 */

/**
 * 현재 시간을 한국 시간(KST)으로 반환
 * 서버 타임존이 Asia/Seoul로 설정되어 있으므로 new Date()가 KST입니다.
 */
export function getKSTDate(): Date {
  return new Date(); // 서버 타임존이 Asia/Seoul이므로 이미 KST
}

/**
 * Date 객체를 한국 시간(KST) ISO 문자열로 변환
 * DB에서 가져온 UTC 시간을 KST로 변환하여 반환
 */
export function toKSTISOString(date: Date): string {
  if (!date) return '';

  // Date 객체가 이미 KST 기준이면 그대로 사용
  // UTC 기준이면 9시간을 더해 KST로 변환
  const kstOffset = 9 * 60 * 60 * 1000; // 9시간
  const kstTime = new Date(date.getTime() + kstOffset);
  return kstTime.toISOString();
}

/**
 * Date 객체를 한국 시간(KST) 날짜 문자열로 변환 (yyyy-MM-dd)
 */
export function toKSTDateString(date: Date): string {
  if (!date) return '';

  const kstOffset = 9 * 60 * 60 * 1000;
  const kstTime = new Date(date.getTime() + kstOffset);
  return kstTime.toISOString().split('T')[0];
}

/**
 * Date 객체를 한국 시간(KST) 날짜시간 문자열로 변환 (yyyy-MM-dd HH:mm:ss)
 */
export function toKSTDateTimeString(date: Date): string {
  if (!date) return '';

  const kstOffset = 9 * 60 * 60 * 1000;
  const kstTime = new Date(date.getTime() + kstOffset);
  const year = kstTime.getUTCFullYear();
  const month = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstTime.getUTCDate()).padStart(2, '0');
  const hours = String(kstTime.getUTCHours()).padStart(2, '0');
  const minutes = String(kstTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(kstTime.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

