import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';

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

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send verification code to email
    console.log('Sending verification code to:', formData.email);
    setStep(2);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    console.log('Verification code:', code);
    // TODO: Verify code and complete signup
    // Navigate to pending approval page
    navigate('/signup/pending');
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
          <h1 className="text-center text-xl font-semibold mb-8">
            강의자 회원가입
          </h1>

          {/* Verification Instructions */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold mb-4">코드를 이메일로 보냈습니다</h2>
            <p className="text-sm text-gray-700 mb-2">
              계정 설정을 완료하려면 다음 주소로<br />
              보내드린 코드를 입력하세요:
            </p>
            <p className="text-sm font-medium text-gray-800">
              {formData.email}
            </p>
          </div>

          {/* Verification Code Inputs */}
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-14 text-center text-xl font-semibold bg-white rounded-lg border-0 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
            >
              확인
            </button>

            {/* Resend Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => alert('인증코드를 재전송했습니다.')}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                이메일을 받지 못하셨나요? 이메일 다시 보내기
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-400"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-300 text-gray-600">
                  또는 다음을 사용하여 회원가입
                </span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                구글 아이디로 회원가입
              </button>
              <button
                type="button"
                onClick={handleKakaoSignup}
                className="w-full px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                카카오 아이디로 회원가입
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
        <h1 className="text-center text-xl font-semibold mb-2">
          강의자 회원가입
        </h1>

        {/* Subtitle */}
        <p className="text-center text-sm text-gray-700 mb-8">
          이메일로 회원가입
        </p>

        {/* Form */}
        <form onSubmit={handleSubmitStep1} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={formData.passwordConfirm}
            onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
            required
            className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />

          <input
            type="text"
            placeholder="이름"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />

          <input
            type="tel"
            placeholder="전화번호"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />

          {/* Terms */}
          <div className="text-xs text-gray-600 text-center py-2">
            가입하면 [LMS서비스명] 이용 약관에 동의하고<br />
            개인정보 보호정책을 인정한 것으로 간주됩니다
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
          >
            가입
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-400"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-300 text-gray-600">
                또는 다음을 사용하여 회원가입
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              구글 아이디로 회원가입
            </button>
            <button
              type="button"
              onClick={handleKakaoSignup}
              className="w-full px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              카카오 아이디로 회원가입
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
