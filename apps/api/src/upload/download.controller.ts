import { Controller, Get, Param, Res, NotFoundException, Query } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('download')
export class DownloadController {
  // public 폴더 경로
  private readonly publicPath = path.join(process.cwd(), '..', 'public');

  @Get('notices/:filename')
  async downloadNoticeFile(
    @Param('filename') filename: string,
    @Query('originalname') originalname: string | undefined,
    @Res() res: Response
  ) {
    const filePath = path.join(this.publicPath, 'notices', filename);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    // originalname이 쿼리 파라미터로 제공되면 사용, 없으면 filename 사용
    const downloadName = originalname || filename;
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadName)}"`);
    res.sendFile(path.resolve(filePath));
  }

  @Get('inquiries/:filename')
  async downloadInquiryFile(
    @Param('filename') filename: string,
    @Query('originalname') originalname: string | undefined,
    @Res() res: Response
  ) {
    const filePath = path.join(this.publicPath, 'inquiries', filename);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    // originalname이 쿼리 파라미터로 제공되면 사용, 없으면 filename 사용
    const downloadName = originalname || filename;
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadName)}"`);
    res.sendFile(path.resolve(filePath));
  }
}

