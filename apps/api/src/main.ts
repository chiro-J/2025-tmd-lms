import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// .env 파일 로드 (apps/api/.env)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// 한국 시간대(KST) 설정
process.env.TZ = 'Asia/Seoul';

async function bootstrap() {
  const expressApp = express();

  // 요청 본문 크기 제한 증가 (100MB)
  expressApp.use(express.json({ limit: '100mb' }));
  expressApp.use(express.urlencoded({ limit: '100mb', extended: true }));

  // public 폴더 및 하위 폴더 생성
  // process.cwd()는 apps/api를 가리키므로, 상위 폴더로 올라가서 apps/public 사용
  const publicPath = path.join(process.cwd(), '..', 'public');
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  // 환경변수에서 업로드 경로 읽어오기 (기본값 사용)
  const uploadPathThumbnail = process.env.UPLOAD_PATH_THUMBNAIL || 'thumbnails';
  const uploadPathAssignment = process.env.UPLOAD_PATH_ASSIGNMENT || 'assignments';
  const uploadPathResource = process.env.UPLOAD_PATH_RESOURCE || 'resources';
  const uploadPathLessonPdf = process.env.UPLOAD_PATH_LESSON_PDF || 'lessons/pdfs';
  const uploadPathLessonImage = process.env.UPLOAD_PATH_LESSON_IMAGE || 'lessons/images';
  const uploadPathLessonVideo = process.env.UPLOAD_PATH_LESSON_VIDEO || 'lessons/videos';

  // 출처별 폴더 구조 생성 (환경변수 기반)
  const lessonsPdfsPath = path.join(publicPath, uploadPathLessonPdf);
  const lessonsImagesPath = path.join(publicPath, uploadPathLessonImage);
  const lessonsVideosPath = path.join(publicPath, uploadPathLessonVideo);
  const thumbnailsPath = path.join(publicPath, uploadPathThumbnail);
  const assignmentsPath = path.join(publicPath, uploadPathAssignment);
  const resourcesPath = path.join(publicPath, uploadPathResource);

  // 기존 submissions 폴더의 파일들을 assignments로 이동 (한 번만 실행)
  const submissionsPath = path.join(publicPath, 'submissions');
  if (fs.existsSync(submissionsPath)) {
    try {
      const files = fs.readdirSync(submissionsPath);
      if (files.length > 0) {
        if (!fs.existsSync(assignmentsPath)) {
          fs.mkdirSync(assignmentsPath, { recursive: true });
        }
        files.forEach((file) => {
          const oldFilePath = path.join(submissionsPath, file);
          const newFilePath = path.join(assignmentsPath, file);
          if (fs.statSync(oldFilePath).isFile()) {
            fs.renameSync(oldFilePath, newFilePath);
            console.log(`submissions 파일 이동: ${file} -> assignments/`);
          }
        });
      }
      // 빈 폴더 삭제
      try {
        fs.rmdirSync(submissionsPath);
        console.log('submissions 폴더 삭제 완료');
      } catch (error) {
        console.warn('submissions 폴더 삭제 실패 (이미 삭제되었거나 비어있지 않음):', error);
      }
    } catch (error) {
      console.error('submissions 폴더 처리 실패:', error);
    }
  }

  // 기존 pdfs, images, videos 폴더의 파일들을 lessons 하위로 이동
  const oldPdfsPath = path.join(publicPath, 'pdfs');
  const oldImagesPath = path.join(publicPath, 'images');
  const oldVideosPath = path.join(publicPath, 'videos');

  // 기존 pdfs -> lessons/pdfs로 이동
  if (fs.existsSync(oldPdfsPath)) {
    const files = fs.readdirSync(oldPdfsPath);
    if (files.length > 0) {
      files.forEach((file) => {
        const oldFilePath = path.join(oldPdfsPath, file);
        const newFilePath = path.join(lessonsPdfsPath, file);
        try {
          if (!fs.existsSync(lessonsPdfsPath)) {
            fs.mkdirSync(lessonsPdfsPath, { recursive: true });
          }
          fs.renameSync(oldFilePath, newFilePath);
          console.log(`PDF 파일 이동: ${file}`);
        } catch (error) {
          console.error(`PDF 파일 이동 실패: ${file}`, error);
        }
      });
    }
    // 빈 폴더 삭제 시도
    try {
      if (fs.readdirSync(oldPdfsPath).length === 0) {
        fs.rmdirSync(oldPdfsPath);
      }
    } catch (error) {
      // 폴더가 비어있지 않거나 삭제 실패 시 무시
    }
  }

  // 기존 images -> lessons/images로 이동
  if (fs.existsSync(oldImagesPath)) {
    const files = fs.readdirSync(oldImagesPath);
    if (files.length > 0) {
      files.forEach((file) => {
        const oldFilePath = path.join(oldImagesPath, file);
        const newFilePath = path.join(lessonsImagesPath, file);
        try {
          if (!fs.existsSync(lessonsImagesPath)) {
            fs.mkdirSync(lessonsImagesPath, { recursive: true });
          }
          fs.renameSync(oldFilePath, newFilePath);
          console.log(`이미지 파일 이동: ${file}`);
        } catch (error) {
          console.error(`이미지 파일 이동 실패: ${file}`, error);
        }
      });
    }
    // 빈 폴더 삭제 시도
    try {
      if (fs.readdirSync(oldImagesPath).length === 0) {
        fs.rmdirSync(oldImagesPath);
      }
    } catch (error) {
      // 폴더가 비어있지 않거나 삭제 실패 시 무시
    }
  }

  // 기존 videos -> lessons/videos로 이동
  if (fs.existsSync(oldVideosPath)) {
    const files = fs.readdirSync(oldVideosPath);
    if (files.length > 0) {
      files.forEach((file) => {
        const oldFilePath = path.join(oldVideosPath, file);
        const newFilePath = path.join(lessonsVideosPath, file);
        try {
          if (!fs.existsSync(lessonsVideosPath)) {
            fs.mkdirSync(lessonsVideosPath, { recursive: true });
          }
          fs.renameSync(oldFilePath, newFilePath);
          console.log(`비디오 파일 이동: ${file}`);
        } catch (error) {
          console.error(`비디오 파일 이동 실패: ${file}`, error);
        }
      });
    }
    // 빈 폴더 삭제 시도
    try {
      if (fs.readdirSync(oldVideosPath).length === 0) {
        fs.rmdirSync(oldVideosPath);
      }
    } catch (error) {
      // 폴더가 비어있지 않거나 삭제 실패 시 무시
    }
  }

  // 프론트엔드 public/photo 폴더의 기본 썸네일들을 백엔드 public/thumbnails로 복사
  // 썸네일은 모두 thumbnails 폴더에서 관리
  const frontendPhotoPath = path.join(process.cwd(), '..', '..', 'public', 'photo');
  if (fs.existsSync(frontendPhotoPath)) {
    try {
      if (!fs.existsSync(thumbnailsPath)) {
        fs.mkdirSync(thumbnailsPath, { recursive: true });
      }
      const files = fs.readdirSync(frontendPhotoPath);
      files.forEach((file) => {
        const sourceFile = path.join(frontendPhotoPath, file);
        const destFile = path.join(thumbnailsPath, file);
        if (fs.statSync(sourceFile).isFile()) {
          // 파일이 없을 때만 복사
          if (!fs.existsSync(destFile)) {
            fs.copyFileSync(sourceFile, destFile);
            console.log(`기본 썸네일 복사: ${file} -> thumbnails/`);
          }
        }
      });
      console.log('기본 썸네일 복사 완료. 프론트엔드 public/photo 폴더는 이제 제거 가능합니다.');
    } catch (error) {
      console.error('기본 썸네일 복사 실패:', error);
    }
  }

  // 프론트엔드 public/videos/sample.mp4를 백엔드 public/lessons/videos/로 복사
  // 샘플 비디오는 lesson의 video로 관리
  const frontendVideosPath = path.join(process.cwd(), '..', '..', 'public', 'videos');
  if (fs.existsSync(frontendVideosPath)) {
    try {
      if (!fs.existsSync(lessonsVideosPath)) {
        fs.mkdirSync(lessonsVideosPath, { recursive: true });
      }
      const files = fs.readdirSync(frontendVideosPath);
      files.forEach((file) => {
        const sourceFile = path.join(frontendVideosPath, file);
        const destFile = path.join(lessonsVideosPath, file);
        if (fs.statSync(sourceFile).isFile()) {
          // 파일이 없을 때만 복사
          if (!fs.existsSync(destFile)) {
            fs.copyFileSync(sourceFile, destFile);
            console.log(`샘플 비디오 복사: ${file} -> lessons/videos/`);
          }
        }
      });
      console.log('샘플 비디오 복사 완료. 프론트엔드 public/videos 폴더는 이제 제거 가능합니다.');
    } catch (error) {
      console.error('샘플 비디오 복사 실패:', error);
    }
  }

  // 모든 새 폴더 생성
  [lessonsPdfsPath, lessonsImagesPath, lessonsVideosPath, thumbnailsPath, assignmentsPath, resourcesPath].forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });

  console.log('정적 파일 서빙 경로:', publicPath);
  console.log('📁 업로드 경로 설정 (환경변수 기반):');
  console.log('  썸네일:', uploadPathThumbnail, '→', thumbnailsPath);
  console.log('  과제 제출:', uploadPathAssignment, '→', assignmentsPath);
  console.log('  강의 자료:', uploadPathResource, '→', resourcesPath);
  console.log('  강의 PDF:', uploadPathLessonPdf, '→', lessonsPdfsPath);
  console.log('  강의 이미지:', uploadPathLessonImage, '→', lessonsImagesPath);
  console.log('  강의 비디오:', uploadPathLessonVideo, '→', lessonsVideosPath);

  // 정적 파일 서빙 (public 폴더) - API prefix 전에 설정하여 직접 접근 가능
  // CORS 헤더 추가
  // 환경변수 기반 경로로 정적 파일 서빙 경로 동적 생성
  const staticPaths = [
    `/${uploadPathLessonPdf.split('/')[0]}`,
    `/${uploadPathLessonImage.split('/')[0]}`,
    `/${uploadPathLessonVideo.split('/')[0]}`,
    `/${uploadPathThumbnail}`,
    `/${uploadPathAssignment}`,
    `/${uploadPathResource}`,
    // 기존 경로 호환성 유지
    '/images', '/pdfs', '/videos', '/photo'
  ];

  expressApp.use((req, res, next) => {
      const pathMatches = staticPaths.some(staticPath => req.path.startsWith(staticPath));
      if (pathMatches) {
      const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
      res.header('Access-Control-Allow-Origin', allowedOrigin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      // OPTIONS 요청 처리
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
    }
    next();
  });

  // 정적 파일 서빙 설정 (환경변수 기반 경로)
  expressApp.use(`/${uploadPathLessonPdf}`, express.static(lessonsPdfsPath));
  expressApp.use(`/${uploadPathLessonImage}`, express.static(lessonsImagesPath));
  expressApp.use(`/${uploadPathLessonVideo}`, express.static(lessonsVideosPath));
  expressApp.use(`/${uploadPathThumbnail}`, express.static(thumbnailsPath));
  expressApp.use(`/${uploadPathAssignment}`, express.static(assignmentsPath));
  expressApp.use(`/${uploadPathResource}`, express.static(resourcesPath));
  // 기존 경로 호환성 유지
  expressApp.use('/pdfs', express.static(lessonsPdfsPath));
  expressApp.use('/images', express.static(lessonsImagesPath));
  expressApp.use('/videos', express.static(lessonsVideosPath));
  expressApp.use('/photo', express.static(thumbnailsPath));
  expressApp.use(express.static(publicPath));

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // NestJS 앱 생성 후에도 정적 파일 서빙 확인
  console.log('정적 파일 서빙 활성화됨:', publicPath);

  // CORS 설정 (환경 변수 또는 기본값)
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api');

  // 전역 Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

