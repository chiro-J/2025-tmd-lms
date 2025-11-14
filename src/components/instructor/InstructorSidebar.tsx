import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PlusCircle, Users, Home, User, ChevronDown, ChevronRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function InstructorSidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const [isIntroductionMenuExpanded, setIsIntroductionMenuExpanded] = useState(true)

  // 현재 경로에 따라 활성 상태 결정
  const isDashboard = location.pathname === '/instructor/dashboard'
  const isIntroductionPreview = location.pathname === '/instructor/introduction/preview'
  const isIntroduction = location.pathname === '/instructor/introduction'

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        {/* Profile Section */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-800 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-lg text-gray-900 mb-1">{user?.name || '강의자'}</h2>
          <p className="text-xs text-gray-600 mb-4">강의자님, 안녕하세요!</p>

          {/* Create Course Button */}
          <Link
            to="/instructor/create"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs flex items-center justify-center space-x-1 transition-colors shadow-lg"
          >
            <PlusCircle className="h-3 w-3" />
            <span>강좌 만들기</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <Link
            to="/instructor/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
              isDashboard
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>강의자 홈</span>
          </Link>

          {/* 강의자 소개 관리 그룹 */}
          <div>
            <button
              onClick={() => setIsIntroductionMenuExpanded(!isIntroductionMenuExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition-colors"
            >
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4" />
                <span>강의자 소개 관리</span>
              </div>
              {isIntroductionMenuExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {isIntroductionMenuExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  to="/instructor/introduction/preview"
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isIntroductionPreview
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span>소개 미리보기</span>
                </Link>
                <Link
                  to="/instructor/introduction"
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                    isIntroduction
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span>소개 편집</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}



