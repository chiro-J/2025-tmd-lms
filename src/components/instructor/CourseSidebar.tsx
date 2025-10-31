import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, Bell, Home, BookOpen, ClipboardList, Users, Settings, MessageCircle, FileText, HelpCircle, Edit3 } from 'lucide-react'
import { mockInstructorNotifications } from '../../mocks'
import type { Notification } from '../../types'

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
  const [showNotificationMenu, setShowNotificationMenu] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setNotifications(mockInstructorNotifications)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showNotificationMenu && !target.closest('[data-notification-menu]')) {
        setShowNotificationMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotificationMenu])

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    setShowNotificationMenu(false)

    if (notification.link) {
      navigate(notification.link)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return '📝'
      case 'exam':
        return '📋'
      case 'question':
        return '❓'
      case 'review':
        return '⭐'
      case 'notice':
        return '📢'
      case 'announcement':
        return '🔔'
      default:
        return '🔔'
    }
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
          <div className="relative" data-notification-menu>
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg font-medium w-full"
            >
              <Bell className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 text-left">알림</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="absolute left-full ml-2 top-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                {/* 헤더 */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">알림</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-gray-500">{unreadCount}개의 읽지 않은 알림</span>
                  )}
                </div>

                {/* 알림 목록 */}
                <div className="overflow-y-auto max-h-80">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      알림이 없습니다
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-lg flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-sm font-medium truncate ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 푸터 */}
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    모두 읽음 처리
                  </button>
                </div>
              </div>
            )}
          </div>

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
                <Link to="/instructor/course/1/assignments" className={`block px-4 py-2 text-sm rounded ${
                  location.pathname === '/instructor/course/1/assignments'
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-900 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                  과제 관리
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
