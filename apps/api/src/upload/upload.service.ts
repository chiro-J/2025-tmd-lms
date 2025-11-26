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
    notice: string;
    inquiry: string;
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
      notice: this.configService.get<string>('UPLOAD_PATH_NOTICE') || 'notices',
      inquiry: this.configService.get<string>('UPLOAD_PATH_INQUIRY') || 'inquiries',
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
    } else if (source === 'notice') {
      relativePath = `/${this.uploadPaths.notice}/${file.filename}`;
    } else if (source === 'inquiry') {
      relativePath = `/${this.uploadPaths.inquiry}/${file.filename}`;
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

    // 한글 파일명 인코딩 처리
    // Multer가 multipart/form-data에서 파일명을 latin1로 인코딩하므로 utf8로 변환
    let originalname = file.originalname || file.filename;
    if (file.originalname) {
      try {
        // Buffer를 통해 올바른 인코딩으로 변환
        originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      } catch (e) {
        // 변환 실패 시 원본 사용
        originalname = file.originalname;
      }
    }

    return {
      url: absoluteUrl,
      filename: file.filename,
      originalname: originalname,
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
    } else if (source === 'notice') {
      s3Key = `${this.uploadPaths.notice}/${file.filename}`;
    } else if (source === 'inquiry') {
      s3Key = `${this.uploadPaths.inquiry}/${file.filename}`;
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

      if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        try {
          const urlObj = new URL(filePath);
          filePath = urlObj.pathname;
        } catch (e) {
          // URL 파싱 실패 시 그대로 사용
        }
      }

      // 상대 경로 정규화
      filePath = filePath.replace(/^\//, '');

      // 경로가 이미 특정 폴더로 시작하는지 확인
      // DB에 저장된 경로 형식: /notices/file.jpg, /inquiries/file.jpg, /thumbnails/file.jpg 등
      // 절대 URL에서 추출한 경로: /notices/file.jpg
      let fullPath: string;

      // notices, inquiries, thumbnails, assignments, resources, lessons 등 모든 경로 처리
      if (filePath.startsWith('notices/') ||
          filePath.startsWith('inquiries/') ||
          filePath.startsWith('thumbnails/') ||
          filePath.startsWith('assignments/') ||
          filePath.startsWith('resources/') ||
          filePath.startsWith('lessons/')) {
        // 경로가 포함된 경우 (예: notices/file.jpg, inquiries/file.jpg)
        fullPath = path.join(this.publicPath, filePath);
      } else if (filePath.includes('/')) {
        // 다른 경로가 포함된 경우
        fullPath = path.join(this.publicPath, filePath);
      } else {
        // 파일명만 있는 경우 - 썸네일로 가정 (하위 호환성)
        fullPath = path.join(this.publicPath, 'thumbnails', filePath);
      }

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
      // 파일이 없어도 에러를 던지지 않음 (이미 삭제되었을 수 있음)
    }
  }
}
