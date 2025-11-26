import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { RegisterWithVerificationDto } from './dto/register-with-verification.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      console.error('Login controller error:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    try {
      const userId = req.user?.userId || req.user?.sub || req.user?.id;
      if (!userId) {
        throw new UnauthorizedException('User ID not found in token');
      }
      return await this.authService.getProfile(userId);
    } catch (error) {
      console.error('getProfile controller error:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    // JWT는 stateless이므로 클라이언트에서 토큰을 삭제하면 됨
    return { message: 'Logged out successfully' };
  }

  // ========== 이메일 인증 관련 엔드포인트 ==========

  @Post('send-verification-code')
  async sendVerificationCode(@Body() dto: SendVerificationCodeDto) {
    return this.authService.sendVerificationCode(dto.email);
  }

  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto.email, dto.code);
  }

  @Post('register-with-verification')
  async registerWithVerification(@Body() dto: RegisterWithVerificationDto) {
    try {
      return await this.authService.registerWithVerification(dto);
    } catch (error) {
      console.error('registerWithVerification controller error:', error);
      throw error;
    }
  }

  // ========== 중복 체크 관련 엔드포인트 ==========

  @Post('check-email')
  async checkEmail(@Body() body: { email: string }) {
    const exists = await this.authService.checkEmailExists(body.email);
    return { exists, available: !exists };
  }

  @Post('check-phone')
  async checkPhone(@Body() body: { phone: string }) {
    const exists = await this.authService.checkPhoneExists(body.phone);
    return { exists, available: !exists };
  }

}
