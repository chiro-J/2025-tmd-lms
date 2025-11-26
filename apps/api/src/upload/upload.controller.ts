import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

// public 폴더 경로 설정
// process.cwd()는 apps/api를 가리키므로, 상위 폴더로 올라가서 apps/public 사용
const publicPath = path.join(process.cwd(), '..', 'public');

// public 폴더가 없으면 생성
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

// 환경변수에서 업로드 경로 읽어오기 (기본값 사용)
// dotenv를 사용하여 직접 환경변수 읽기 (main.ts에서 이미 로드됨)
const getUploadPath = (source: string, type?: string): string => {
  const basePath = path.join(process.cwd(), '..', 'public');

  if (source === 'thumbnail') {
    const uploadPath = process.env.UPLOAD_PATH_THUMBNAIL || 'thumbnails';
    return path.join(basePath, uploadPath);
  } else if (source === 'assignment') {
    const uploadPath = process.env.UPLOAD_PATH_ASSIGNMENT || 'assignments';
    return path.join(basePath, uploadPath);
  } else if (source === 'resource') {
    const uploadPath = process.env.UPLOAD_PATH_RESOURCE || 'resources';
    return path.join(basePath, uploadPath);
  } else if (source === 'notice') {
    const uploadPath = process.env.UPLOAD_PATH_NOTICE || 'notices';
    return path.join(basePath, uploadPath);
  } else if (source === 'inquiry') {
    const uploadPath = process.env.UPLOAD_PATH_INQUIRY || 'inquiries';
    return path.join(basePath, uploadPath);
  } else {
    // lesson (기본값)
    if (type === 'pdf') {
      const uploadPath = process.env.UPLOAD_PATH_LESSON_PDF || 'lessons/pdfs';
      return path.join(basePath, uploadPath);
    } else if (type === 'video') {
      const uploadPath = process.env.UPLOAD_PATH_LESSON_VIDEO || 'lessons/videos';
      return path.join(basePath, uploadPath);
    } else {
      const uploadPath = process.env.UPLOAD_PATH_LESSON_IMAGE || 'lessons/images';
      return path.join(basePath, uploadPath);
    }
  }
};

// 출처별 폴더 구조 생성 (환경변수 기반)
const sourceFolders = {
  lesson: {
    pdf: getUploadPath('lesson', 'pdf'),
    image: getUploadPath('lesson', 'image'),
    video: getUploadPath('lesson', 'video'),
  },
  thumbnail: {
    image: getUploadPath('thumbnail'),
  },
  assignment: {
    file: getUploadPath('assignment'),
  },
  resource: {
    pdf: getUploadPath('resource'),
    image: getUploadPath('resource'),
  },
  notice: {
    file: getUploadPath('notice'),
  },
  inquiry: {
    file: getUploadPath('inquiry'),
  },
};

// 모든 폴더 생성
Object.values(sourceFolders).forEach((folders) => {
  Object.values(folders).forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
});

console.log('파일 업로드 경로:', publicPath);
console.log('출처별 폴더 구조:', sourceFolders);

// Multer 설정
const storage = diskStorage({
  destination: (req, file, cb) => {
    // source 파라미터로 출처 확인 (기본값: lesson)
    const source = req.body?.source || 'lesson';
    const type = req.body?.type || (file.mimetype === 'application/pdf' ? 'pdf' : file.mimetype.startsWith('video/') ? 'video' : 'image');

    let folder: string;

    // 환경변수 기반 경로 사용
    if (source === 'thumbnail') {
      folder = getUploadPath('thumbnail');
    } else if (source === 'assignment') {
      folder = getUploadPath('assignment');
    } else if (source === 'resource') {
      folder = getUploadPath('resource');
    } else if (source === 'notice') {
      folder = getUploadPath('notice');
    } else if (source === 'inquiry') {
      folder = getUploadPath('inquiry');
    } else {
      // lesson (기본값)
      folder = getUploadPath('lesson', type);
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
  // multipart/form-data에서는 body가 아직 파싱되지 않을 수 있으므로
  // 파일의 MIME 타입으로 직접 판단
  const isPdf = file.mimetype === 'application/pdf';
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');

  if (isPdf || isImage || isVideo) {
    cb(null, true);
  } else {
    console.error('지원하지 않는 파일 형식:', {
      mimetype: file.mimetype,
      originalname: file.originalname,
      bodyType: req.body?.type,
    });
    cb(new Error(`지원하지 않는 파일 형식입니다: ${file.mimetype}`), false);
  }
};

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
    @Body('source') source: string,
  ) {
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }

    // 파일 MIME 타입으로 타입 결정 (body.type이 없을 경우)
    let fileType = type;
    if (!fileType) {
      if (file.mimetype === 'application/pdf') {
        fileType = 'pdf';
      } else if (file.mimetype.startsWith('video/')) {
        fileType = 'video';
      } else if (file.mimetype.startsWith('image/')) {
        fileType = 'image';
      } else {
        fileType = 'image'; // 기본값
      }
    }

    // source 기본값: lesson
    const fileSource = source || 'lesson';

    console.log('업로드 요청 정보:', {
      source: fileSource,
      type: fileType,
      originalPath: file.path,
      filename: file.filename,
      originalname: file.originalname,
      encoding: file.encoding,
    });

    // Multer가 저장한 파일을 올바른 위치로 이동
    if (file.path) {
      let targetFolder: string;

      // 환경변수 기반 경로 사용
      if (fileSource === 'thumbnail') {
        targetFolder = getUploadPath('thumbnail');
      } else if (fileSource === 'assignment') {
        targetFolder = getUploadPath('assignment');
      } else if (fileSource === 'resource') {
        targetFolder = getUploadPath('resource');
      } else if (fileSource === 'notice') {
        targetFolder = getUploadPath('notice');
      } else if (fileSource === 'inquiry') {
        targetFolder = getUploadPath('inquiry');
      } else {
        // lesson (기본값)
        targetFolder = getUploadPath('lesson', fileType);
      }

      // 파일이 이미 올바른 위치에 있으면 이동 불필요
      const currentDir = path.dirname(file.path);
      const normalizedCurrentDir = path.normalize(currentDir);
      const normalizedTargetFolder = path.normalize(targetFolder);

      console.log('폴더 비교:', {
        currentDir: normalizedCurrentDir,
        targetFolder: normalizedTargetFolder,
        needMove: normalizedCurrentDir !== normalizedTargetFolder,
      });

      if (normalizedCurrentDir !== normalizedTargetFolder) {
        const targetPath = path.join(targetFolder, file.filename);
        try {
          // 대상 폴더가 없으면 생성
          if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
          }
          // 파일 이동
          if (fs.existsSync(file.path)) {
            fs.renameSync(file.path, targetPath);
            file.path = targetPath;
            console.log(`✅ 파일 이동 성공: ${file.path} → ${targetPath}`);
          } else {
            console.error('❌ 원본 파일이 존재하지 않습니다:', file.path);
          }
        } catch (error) {
          console.error('❌ 파일 이동 실패:', error);
          throw new BadRequestException(`파일을 올바른 위치로 이동하는데 실패했습니다: ${error}`);
        }
      } else {
        console.log('✅ 파일이 이미 올바른 위치에 있습니다.');
      }
    }

    // UploadService를 통해 파일 저장 (로컬 또는 S3)
    const result = await this.uploadService.uploadFile(file, fileType, fileSource);

    // 파일이 실제로 저장되었는지 확인 (로컬 저장소인 경우만)
    let fileExists = true;
    if (this.configService.get<string>('STORAGE_TYPE') !== 's3') {
      // 절대 URL에서 상대 경로 추출
      let relativePath = result.url;
      if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        try {
          const url = new URL(relativePath);
          relativePath = url.pathname;
        } catch (e) {
          // URL 파싱 실패
        }
      }
      relativePath = relativePath.replace(/^\//, '');
      const fullPath = path.join(publicPath, relativePath);
      fileExists = fs.existsSync(fullPath);
    }

    console.log('파일 업로드 성공:', {
      storageType: this.configService.get<string>('STORAGE_TYPE') || 'local',
      detectedType: fileType,
      mimetype: file.mimetype,
      originalname: file.originalname,
      originalnameBuffer: file.originalname ? Buffer.from(file.originalname, 'latin1').toString('utf8') : null,
      filename: file.filename,
      url: result.url, // 절대 URL
      fileExists: fileExists,
      size: file.size,
      multerPath: file.path, // Multer가 저장한 경로
      resultOriginalname: result.originalname,
    });

    if (!fileExists && this.configService.get<string>('STORAGE_TYPE') !== 's3') {
      console.error('경고: 파일이 저장되지 않았습니다:', result.url);
      console.error('Multer 경로:', file.path);
    }

    return result;
  }
}

