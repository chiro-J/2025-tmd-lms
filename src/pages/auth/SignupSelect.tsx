import { useNavigate } from 'react-router-dom';
import { User, BookOpen } from 'lucide-react';
import Header from '../../layout/Header';

export default function SignupSelect() {
  const navigate = useNavigate();

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
          회원가입
        </h1>
        <p className="text-center text-gray-600 mb-8">
          가입 유형을 선택하세요
        </p>

        {/* Selection Cards */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/signup/student')}
            className="w-full p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 flex items-center space-x-4 group"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">수강생 회원가입</h3>
              <p className="text-sm text-gray-600">강의를 수강하고 학습하세요</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/signup/instructor')}
            className="w-full p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 flex items-center space-x-4 group"
          >
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">강의자 회원가입</h3>
              <p className="text-sm text-gray-600">강의를 만들고 관리하세요</p>
            </div>
          </button>
        </div>

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
