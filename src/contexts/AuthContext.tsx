import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { login as loginApi, logout as logoutApi, getProfile, refreshToken as refreshTokenApi } from '../core/api/auth'
import apiClient from '../core/api/client'

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  sessionId: number | null
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

// Session tracking types
interface TrackingInterval {
  timestamp: string;
  durationSeconds: number;
  isActive: boolean;
}

interface SessionTracking {
  sessionId: number;
  userId: number;
  startedAt: string;
  lastSyncAt: string;
  intervals: TrackingInterval[];
}

const STORAGE_KEY = 'lms_session_tracking';
const HEARTBEAT_INTERVAL = 60 * 1000; // 1분
const SYNC_INTERVAL = 15 * 60 * 1000; // 15분

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<number | null>(null)

  // Session tracking refs
  const heartbeatIntervalRef = useRef<NodeJS.Timer | null>(null)
  const syncIntervalRef = useRef<NodeJS.Timer | null>(null)
  const counterIntervalRef = useRef<NodeJS.Timer | null>(null)
  const secondsCounterRef = useRef(0)
  const isActiveRef = useRef(true)

  // LocalStorage helpers
  const loadTracking = (): SessionTracking | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Session Tracking] Failed to load tracking data:', error);
      return null;
    }
  };

  const saveTracking = (tracking: SessionTracking) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracking));
    } catch (error) {
      console.error('[Session Tracking] Failed to save tracking data:', error);
    }
  };

  // Record interval (1분마다 호출)
  const recordInterval = () => {
    const tracking = loadTracking();
    if (!tracking) return;

    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');

    if (secondsCounterRef.current > 0) {
      tracking.intervals.push({
        timestamp,
        durationSeconds: secondsCounterRef.current,
        isActive: isActiveRef.current,
      });

      saveTracking(tracking);
      console.log(`[Session Tracking] Recorded: ${secondsCounterRef.current}s (active: ${isActiveRef.current})`);
    }

    secondsCounterRef.current = 0;
  };

  // Sync to server
  const syncToServer = async (targetSessionId?: number, targetIntervals?: TrackingInterval[]) => {
    const tracking = loadTracking();

    const syncSessionId = targetSessionId || tracking?.sessionId;
    const syncIntervals = targetIntervals || tracking?.intervals;

    if (!syncSessionId || !syncIntervals || syncIntervals.length === 0) {
      console.log('[Session Tracking] Nothing to sync');
      return;
    }

    try {
      console.log(`[Session Tracking] Syncing ${syncIntervals.length} intervals to server...`);

      const response = await apiClient.post(
        `/api/learning/sessions/${syncSessionId}/sync`,
        {
          intervals: syncIntervals,
          startedAt: tracking?.startedAt || new Date().toISOString(),
        }
      );

      console.log('[Session Tracking] Sync success:', response.data);

      if (!targetSessionId && tracking) {
        tracking.intervals = [];
        tracking.lastSyncAt = new Date().toISOString();
        saveTracking(tracking);
      }

    } catch (error: any) {
      console.error('[Session Tracking] Sync failed:', error.response?.data || error.message);
    }
  };

  // Initialize tracking
  const initializeTracking = (newSessionId: number, userId: number) => {
    const existing = loadTracking();

    if (existing && existing.sessionId === newSessionId) {
      console.log('[Session Tracking] Resuming existing tracking session');
      return existing;
    }

    if (existing && existing.sessionId !== newSessionId && existing.intervals.length > 0) {
      console.log('[Session Tracking] Found old session, will sync before starting new one');
      syncToServer(existing.sessionId, existing.intervals);
    }

    const newTracking: SessionTracking = {
      sessionId: newSessionId,
      userId,
      startedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      intervals: [],
    };

    saveTracking(newTracking);
    console.log('[Session Tracking] Started new tracking session:', newSessionId);
    return newTracking;
  };

  // Start tracking
  const startTracking = () => {
    if (!user || !sessionId) {
      console.log('[Session Tracking] No user or session, skipping tracking');
      return;
    }

    const userId = typeof user.id === 'number' ? user.id : Number(user.id);
    initializeTracking(sessionId, userId);

    // 1초마다 카운터 증가
    counterIntervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        secondsCounterRef.current += 1;
      }
    }, 1000);

    // 1분마다 localStorage에 기록
    heartbeatIntervalRef.current = setInterval(() => {
      recordInterval();
    }, HEARTBEAT_INTERVAL);

    // 15분마다 서버에 동기화
    syncIntervalRef.current = setInterval(() => {
      syncToServer();
    }, SYNC_INTERVAL);

    console.log('[Session Tracking] Tracking started');
  };

  // Stop tracking
  const stopTracking = () => {
    if (counterIntervalRef.current) {
      clearInterval(counterIntervalRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    console.log('[Session Tracking] Tracking stopped');
  };

  // Page visibility tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
      console.log(`[Session Tracking] Tab ${document.hidden ? 'hidden' : 'visible'}`);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Start/stop tracking when sessionId changes
  useEffect(() => {
    if (user && sessionId) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      stopTracking();
    };
  }, [user, sessionId]);

  // Before unload handler
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('[Session Tracking] beforeunload triggered');

      if (secondsCounterRef.current > 0) {
        recordInterval();
      }

      const tracking = loadTracking();
      if (tracking && tracking.intervals.length > 0) {
        const blob = new Blob(
          [JSON.stringify({
            intervals: tracking.intervals,
            startedAt: tracking.startedAt,
          })],
          { type: 'application/json' }
        );

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const sent = navigator.sendBeacon(
          `${apiUrl}/api/learning/sessions/${tracking.sessionId}/sync`,
          blob
        );

        console.log(`[Session Tracking] sendBeacon ${sent ? 'success' : 'failed'}`);

        if (sent) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // 페이지 로드 시 저장된 토큰으로 사용자 정보 복원
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const savedSessionId = localStorage.getItem('sessionId')

      if (accessToken) {
        try {
          const userData = await getProfile()
          setUser(userData)
          setIsLoggedIn(true)

          // 저장된 세션 ID 복원
          if (savedSessionId) {
            setSessionId(parseInt(savedSessionId))
          }
        } catch (error: any) {
          // 401 에러는 토큰 만료로 정상적인 상황이므로 조용히 처리
          if (error.response?.status === 401) {
            // 토큰이 유효하지 않으면 로그아웃
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('sessionId')
          } else {
            console.error('Failed to restore auth session:', error)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('sessionId')
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

      // 세션 시작
      try {
        const sessionResponse = await apiClient.post('/api/learning/sessions/start', {
          userId: userData.id,
        })
        const newSessionId = sessionResponse.data.id
        setSessionId(newSessionId)
        localStorage.setItem('sessionId', newSessionId.toString())
        console.log('[Auth] Session started:', newSessionId)
      } catch (error) {
        console.error('[Auth] Failed to start session:', error)
        // 세션 시작 실패해도 로그인은 성공으로 처리
      }

      return userData
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
  }

  const logout = async () => {
    try {
      // 세션 동기화 및 종료
      if (sessionId) {
        try {
          console.log('[Auth] Syncing session before logout...')
          await syncToServer()
          await apiClient.post(`/api/learning/sessions/${sessionId}/end`)
          console.log('[Auth] Session ended:', sessionId)
        } catch (error) {
          console.error('[Auth] Failed to end session:', error)
        }
      }

      await logoutApi()
    } catch (error) {
      // 로그아웃 API 실패는 조용히 처리 (refresh token이 없을 수 있음)
      // console.error('Logout API call failed:', error)
    } finally {
      // 로컬 상태 정리
      setUser(null)
      setIsLoggedIn(false)
      setSessionId(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('sessionId')
      localStorage.removeItem('lms_session_tracking')
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
    sessionId,
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
