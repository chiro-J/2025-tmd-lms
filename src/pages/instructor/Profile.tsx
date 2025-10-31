import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { GraduationCap, BookOpen, ArrowRight, User } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleRoleSelect = (role: 'instructor' | 'student') => {
    if (role === 'instructor') {
      navigate('/instructor/profile')
    } else {
      navigate('/student/profile')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-base-content">역할 선택</h1>
          <p className="text-gray-600 mt-2">강의자 또는 수강생 역할을 선택하세요</p>
        </div>

        {/* User Info */}
        <div className="mb-8">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{user?.name || '김강사'}</h2>
            <p className="text-gray-600">강의자 계정</p>
          </Card>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleRoleSelect('instructor')}
            className="p-8 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">강의자</h3>
              <p className="text-gray-600 mb-4">강의 생성 및 관리</p>
              <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                <span className="mr-2">강의자 마이페이지로 이동</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('student')}
            className="p-8 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">수강생</h3>
              <p className="text-gray-600 mb-4">강의 수강 및 학습</p>
              <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                <span className="mr-2">수강생 프로필로 이동</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
