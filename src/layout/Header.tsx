import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Bell, User, Menu, LogOut, ChevronDown, GraduationCap, Shield, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { mockNotifications, mockInstructorNotifications } from '../mocks'
import type { Notification } from '../types'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, switchRole } = useAuth()
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const [showNotificationMenu, setShowNotificationMenu] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleRoleSwitch = (role: 'student' | 'instructor' | 'admin' | 'sub-admin') => {
    switchRole(role)
    setShowRoleMenu(false)

    // 권한에 맞는 페이지로 리다이렉트
    switch (role) {
      case 'student':
        navigate('/student/dashboard')
        break
      case 'instructor':
        navigate('/instructor/dashboard')
        break
      case 'admin':
        navigate('/admin/master-dashboard')
        break
      case 'sub-admin':
        navigate('/admin/sub-dashboard')
        break
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'student':
        return { label: '수강생', icon: GraduationCap, color: 'text-blue-600' }
      case 'instructor':
        return { label: '강의자', icon: User, color: 'text-green-600' }
      case 'admin':
        return { label: '마스터 관리자', icon: Shield, color: 'text-red-600' }
      case 'sub-admin':
        return { label: '서브관리자', icon: Users, color: 'text-purple-600' }
      default:
        return { label: '사용자', icon: User, color: 'text-gray-600' }
    }
  }

  const roleInfo = user ? getRoleInfo(user.role) : null

  // 알림 데이터 로드
  useEffect(() => {
    if (user) {
      if (user.role === 'instructor') {
        setNotifications(mockInstructorNotifications)
      } else {
        setNotifications(mockNotifications)
      }
    }
  }, [user])

  // 외부 클릭 시 드롭다운 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showRoleMenu && !target.closest('[data-role-menu]')) {
        setShowRoleMenu(false)
      }
      if (showNotificationMenu && !target.closest('[data-notification-menu]')) {
        setShowNotificationMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRoleMenu, showNotificationMenu])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notification: Notification) => {
    // 읽음 처리
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    setShowNotificationMenu(false)

    // 링크로 이동
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
    <header className="h-14 bg-base-100 border-b border-base-300 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (isLoggedIn && user) {
                  // 로그인된 사용자는 역할에 맞는 대시보드로 이동
                  switch (user.role) {
                    case 'instructor':
                      navigate('/instructor/dashboard')
                      break
                    case 'admin':
                      navigate('/admin/master-dashboard')
                      break
                    case 'sub-admin':
                      navigate('/admin/sub-dashboard')
                      break
                    default:
                      navigate('/student/dashboard')
                  }
                } else {
                  // 로그인되지 않은 사용자는 환영 페이지로
                  navigate('/welcome')
                }
              }}
              className="flex items-center space-x-3 group"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LMS</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <span className="text-sm text-gray-500 font-medium">학습 관리 시스템</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isAuthPage && isLoggedIn && user && (
              <>
                {user.role === 'student' && (
                  <>
                    <Link
                      to="/student/dashboard"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/student/dashboard')
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      대시보드
                    </Link>
                    <Link
                      to="/student/notice"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/student/notice')
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      시스템 공지사항
                    </Link>
                    <Link
                      to="/student/help"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/student/help')
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      도움말
                    </Link>
                  </>
                )}
                {user.role === 'instructor' && (
                  <>
                    <Link
                      to="/instructor/dashboard"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/instructor/dashboard')
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      대시보드
                    </Link>
                    <Link
                      to="/student/notice"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/student/notice')
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      시스템 공지사항
                    </Link>
                  </>
                )}
                {(user.role === 'admin' || user.role === 'sub-admin') && (
                  <Link
                    to={user.role === 'admin' ? '/admin/master-dashboard' : '/admin/sub-dashboard'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    관리자 대시보드
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* 알림 버튼 */}
            {isLoggedIn && user && (
              <div className="relative" data-notification-menu>
                <button
                  onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="알림"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {showNotificationMenu && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
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
            )}

            {isLoggedIn && user ? (
              <>
                {/* Role Switch Dropdown */}
                <div className="relative" data-role-menu>
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {roleInfo && (
                      <>
                        <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
                        <span className="text-sm font-medium">{roleInfo.label}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </>
                    )}
                  </button>

                  {showRoleMenu && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        권한 전환
                      </div>

                      <button
                        onClick={() => handleRoleSwitch('student')}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-50 ${
                          user.role === 'student' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <span>수강생</span>
                        {user.role === 'student' && <span className="text-xs text-blue-600 ml-auto">현재</span>}
                      </button>

                      <button
                        onClick={() => handleRoleSwitch('instructor')}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-50 ${
                          user.role === 'instructor' ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        <User className="h-4 w-4 text-green-600" />
                        <span>강의자</span>
                        {user.role === 'instructor' && <span className="text-xs text-green-600 ml-auto">현재</span>}
                      </button>

                      <button
                        onClick={() => handleRoleSwitch('admin')}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-50 ${
                          user.role === 'admin' ? 'bg-red-50 text-red-700' : 'text-gray-700'
                        }`}
                      >
                        <Shield className="h-4 w-4 text-red-600" />
                        <span>마스터 관리자</span>
                        {user.role === 'admin' && <span className="text-xs text-red-600 ml-auto">현재</span>}
                      </button>

                      <button
                        onClick={() => handleRoleSwitch('sub-admin')}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-50 ${
                          user.role === 'sub-admin' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                        }`}
                      >
                        <Users className="h-4 w-4 text-purple-600" />
                        <span>서브관리자</span>
                        {user.role === 'sub-admin' && <span className="text-xs text-purple-600 ml-auto">현재</span>}
                      </button>
                    </div>
                  )}
                </div>

                {user.role !== 'admin' && user.role !== 'sub-admin' && (
                  <Link
                    to={
                      user.role === 'instructor' ? '/instructor/profile' :
                      '/student/profile'
                    }
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-600" />
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                <User className="h-4 w-4" />
                <span>로그인</span>
              </Link>
            )}

            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

