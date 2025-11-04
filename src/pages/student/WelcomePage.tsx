import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { BookOpen, Key, UserPlus, LogIn } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function WelcomePage() {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()

  // 로그인 상태 확인 및 리다이렉트
  if (isLoggedIn && user) {
    // 수강 코드가 있는지 확인 (임시 로직 - 실제로는 API에서 확인)
    const hasEnrollmentCode = localStorage.getItem('enrollmentCode')
    // 등록된 강의가 있는지 확인 (localStorage 또는 API에서 확인)
    const hasEnrolledCourses = localStorage.getItem('enrolledCourses')
    
    if (hasEnrollmentCode || hasEnrolledCourses) {
      // 수강 코드가 있거나 등록된 강의가 있으면 대시보드로 리다이렉트
      navigate('/student/dashboard')
      return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              학습 관리 시스템에 오신 것을 환영합니다
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              수강 코드를 입력하거나 회원가입하여 강의를 시작하세요
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* 수강 코드 입력 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">수강 코드 입력</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                강의자로부터 받은 수강 코드를 입력하여 <br />강의에 등록하세요.
              </p>
              {isLoggedIn ? (
                <Button
                  onClick={() => navigate('/student/dashboard')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                >
                  대시보드에서 코드 입력하기
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                >
                  로그인 후 코드 입력하기
                </Button>
              )}
            </div>

            {/* 회원가입 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">회원가입</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                새 계정을 만들어 학습을 시작하세요.
              </p>
              <Button
                onClick={() => navigate('/signup')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
              >
                회원가입하기
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">주요 기능</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">다양한 강의자료</h3>
                <p className="text-sm text-gray-600">
                  강의 내용과 관련된 자료를 <br />확인할 수 있습니다
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Key className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">간편한 등록</h3>
                <p className="text-sm text-gray-600">
                  수강 코드만으로 빠르게 강의에 등록하세요
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">학습 추적</h3>
                <p className="text-sm text-gray-600">
                  학습 일정과 진도를 한눈에 확인하세요
                </p>
              </div>
            </div>
          </div>

          {/* Login Section */}
          {!isLoggedIn && (
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">이미 계정이 있으신가요?</p>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium"
              >
                로그인
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

