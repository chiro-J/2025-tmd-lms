import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../mocks';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../layout/Header';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [userType, setUserType] = useState<'student' | 'instructor' | 'admin' | 'sub-admin'>('student');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = authenticateUser(formData.username, formData.password);

    if (user) {
      // Check if user role matches selected login type
      if (userType === 'instructor' && user.role !== 'instructor') {
        setError('강의자 계정이 아닙니다.');
        return;
      }
      if (userType === 'student' && user.role !== 'student') {
        setError('수강생 계정이 아닙니다.');
        return;
      }

      // Use AuthContext login
      login(user);
      
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
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    alert('Google OAuth는 아직 구현되지 않았습니다.');
  };

  const handleKakaoLogin = () => {
    console.log('Kakao login clicked');
    alert('Kakao OAuth는 아직 구현되지 않았습니다.');
  };

  // 빠른 로그인 함수들
  const handleQuickLogin = (role: 'student' | 'instructor' | 'admin' | 'subadmin') => {
    let username = '';
    let password = '';
    let redirectPath = '';

    switch (role) {
      case 'student':
        username = 'student1';
        password = 'pass1234';
        redirectPath = '/student/dashboard';
        break;
      case 'instructor':
        username = 'instructor1';
        password = 'pass1234';
        redirectPath = '/instructor/dashboard';
        break;
      case 'admin':
        username = 'admin';
        password = 'admin1234';
        redirectPath = '/admin/master-dashboard';
        break;
      case 'subadmin':
        username = 'subadmin';
        password = 'sub123';
        redirectPath = '/admin/sub-dashboard';
        break;
    }

    const user = authenticateUser(username, password);
    if (user) {
      // Use AuthContext login
      login(user);
      navigate(redirectPath);
    } else {
      alert('빠른 로그인에 실패했습니다.');
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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">아이디</label>
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
            className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
          >
            {userType === 'student' ? '수강생 로그인' : 
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
              className="px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              수강생 로그인
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('instructor')}
              className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
            >
              강의자 로그인
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
            >
              마스터 관리자 로그인
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('subadmin')}
              className="px-4 py-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
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

