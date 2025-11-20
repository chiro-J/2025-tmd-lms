import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadResult {
  url: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly storageType: 'local' | 's3';
  private readonly publicPath: string;
  private readonly fileStorageBaseUrl: string;
  // 업로드 경로 설정 (환경변수에서 읽어오거나 기본값 사용)
  private readonly uploadPaths: {
    thumbnail: string;
    assignment: string;
    resource: string;
    lessonPdf: string;
    lessonImage: string;
    lessonVideo: string;
  };

  constructor(private configService: ConfigService) {
    // 환경 변수로 저장소 타입 결정 (기본값: local)
    this.storageType = (this.configService.get<string>('STORAGE_TYPE') || 'local') as 'local' | 's3';
    // process.cwd()는 apps/api를 가리키므로, 상위 폴더로 올라가서 apps/public 사용
    this.publicPath = path.join(process.cwd(), '..', 'public');
    // 파일 저장소 base URL (환경변수에서 가져오거나 기본값 사용)
    // 로컬: http://localhost:3000
    // S3: https://bucket-name.s3.region.amazonaws.com
    this.fileStorageBaseUrl = this.configService.get<string>('FILE_STORAGE_BASE_URL') || 'http://localhost:3000';

    // 업로드 경로 설정 (환경변수에서 읽어오거나 기본값 사용)
    this.uploadPaths = {
      thumbnail: this.configService.get<string>('UPLOAD_PATH_THUMBNAIL') || 'thumbnails',
      assignment: this.configService.get<string>('UPLOAD_PATH_ASSIGNMENT') || 'assignments',
      resource: this.configService.get<string>('UPLOAD_PATH_RESOURCE') || 'resources',
      lessonPdf: this.configService.get<string>('UPLOAD_PATH_LESSON_PDF') || 'lessons/pdfs',
      lessonImage: this.configService.get<string>('UPLOAD_PATH_LESSON_IMAGE') || 'lessons/images',
      lessonVideo: this.configService.get<string>('UPLOAD_PATH_LESSON_VIDEO') || 'lessons/videos',
    };
  }

  /**
   * 파일 업로드 (로컬 또는 S3)
   * @param file 업로드할 파일
   * @param type 파일 타입 (pdf, image, video)
   * @param source 파일 출처 (lesson, thumbnail, assignment, resource)
   * @returns 업로드된 파일의 URL 및 메타데이터
   */
  async uploadFile(file: Express.Multer.File, type: string, source: string = 'lesson'): Promise<UploadResult> {
    if (this.storageType === 's3') {
      return this.uploadToS3(file, type, source);
    } else {
      return this.uploadToLocal(file, type, source);
    }
  }

  /**
   * 로컬 파일 시스템에 저장
   */
  private async uploadToLocal(file: Express.Multer.File, type: string, source: string = 'lesson'): Promise<UploadResult> {
    // 출처별 경로 생성 (환경변수에서 읽어온 경로 사용)
    let relativePath: string;
    if (source === 'thumbnail') {
      relativePath = `/${this.uploadPaths.thumbnail}/${file.filename}`;
    } else if (source === 'assignment') {
      relativePath = `/${this.uploadPaths.assignment}/${file.filename}`;
    } else if (source === 'resource') {
      relativePath = `/${this.uploadPaths.resource}/${file.filename}`;
    } else {
      // lesson (기본값)
      if (type === 'pdf') {
        relativePath = `/${this.uploadPaths.lessonPdf}/${file.filename}`;
      } else if (type === 'video') {
        relativePath = `/${this.uploadPaths.lessonVideo}/${file.filename}`;
      } else {
        relativePath = `/${this.uploadPaths.lessonImage}/${file.filename}`;
      }
    }

    // Multer가 저장한 파일 경로 확인
    if (file.path) {
      // file.path가 있으면 Multer가 저장한 경로 사용
      const fileExists = fs.existsSync(file.path);
      if (!fileExists) {
        console.error('파일이 저장되지 않았습니다:', file.path);
        throw new Error('파일 저장에 실패했습니다.');
      }
      console.log('파일 저장 확인:', { path: file.path, exists: fileExists });
    } else {
      // file.path가 없으면 수동으로 저장 (Multer memoryStorage 사용 시)
      const folderPath = path.join(this.publicPath, relativePath.replace(/^\//, '').replace(/\/[^/]+$/, ''));
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      const filePath = path.join(folderPath, file.filename);
      if (file.buffer) {
        await fs.promises.writeFile(filePath, file.buffer);
        console.log('파일 수동 저장 완료:', filePath);
      } else {
        console.error('파일 버퍼가 없습니다:', file);
        throw new Error('파일 저장에 실패했습니다.');
      }
    }

    // 절대 URL로 반환 (환경변수 base URL 사용)
    const absoluteUrl = `${this.fileStorageBaseUrl}${relativePath}`;

    return {
      url: absoluteUrl,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  /**
   * S3에 파일 업로드
   * TODO: AWS SDK 설치 및 구현 필요
   * npm install @aws-sdk/client-s3
   */
  private async uploadToS3(file: Express.Multer.File, type: string, source: string = 'lesson'): Promise<UploadResult> {
    // S3 설정
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const region = this.configService.get<string>('AWS_REGION') || 'ap-northeast-2';

    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME 환경 변수가 설정되지 않았습니다.');
    }

    // 출처별 S3 키 생성 (환경변수에서 읽어온 경로 사용)
    let s3Key: string;
    if (source === 'thumbnail') {
      s3Key = `${this.uploadPaths.thumbnail}/${file.filename}`;
    } else if (source === 'assignment') {
      s3Key = `${this.uploadPaths.assignment}/${file.filename}`;
    } else if (source === 'resource') {
      s3Key = `${this.uploadPaths.resource}/${file.filename}`;
    } else {
      // lesson (기본값)
      if (type === 'pdf') {
        s3Key = `${this.uploadPaths.lessonPdf}/${file.filename}`;
      } else if (type === 'video') {
        s3Key = `${this.uploadPaths.lessonVideo}/${file.filename}`;
      } else {
        s3Key = `${this.uploadPaths.lessonImage}/${file.filename}`;
      }
    }

    // TODO: AWS SDK를 사용한 실제 S3 업로드 구현
    // 예시 코드:
    // const s3Client = new S3Client({ region });
    // const uploadCommand = new PutObjectCommand({
    //   Bucket: bucketName,
    //   Key: s3Key,
    //   Body: fs.createReadStream(file.path),
    //   ContentType: file.mimetype,
    // });
    // await s3Client.send(uploadCommand);

    // 로컬 파일 삭제 (S3에 업로드 후)
    // fs.unlinkSync(file.path);

    // S3 URL 반환
    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;

    return {
      url: s3Url,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  /**
   * 파일 삭제 (로컬 또는 S3)
   */
  async deleteFile(url: string): Promise<void> {
    if (this.storageType === 's3') {
      // TODO: S3 파일 삭제 구현
      // const s3Client = new S3Client({ region });
      // const deleteCommand = new DeleteObjectCommand({
      //   Bucket: bucketName,
      //   Key: s3Key,
      // });
      // await s3Client.send(deleteCommand);
    } else {
      // 로컬 파일 삭제
      // URL에서 상대 경로 추출
      let filePath = url;
      console.log('deleteFile 호출:', { originalUrl: url, storageType: this.storageType });

      if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        try {
          const urlObj = new URL(filePath);
          filePath = urlObj.pathname;
          console.log('절대 URL에서 경로 추출:', filePath);
        } catch (e) {
          console.warn('URL 파싱 실패:', e);
          // URL 파싱 실패 시 그대로 사용
        }
      }

      // 상대 경로 정규화
      filePath = filePath.replace(/^\//, '');

      // 경로가 이미 thumbnails/로 시작하는지 확인
      // DB에 저장된 경로 형식: /thumbnails/file.jpg 또는 thumbnails/file.jpg
      // 절대 URL에서 추출한 경로: /thumbnails/file.jpg
      let fullPath: string;
      if (filePath.startsWith('thumbnails/')) {
        // thumbnails/file.jpg 형식
        fullPath = path.join(this.publicPath, filePath);
      } else {
        // 파일명만 있거나 다른 경로인 경우
        // 썸네일 파일은 thumbnails 폴더에 있다고 가정
        // 하지만 다른 파일 타입도 처리할 수 있도록 경로 확인
        if (filePath.includes('/')) {
          // 경로가 포함된 경우 (예: lessons/pdfs/file.pdf)
          fullPath = path.join(this.publicPath, filePath);
        } else {
          // 파일명만 있는 경우 - 썸네일로 가정 (다른 타입은 호출 시점에서 경로를 포함해야 함)
          fullPath = path.join(this.publicPath, 'thumbnails', filePath);
        }
      }

      console.log('파일 삭제 경로:', {
        originalUrl: url,
        extractedPath: filePath,
        fullPath: fullPath,
        exists: fs.existsSync(fullPath),
        publicPath: this.publicPath
      });

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`✅ 파일 삭제 성공: ${fullPath}`);
      } else {
        console.warn(`⚠️ 파일이 존재하지 않음: ${fullPath}`);
        // 파일이 없어도 에러를 던지지 않음 (이미 삭제되었을 수 있음)
      }
    }
  }
}
