import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { login as loginApi, logout as logoutApi, getProfile, refreshToken as refreshTokenApi } from '../core/api/auth'

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  switchRole: (role: 'student' | 'instructor' | 'admin' | 'sub-admin') => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
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
        } catch (error: any) {
          // 401 에러는 토큰 만료로 정상적인 상황이므로 조용히 처리
          if (error.response?.status === 401) {
            // 토큰이 유효하지 않으면 로그아웃
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            localStorage.removeItem('isLoggedIn')
          } else {
            console.error('Failed to restore auth session:', error)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            localStorage.removeItem('isLoggedIn')
          }
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

  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      // 로그아웃 API 실패는 조용히 처리 (refresh token이 없을 수 있음)
      // console.error('Logout API call failed:', error)
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

  const switchRole = async (role: 'student' | 'instructor' | 'admin' | 'sub-admin') => {
    // 권한별 기본 테스트 계정 (users 테이블에 등록된 계정 사용)
    const roleAccounts: Record<string, { email: string; passwords: string[] }> = {
      'student': {
        email: 'student@example.com',
        passwords: ['pass1234']
      },
      'instructor': {
        email: 'instructor@example.com',
        passwords: ['pass1234']
      },
      'admin': {
        email: 'admin@example.com',
        passwords: ['admin1234']
      },
      'sub-admin': {
        email: 'subadmin@example.com',
        passwords: ['sub123']
      },
    }

    const account = roleAccounts[role]
    if (!account) {
      console.error('알 수 없는 권한:', role)
      return
    }

    try {
      // 현재 로그아웃 (에러 무시)
      try {
        await logout()
      } catch (logoutError) {
        // 로그아웃 실패해도 계속 진행 (조용히 처리)
        // console.warn('로그아웃 실패 (무시):', logoutError)
      }

      // 로컬 스토리지 정리
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')

      // 여러 비밀번호 시도
      let loginSuccess = false
      let lastError: any = null

      for (const password of account.passwords) {
        try {
          await login(account.email, password)
          loginSuccess = true
          break
        } catch (error: any) {
          lastError = error
          // 401 에러가 아니면 즉시 중단 (네트워크 오류 등)
          if (error.response?.status !== 401) {
            throw error
          }
          // 다음 비밀번호 시도
          continue
        }
      }

      if (!loginSuccess) {
        const errorMessage = lastError?.response?.data?.message || lastError?.message || '알 수 없는 오류'
        throw new Error(`모든 비밀번호 시도 실패: ${errorMessage}`)
      }
    } catch (error: any) {
      console.error('권한 전환 실패:', error)
      const errorMessage = error?.response?.data?.message || error?.message || '알 수 없는 오류'
      alert(`권한 전환에 실패했습니다.\n\n계정: ${account.email}\n오류: ${errorMessage}\n\n해당 계정으로 직접 로그인해주세요.`)
    }
  }

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    login,
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
