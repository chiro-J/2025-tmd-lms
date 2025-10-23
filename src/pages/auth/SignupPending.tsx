import { useNavigate } from 'react-router-dom';
import { Hourglass, CheckCircle } from 'lucide-react';
import Header from '../../layout/Header';

export default function SignupPending() {
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

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Hourglass className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
          강의자 신청 완료
        </h1>
        <p className="text-center text-gray-600 mb-8">
          관리자 승인을 기다리고 있습니다
        </p>

        {/* Message */}
        <div className="text-center space-y-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">회원가입이 완료되었습니다</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>관리자 승인 후 강의자 권한이 부여됩니다.</p>
            <p>승인에는 최대 1일이 소요될 수 있습니다.</p>
            <p className="font-medium text-gray-800">승인이 완료되면 가입하신<br />이메일로 안내드리겠습니다.</p>
          </div>
        </div>

        {/* Back to Login Button */}
        <button
          onClick={() => navigate('/login')}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
        >
          로그인 화면으로 돌아가기
        </button>
        </div>
      </div>
    </div>
  );
}
