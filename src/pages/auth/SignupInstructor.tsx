import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Check, X } from 'lucide-react';
import Header from '../../layout/Header';
import { sendVerificationCode, verifyCode, registerWithVerification, checkEmailExists, checkPhoneExists } from '../../core/api/auth';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupInstructor() {
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
  const { refreshUserProfile } = useAuth();

  // 실시간 유효성 검사 상태
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    phone: ''
  });
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
    phone: false
  });

  // Debounce를 위한 타이머
  const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});

  // 유효성 검사 함수
  const validateEmail = async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return '이메일을 입력해주세요.';
    if (!emailRegex.test(email)) return '유효한 이메일 형식이 아닙니다.';

    // DB 중복 체크
    try {
      const { exists } = await checkEmailExists(email);
      if (exists) return '이미 사용 중인 이메일입니다.';
    } catch (error) {
      console.error('이메일 중복 체크 실패:', error);
    }

    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return '비밀번호를 입력해주세요.';
    if (password.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.';
    return '';
  };

  const validatePasswordConfirm = (passwordConfirm: string, password: string) => {
    if (!passwordConfirm) return '비밀번호 확인을 입력해주세요.';
    if (passwordConfirm !== password) return '비밀번호가 일치하지 않습니다.';
    return '';
  };

  const validatePhone = async (phone: string) => {
    // 10자리(010-123-4567) 또는 11자리(010-1234-5678) 모두 허용
    const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phone) return '전화번호를 입력해주세요.';

    const cleanPhone = phone.replace(/-/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return '유효한 전화번호 형식이 아닙니다.';
    }

    if (!phoneRegex.test(phone)) return '유효한 전화번호 형식이 아닙니다.';

    // DB 중복 체크
    try {
      const { exists } = await checkPhoneExists(phone);
      if (exists) return '이미 사용 중인 전화번호입니다.';
    } catch (error) {
      // 네트워크 에러 등은 무시하고 진행 (form submit에서 다시 체크)
      console.error('전화번호 중복 체크 실패:', error);
    }

    return '';
  };

  // 전화번호 자동 하이픈 삽입 (010-123-4567 또는 010-1234-5678)
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      // 3자리 중간번호 (010-123)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      // 3자리 중간번호 (010-123-4567)
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    } else {
      // 4자리 중간번호 (010-1234-5678)
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Focus 이벤트 핸들러 - 필드를 터치한 것으로 표시
  const handleFocus = (field: 'email' | 'password' | 'passwordConfirm' | 'phone') => {
    setTouchedFields({ ...touchedFields, [field]: true });
  };

  // 입력 변경 핸들러 - 실시간 검증
  const handleInputChange = async (field: string, value: string) => {
    // 전화번호는 자동으로 하이픈 삽입
    let formattedValue = value;
    if (field === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData({ ...formData, [field]: formattedValue });

    // 필드를 터치한 것으로 표시
    if (!touchedFields[field as keyof typeof touchedFields]) {
      setTouchedFields({ ...touchedFields, [field]: true });
    }

    // 기존 타이머 제거
    if (debounceTimers[field]) {
      clearTimeout(debounceTimers[field]);
    }

    // 즉시 형식 검증 (빠른 피드백)
    let errorMsg = '';
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMsg = '';  // 빈 값이면 에러 표시 안 함
        } else if (!emailRegex.test(value)) {
          errorMsg = '유효한 이메일 형식이 아닙니다.';
        }
        break;
      case 'password':
        errorMsg = value ? validatePassword(value) : '';
        // 비밀번호 확인도 다시 체크
        if (touchedFields.passwordConfirm && formData.passwordConfirm) {
          setFieldErrors(prev => ({
            ...prev,
            passwordConfirm: validatePasswordConfirm(formData.passwordConfirm, value)
          }));
        }
        break;
      case 'passwordConfirm':
        errorMsg = value ? validatePasswordConfirm(value, formData.password) : '';
        break;
      case 'phone':
        if (!formattedValue) {
          errorMsg = '';  // 빈 값이면 에러 표시 안 함
        } else {
          const cleanPhone = formattedValue.replace(/-/g, '');
          const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
          if (cleanPhone.length < 10 || cleanPhone.length > 11) {
            errorMsg = '유효한 전화번호 형식이 아닙니다.';
          } else if (!phoneRegex.test(formattedValue)) {
            errorMsg = '유효한 전화번호 형식이 아닙니다.';
          }
        }
        break;
    }

    setFieldErrors({ ...fieldErrors, [field]: errorMsg });

    // DB 중복 체크는 debounce 적용 (이메일, 전화번호만)
    if ((field === 'email' || field === 'phone') && value && !errorMsg) {
      const timer = setTimeout(async () => {
        let dbErrorMsg = '';
        if (field === 'email') {
          dbErrorMsg = await validateEmail(value);
        } else if (field === 'phone') {
          dbErrorMsg = await validatePhone(formattedValue);
        }
        setFieldErrors(prev => ({ ...prev, [field]: dbErrorMsg }));
      }, 150);  // 150ms 대기 후 DB 체크

      setDebounceTimers({ ...debounceTimers, [field]: timer });
    }
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 모든 필드 유효성 검사
    const emailError = await validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const passwordConfirmError = validatePasswordConfirm(formData.passwordConfirm, formData.password);
    const phoneError = await validatePhone(formData.phone);

    setFieldErrors({
      email: emailError,
      password: passwordError,
      passwordConfirm: passwordConfirmError,
      phone: phoneError
    });

    setTouchedFields({
      email: true,
      password: true,
      passwordConfirm: true,
      phone: true
    });

    // 에러가 있으면 제출 중단
    if (emailError || passwordError || passwordConfirmError || phoneError) {
      setError('입력 내용을 확인해주세요.');
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

      // 회원가입 (이미 토큰 포함)
      const result = await registerWithVerification({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        username,
        phone: formData.phone,
        role: 'instructor',
      });

      // 회원가입 응답에서 받은 토큰으로 직접 로그인 처리
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('isLoggedIn', 'true');

      // AuthContext 상태 업데이트
      await refreshUserProfile();

      alert('회원가입이 완료되었습니다. 관리자 승인을 기다려주세요.');
      navigate('/signup/pending');
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

  const handleGoogleSignup = () => {
    alert('Google OAuth는 아직 구현되지 않았습니다.');
  };

  const handleKakaoSignup = () => {
    alert('Kakao OAuth는 아직 구현되지 않았습니다.');
  };

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
                  className="w-12 h-14 text-center text-xl font-semibold bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              ))}
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
              disabled={isLoading || isVerified}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리 중...' : isVerified ? '인증 완료' : '인증 완료'}
            </button>

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
          강의자 회원가입
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
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.querySelector<HTMLInputElement>('input[type="password"]')?.focus();
                    }
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${
                    touchedFields.email
                      ? fieldErrors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {touchedFields.email && formData.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {fieldErrors.email ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {touchedFields.email && fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요 (최소 6자)"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => handleFocus('password')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const inputs = document.querySelectorAll<HTMLInputElement>('input[type="password"]');
                      inputs[1]?.focus();
                    }
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${
                    touchedFields.password
                      ? fieldErrors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {touchedFields.password && formData.password && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {fieldErrors.password ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {touchedFields.password && fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.passwordConfirm}
                  onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                  onFocus={() => handleFocus('passwordConfirm')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
                    }
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${
                    touchedFields.passwordConfirm
                      ? fieldErrors.passwordConfirm
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {touchedFields.passwordConfirm && formData.passwordConfirm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {fieldErrors.passwordConfirm ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {touchedFields.passwordConfirm && fieldErrors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.passwordConfirm}</p>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.querySelector<HTMLInputElement>('input[type="tel"]')?.focus();
                    }
                  }}
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
                  placeholder="전화번호를 입력하세요 (010-1234-5678)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onFocus={() => handleFocus('phone')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmitStep1(e as any);
                    }
                  }}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition-colors ${
                    touchedFields.phone
                      ? fieldErrors.phone
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-green-500 focus:ring-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {touchedFields.phone && formData.phone && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {fieldErrors.phone ? (
                      <X className="w-5 h-5 text-red-500" />
                    ) : (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {touchedFields.phone && fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
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
