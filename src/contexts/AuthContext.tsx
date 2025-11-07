import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { login as loginApi, logout as logoutApi, getProfile, refreshToken as refreshTokenApi } from '../core/api/auth'

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  quickLogin: (role: 'student' | 'instructor' | 'admin' | 'sub-admin') => Promise<User>
  logout: () => Promise<void>
  switchRole: (role: 'student' | 'instructor' | 'admin' | 'sub-admin') => void
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 페이지 로드 시 저장된 토큰으로 사용자 정보 복원
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')

      if (accessToken) {
        try {
          const userData = await getProfile()
          setUser(userData)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Failed to restore auth session:', error)
          // 토큰이 유효하지 않으면 로그아웃
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          localStorage.removeItem('isLoggedIn')
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { accessToken, refreshToken, user: userData } = await loginApi(email, password)

      // JWT 토큰 저장
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isLoggedIn', 'true')

      setUser(userData)
      setIsLoggedIn(true)

      return userData
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
  }

  const quickLogin = async (role: 'student' | 'instructor' | 'admin' | 'sub-admin'): Promise<User> => {
    // Mock 데이터로 즉시 로그인 (테스트용)
    const mockUser: User = {
      id: Math.floor(Math.random() * 10000),
      username: `mock_${role}`,
      email: `${role}@example.com`,
      role: role,
      name: `테스트 ${role === 'student' ? '수강생' : role === 'instructor' ? '강사' : role === 'admin' ? '마스터 관리자' : '서브 관리자'}`,
      avatar: undefined,
      phone: '010-1234-5678'
    }

    const mockToken = 'mock-jwt-token-' + Date.now()

    // Mock 토큰 저장
    localStorage.setItem('accessToken', mockToken)
    localStorage.setItem('refreshToken', mockToken)
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('isLoggedIn', 'true')

    setUser(mockUser)
    setIsLoggedIn(true)

    return mockUser
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // 로컬 상태 정리
      setUser(null)
      setIsLoggedIn(false)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
    }
  }

  const refreshUserProfile = async () => {
    try {
      const userData = await getProfile()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to refresh user profile:', error)
    }
  }

  const switchRole = (role: 'student' | 'instructor' | 'admin' | 'sub-admin') => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    login,
    quickLogin,
    logout,
    switchRole,
    refreshUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
