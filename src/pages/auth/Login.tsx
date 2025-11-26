import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../layout/Header';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [userType, setUserType] = useState<'student' | 'instructor' | 'admin' | 'sub-admin'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);

      // Check if user role matches selected login type
      if (userType === 'instructor' && user.role !== 'instructor') {
        setError('강의자 계정이 아닙니다.');
        setIsLoading(false);
        return;
      }
      if (userType === 'student' && user.role !== 'student') {
        setError('수강생 계정이 아닙니다.');
        setIsLoading(false);
        return;
      }
      if (userType === 'admin' && user.role !== 'admin') {
        setError('관리자 계정이 아닙니다.');
        setIsLoading(false);
        return;
      }
      if (userType === 'sub-admin' && user.role !== 'sub-admin') {
        setError('서브 관리자 계정이 아닙니다.');
        setIsLoading(false);
        return;
      }

      // navigate to appropriate dashboard based on role
      if (user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/master-dashboard');
      } else if (user.role === 'sub-admin') {
        navigate('/admin/sub-dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error: any) {
      let errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';

      // 네트워크 에러 확인
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.\n\n터미널에서 다음 명령어로 백엔드를 실행하세요:\ncd apps/api && npm run start:dev';
      } else if (error.response?.status === 401) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    alert('Google OAuth는 아직 구현되지 않았습니다.');
  };

  const handleKakaoLogin = () => {
    alert('Kakao OAuth는 아직 구현되지 않았습니다.');
  };

  // 빠른 로그인 함수들
  const handleQuickLogin = async (role: 'student' | 'instructor' | 'admin' | 'subadmin') => {
    let email = '';
    let password = '';

    switch (role) {
      case 'student':
        email = 'student@example.com';
        password = 'pass1234';
        break;
      case 'instructor':
        email = 'instructor@example.com';
        password = 'pass1234';
        break;
      case 'admin':
        email = 'admin@example.com';
        password = 'admin1234';
        break;
      case 'subadmin':
        email = 'subadmin@example.com';
        password = 'sub123';
        break;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await login(email, password);

      // 사용자 역할에 따라 올바른 경로로 리다이렉트
      if (user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/master-dashboard');
      } else if (user.role === 'sub-admin') {
        navigate('/admin/sub-dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error: any) {
      let errorMessage = '빠른 로그인에 실패했습니다.';

      // 네트워크 에러 확인
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.\n\n터미널에서 다음 명령어로 백엔드를 실행하세요:\ncd apps/api && npm run start:dev';
      } else if (error.response?.status === 401) {
        const backendMessage = error.response?.data?.message || error.message || '';
        if (backendMessage.includes('Invalid credentials') || backendMessage.includes('이메일') || backendMessage.includes('비밀번호')) {
          errorMessage = `빠른 로그인 실패: ${email} 계정이 DB에 없거나 비밀번호가 일치하지 않습니다.\n\n해결 방법:\n1. DB에 해당 계정이 있는지 확인하세요\n2. 비밀번호가 올바르게 해시화되어 있는지 확인하세요\n3. 회원가입을 통해 새 계정을 생성하세요`;
        } else {
          errorMessage = `이메일 또는 비밀번호가 올바르지 않습니다.\n\n시도한 계정: ${email}`;
        }
      } else if (error.response?.status === 404) {
        errorMessage = `해당 계정이 존재하지 않습니다.\n\n시도한 계정: ${email}\n\n회원가입을 통해 새 계정을 생성하세요.`;
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

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
          로그인
        </h1>
        <p className="text-center text-gray-600 mb-6">
          계정에 로그인하세요
        </p>

        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setUserType('student')}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              userType === 'student'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            수강생
          </button>
          <button
            type="button"
            onClick={() => setUserType('instructor')}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              userType === 'instructor'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            강의자
          </button>
          <button
            type="button"
            onClick={() => setUserType('admin')}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              userType === 'admin'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            마스터 관리자
          </button>
          <button
            type="button"
            onClick={() => setUserType('sub-admin')}
            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              userType === 'sub-admin'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            서브 관리자
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' :
              userType === 'student' ? '수강생 로그인' :
              userType === 'instructor' ? '강의자 로그인' :
              userType === 'admin' ? '마스터 관리자 로그인' : '서브 관리자 로그인'}
          </button>

          {/* Signup Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600">계정이 없으신가요? </span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              회원가입
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">빠른 로그인</span>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={isLoading}
              className="px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              수강생 로그인
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('instructor')}
              disabled={isLoading}
              className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              강의자 로그인
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={isLoading}
              className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              마스터 관리자 로그인
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('subadmin')}
              disabled={isLoading}
              className="px-4 py-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              서브 관리자 로그인
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

          {/* OAuth Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              구글로 로그인
            </button>

            <button
              type="button"
              onClick={handleKakaoLogin}
              className="w-full px-4 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#000000" d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11L6.75 21.75c-.5.5-1.5.5-2 0s-.5-1.5 0-2l3.5-3.5c-3.5-1.5-6-4.5-6-8.065C3 6.664 7.201 3 12 3z"/>
              </svg>
              카카오로 로그인
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
