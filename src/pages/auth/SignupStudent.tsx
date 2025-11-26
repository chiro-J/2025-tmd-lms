import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, CheckCircle, XCircle } from 'lucide-react';
import Header from '../../layout/Header';
import { sendVerificationCode, verifyCode, registerWithVerification, checkEmail, checkPhone } from '../../core/api/auth';

export default function SignupStudent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: ''
  });
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState<{
    match: boolean | null;
    message: string;
  }>({ match: null, message: '' });

  // 유효성 검사 상태
  const [emailValidation, setEmailValidation] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });
  const [phoneValidation, setPhoneValidation] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 이메일 유효성 검사
    if (emailValidation.available === false) {
      setError('이미 사용 중인 이메일입니다.');
      return;
    }

    if (emailValidation.checking) {
      setError('이메일 중복 확인 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 전화번호 유효성 검사
    if (phoneValidation.available === false) {
      setError('이미 사용 중인 전화번호입니다.');
      return;
    }

    if (phoneValidation.checking) {
      setError('전화번호 중복 확인 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    try {
      await sendVerificationCode(formData.email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || '인증 코드 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    setError('');

    if (code.length !== 6) {
      setError('인증 코드를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 인증 코드 검증
      await verifyCode(formData.email, code);
      setIsVerified(true);

      // 사용자명 자동 생성 (이메일 앞부분)
      const username = formData.email.split('@')[0];

      // 회원가입
      await registerWithVerification({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        username,
        phone: formData.phone,
        role: 'student',
      });

      // 성공 페이지로 이동
      setStep(3);
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || '인증 또는 회원가입에 실패했습니다.');
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsLoading(true);
    try {
      await sendVerificationCode(formData.email);
      alert('인증 코드를 재전송했습니다.');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || '인증 코드 재전송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, ''); // 숫자만 추출

    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setVerificationCode(newCode);

      // 마지막 입력칸으로 포커스 이동
      const lastInput = document.getElementById('code-5');
      lastInput?.focus();
    }
  };

  // 이메일 유효성 검사 (debounce)
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      setEmailValidation({ checking: false, available: null });
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setEmailValidation({ checking: false, available: null });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setEmailValidation({ checking: true, available: null });
      try {
        const result = await checkEmail(formData.email);
        setEmailValidation({ checking: false, available: result.available });
      } catch (error) {
        setEmailValidation({ checking: false, available: false });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  // 전화번호 유효성 검사 (debounce)
  useEffect(() => {
    const phoneRegex = /^[0-9-+\s()]+$/;

    if (!formData.phone) {
      setPhoneValidation({ checking: false, available: null });
      return;
    }

    if (!phoneRegex.test(formData.phone) || formData.phone.length < 10) {
      setPhoneValidation({ checking: false, available: null });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setPhoneValidation({ checking: true, available: null });
      try {
        const result = await checkPhone(formData.phone);
        setPhoneValidation({ checking: false, available: result.available });
      } catch (error) {
        setPhoneValidation({ checking: false, available: false });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.phone]);

  const handleGoogleSignup = () => {
    alert('Google OAuth는 아직 구현되지 않았습니다.');
  };

  const handleKakaoSignup = () => {
    alert('Kakao OAuth는 아직 구현되지 않았습니다.');
  };

  // 비밀번호 확인 실시간 검증
  useEffect(() => {
    if (!formData.passwordConfirm) {
      setPasswordMatch({ match: null, message: '' });
      return;
    }

    if (formData.password.length < 6) {
      setPasswordMatch({ match: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' });
      return;
    }

    if (formData.password === formData.passwordConfirm) {
      setPasswordMatch({ match: true, message: '비밀번호가 일치합니다.' });
    } else {
      setPasswordMatch({ match: false, message: '비밀번호가 일치하지 않습니다.' });
    }
  }, [formData.password, formData.passwordConfirm]);

  // 회원가입 성공 페이지
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            회원가입이 완료되었습니다!
          </h1>
          <p className="text-gray-600 mb-8">
            {formData.name}님, 환영합니다!<br />
            로그인하여 LMS의 모든 기능을 이용하실 수 있습니다.
          </p>

          {/* Login Button */}
          <button
            onClick={() => navigate('/login')}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center p-4 pt-20">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-2xl font-bold text-white">LMS</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
            이메일 인증
          </h1>
          <p className="text-center text-gray-600 mb-8">
            인증 코드를 입력하세요
          </p>

          {/* Verification Instructions */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold mb-4">코드를 이메일로 보냈습니다</h2>
            <p className="text-sm text-gray-600 mb-2">
              계정 설정을 완료하려면 다음 주소로<br />
              보내드린 코드를 입력하세요:
            </p>
            <p className="text-sm font-medium text-blue-600">
              {formData.email}
            </p>
          </div>

          {/* Verification Code Inputs */}
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onPaste={handleCodePaste}
                  className="w-12 h-14 text-center text-xl font-semibold bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isVerified}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : isVerified ? '인증 완료' : '인증 완료'}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Resend Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400"
              >
                이메일을 받지 못하셨나요? 다시 보내기
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                구글로 회원가입
              </button>
              <button
                type="button"
                onClick={handleKakaoSignup}
                className="w-full px-4 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#000000" d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11L6.75 21.75c-.5.5-1.5.5-2 0s-.5-1.5 0-2l3.5-3.5c-3.5-1.5-6-4.5-6-8.065C3 6.664 7.201 3 12 3z"/>
                </svg>
                카카오로 회원가입
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center p-4 pt-20">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="bg-black px-8 py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
          >
            <span className="text-2xl font-bold text-white">LMS</span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
          수강생 회원가입
        </h1>
        <p className="text-center text-gray-600 mb-8">
          이메일로 회원가입하세요
        </p>

        {/* Form */}
        <form onSubmit={handleSubmitStep1} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                    emailValidation.available === true
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : emailValidation.available === false
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {emailValidation.checking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {!emailValidation.checking && emailValidation.available === true && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {!emailValidation.checking && emailValidation.available === false && formData.email && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {emailValidation.available === false && formData.email && (
                <p className="mt-1 text-sm text-red-600">이미 사용 중인 이메일입니다.</p>
              )}
              {emailValidation.available === true && formData.email && (
                <p className="mt-1 text-sm text-green-600">사용 가능한 이메일입니다.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                    passwordMatch.match === true
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : passwordMatch.match === false
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {passwordMatch.match === true && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {passwordMatch.match === false && formData.passwordConfirm && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {passwordMatch.message && (
                <p className={`mt-1 text-sm ${
                  passwordMatch.match === true ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passwordMatch.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="전화번호를 입력하세요"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                    phoneValidation.available === true
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : phoneValidation.available === false
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {phoneValidation.checking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {!phoneValidation.checking && phoneValidation.available === true && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
                {!phoneValidation.checking && phoneValidation.available === false && formData.phone && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                )}
              </div>
              {phoneValidation.available === false && formData.phone && (
                <p className="mt-1 text-sm text-red-600">이미 사용 중인 전화번호입니다.</p>
              )}
              {phoneValidation.available === true && formData.phone && (
                <p className="mt-1 text-sm text-green-600">사용 가능한 전화번호입니다.</p>
              )}
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-600 text-center py-2">
            가입하면 LMS 이용 약관에 동의하고<br />
            개인정보 보호정책을 인정한 것으로 간주됩니다
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              구글로 회원가입
            </button>
            <button
              type="button"
              onClick={handleKakaoSignup}
              className="w-full px-4 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#000000" d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11L6.75 21.75c-.5.5-1.5.5-2 0s-.5-1.5 0-2l3.5-3.5c-3.5-1.5-6-4.5-6-8.065C3 6.664 7.201 3 12 3z"/>
              </svg>
              카카오로 회원가입
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8">
          <span className="text-sm text-gray-600">이미 계정이 있으신가요? </span>
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            로그인
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
