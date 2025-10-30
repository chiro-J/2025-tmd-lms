import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, Bell, Home, BookOpen, ClipboardList, Users, Settings, MessageCircle, FileText, HelpCircle, Edit3 } from 'lucide-react'

interface CourseSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  currentCourse?: {
    id: string;
    title: string;
    status: string;
  };
}

export default function CourseSidebar({ isCollapsed, onToggleCollapse, currentCourse }: CourseSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['curriculum', 'students', 'exams', 'community', 'settings'])
  const location = useLocation()

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    )
  }


  return (
    <div className="w-64 bg-base-100 border-r border-base-300 min-h-screen">
      <div className="p-6">
        {/* Course Title */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-base-content mb-2">(1회차) 풀스택 과정</h2>
          <p className="text-sm text-gray-900">• 비공개</p>
        </div>

        <nav className="space-y-2">
          <Link to="#" className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium">
            <Bell className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">알림</span>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">0</span>
          </Link>

          <Link to={`/instructor/course/1/home`} className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
            location.pathname === '/instructor/course/1/home'
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-900 hover:bg-gray-100'
          }`}>
            <Home className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">강좌 홈</span>
          </Link>

          {/* 교육 과정 */}
          <div>
            <button
              onClick={() => toggleMenu('curriculum')}
              className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium w-full"
            >
              <BookOpen className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">교육 과정</span>
              {expandedMenus.includes('curriculum') ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
            {expandedMenus.includes('curriculum') && (
              <div className="ml-6 mt-2 space-y-1">
                <Link to="/instructor/course/1/edit" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/edit'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  교육 과정 편집
                </Link>
                <Link to="/instructor/course/1/info" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/info'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  강좌 정보 편집
                </Link>
                <Link to="/instructor/course/1/resources" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/resources'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  강의 자료 관리
                </Link>
              </div>
            )}
          </div>

          {/* 시험 관리 */}
          <div>
            <button
              onClick={() => toggleMenu('exams')}
              className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium w-full"
            >
              <ClipboardList className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">시험 관리</span>
              {expandedMenus.includes('exams') ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
            {expandedMenus.includes('exams') && (
              <div className="ml-6 mt-2 space-y-1">
                <Link to="/instructor/course/1/exams" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/exams'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  전체 시험
                </Link>
                <Link to="/instructor/course/1/create-exam" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/create-exam'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  시험 문제
                </Link>
                <Link to="/instructor/course/1/proctoring" className="block px-4 py-2 text-sm text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded">
                  실시간 감독
                </Link>
                <Link to="/instructor/course/1/results" className="block px-4 py-2 text-sm text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded">
                  결과 분석
                </Link>
                <Link to="/instructor/course/1/grade-report" className="block px-4 py-2 text-sm text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded">
                  성적 보고서 만들기
                </Link>
              </div>
            )}
          </div>

          {/* 커뮤니티 */}
          <div>
            <button
              onClick={() => toggleMenu('community')}
              className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium w-full"
            >
              <MessageCircle className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">커뮤니티</span>
              {expandedMenus.includes('community') ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
            {expandedMenus.includes('community') && (
              <div className="ml-6 mt-2 space-y-1">
                <Link to="/instructor/course/1/notices" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/notices'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  공지 관리
                </Link>
                <Link to="/instructor/course/1/qna" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/qna'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  Q&A 관리
                </Link>
                <Link to="/instructor/course/1/reviews" className="block px-4 py-2 text-sm text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded">
                  후기 관리
                </Link>
              </div>
            )}
          </div>

          {/* 수강자 관리 */}
          <div>
            <button
              onClick={() => toggleMenu('students')}
              className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium w-full"
            >
              <Users className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">수강자 관리</span>
              {expandedMenus.includes('students') ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
            {expandedMenus.includes('students') && (
              <div className="ml-6 mt-2 space-y-1">
                <Link to="/instructor/course/1/students" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/students'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  전체 수강자
                </Link>
                <Link to="/instructor/course/1/achievement" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/achievement'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  성취도 분석
                </Link>
              </div>
            )}
          </div>

          {/* 설정 */}
          <div>
            <button
              onClick={() => toggleMenu('settings')}
              className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium w-full"
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">설정</span>
              {expandedMenus.includes('settings') ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
            {expandedMenus.includes('settings') && (
              <div className="ml-6 mt-2 space-y-1">
                {/* 강좌 설정 링크 제거: 강좌 정보 편집과 중복 */}
                <Link to="/instructor/course/1/co-instructors" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/co-instructors'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  공동 강의자 설정
                </Link>
                <Link to="/instructor/course/1/activity" className="block px-4 py-2 text-sm text-gray-900 hover:text-gray-900 hover:bg-gray-100 rounded">
                  활동 내역
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="mt-8 pt-8 border-t border-base-300">
          <Link to="/instructor/dashboard">
            <button className="w-full bg-base-200 hover:bg-base-300 text-base-content px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              강의자 홈 가기
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
