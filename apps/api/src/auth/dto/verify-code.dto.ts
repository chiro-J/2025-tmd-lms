import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyCodeDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email: string;

  @IsString()
  @Length(6, 6, { message: '인증 코드는 6자리여야 합니다.' })
  code: string;
}









