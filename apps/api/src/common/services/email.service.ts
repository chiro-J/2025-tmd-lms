import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private isDevelopment: boolean;

  constructor(private configService: ConfigService) {
    this.isDevelopment = this.configService.get<string>('NODE_ENV') !== 'production';

    if (this.isDevelopment) {
      // 개발 모드: Ethereal 테스트 계정 또는 콘솔 출력
      this.setupDevelopmentTransporter();
    } else {
      // 프로덕션 모드: 실제 SMTP 설정
      this.setupProductionTransporter();
    }
  }

  private async setupDevelopmentTransporter() {
    try {
      // Ethereal 테스트 계정 생성 (자동)
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.logger.log('Ethereal 테스트 이메일 서비스 초기화 완료');
      this.logger.log(`테스트 계정: ${testAccount.user}`);
    } catch (error) {
      // Ethereal 실패 시 콘솔 출력 모드
      this.logger.warn('Ethereal 계정 생성 실패, 콘솔 출력 모드로 전환');
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    }
  }

  private setupProductionTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const smtpPort = this.configService.get<number>('SMTP_PORT') || 587;
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (!smtpUser || !smtpPass) {
      this.logger.error('SMTP 설정이 없습니다. SMTP_USER와 SMTP_PASS를 설정해주세요.');
      throw new Error('SMTP configuration is missing');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    this.logger.log(`프로덕션 SMTP 서비스 초기화 완료: ${smtpHost}:${smtpPort}`);
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: this.isDevelopment
        ? 'noreply@lms-test.com'
        : this.configService.get<string>('SMTP_USER'),
      to: email,
      subject: '[LMS] 이메일 인증 코드',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">이메일 인증</h2>
          <p style="color: #666; font-size: 16px;">안녕하세요,</p>
          <p style="color: #666; font-size: 16px;">
            아래 인증 코드를 입력하여 이메일 인증을 완료해주세요.
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
            <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 8px; margin: 0;">
              ${code}
            </h1>
          </div>
          <p style="color: #999; font-size: 14px;">
            이 코드는 10분간 유효하며, 최대 5회까지 시도할 수 있습니다.
          </p>
          <p style="color: #999; font-size: 14px;">
            본인이 요청한 것이 아니라면 이 이메일을 무시하셔도 됩니다.
          </p>
        </div>
      `,
      text: `인증 코드: ${code}\n\n이 코드는 10분간 유효합니다.`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);

      if (this.isDevelopment) {
        // 개발 모드에서는 항상 인증 코드를 콘솔에 출력
        this.logger.log(`========================================`);
        this.logger.log(`[개발 모드] 이메일 인증 코드`);
        this.logger.log(`수신자: ${email}`);
        this.logger.log(`인증 코드: ${code}`);
        this.logger.log(`========================================`);

        // Ethereal URL도 함께 출력
        if (info.messageId) {
          const previewUrl = nodemailer.getTestMessageUrl(info);
          if (previewUrl) {
            this.logger.log(`이메일 미리보기 URL: ${previewUrl}`);
          }
        }
      } else {
        this.logger.log(`인증 코드 이메일 전송 완료: ${email}`);
      }
    } catch (error) {
      this.logger.error(`이메일 전송 실패: ${error.message}`, error.stack);
      throw new Error('이메일 전송에 실패했습니다.');
    }
  }
}

