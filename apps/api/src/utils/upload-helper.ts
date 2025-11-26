import { UploadService } from '../upload/upload.service';
import { ConfigService } from '@nestjs/config';

/**
 * UploadService 인스턴스를 생성하는 헬퍼 함수
 * 여러 서비스에서 반복되는 UploadService 초기화 코드를 중앙화
 */
export async function getUploadService(): Promise<UploadService> {
  const configService = new ConfigService();
  return new UploadService(configService);
}






