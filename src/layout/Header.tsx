import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Bell, User, Menu, LogOut, ChevronDown, GraduationCap, Shield, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, switchRole } = useAuth()
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')
  const [showRoleMenu, setShowRoleMenu] = useState(false)

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

  // 외부 클릭 시 드롭다운 메뉴 닫기
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showRoleMenu) {
        const target = event.target as Element
        if (!target.closest('[data-role-menu]')) {
          setShowRoleMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRoleMenu])

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
                  // 로그인되지 않은 사용자는 수강생 대시보드로
                  navigate('/student/dashboard')
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
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>

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

