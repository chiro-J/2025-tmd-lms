import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../core/api/client';

const STORAGE_KEY = 'lms_learning_time';
const SYNC_INTERVAL = 5 * 60 * 1000; // 5분
const MIN_SYNC_SECONDS = 60; // 최소 1분 이상일 때만 동기화

interface LearningTimeData {
  userId: number;
  accumulatedSeconds: number;
  lastUpdated: string;
}

export function useSessionTracking() {
  const { user } = useAuth();
  const counterIntervalRef = useRef<number | null>(null);
  const syncIntervalRef = useRef<number | null>(null);
  const isActiveRef = useRef(true);

  // LocalStorage 데이터 로드
  const loadData = (): LearningTimeData | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  // LocalStorage 데이터 저장
  const saveData = (data: LearningTimeData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[Learning Time] Failed to save:', error);
    }
  };

  // 초기화 또는 로드
  const initializeData = (): LearningTimeData => {
    if (!user) {
      return { userId: 0, accumulatedSeconds: 0, lastUpdated: new Date().toISOString() };
    }

    const userId = typeof user.id === 'number' ? user.id : Number(user.id);
    const existing = loadData();

    // 같은 유저면 기존 데이터 사용
    if (existing && existing.userId === userId) {
      return existing;
    }

    // 다른 유저의 남은 데이터가 있으면 동기화 후 새로 시작
    if (existing && existing.userId !== userId && existing.accumulatedSeconds > 0) {
      syncToServer(existing.userId, existing.accumulatedSeconds);
    }

    const newData: LearningTimeData = {
      userId,
      accumulatedSeconds: 0,
      lastUpdated: new Date().toISOString(),
    };

    saveData(newData);
    return newData;
  };

  // 서버 동기화
  const syncToServer = async (targetUserId?: number, targetSeconds?: number) => {
    const data = loadData();
    const userId = targetUserId || data?.userId;
    const seconds = targetSeconds || data?.accumulatedSeconds || 0;

    if (!userId || seconds < MIN_SYNC_SECONDS) {
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      await apiClient.post(`/users/${userId}/learning/time`, {
        date: today,
        seconds: seconds,
      });

      console.log(`[Learning Time] Synced ${seconds}s for user ${userId}`);

      // 동기화 성공 시 누적 시간 초기화 (현재 유저인 경우만)
      if (!targetUserId && data) {
        data.accumulatedSeconds = 0;
        data.lastUpdated = new Date().toISOString();
        saveData(data);
      }
    } catch (error: any) {
      console.error('[Learning Time] Sync failed:', error.response?.data || error.message);
      // 실패해도 localStorage에 남아있으므로 다음에 재시도
    }
  };

  // Visibility API - 백그라운드 전환 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 백그라운드로 전환 시
        isActiveRef.current = false;
        const data = loadData();
        if (data && data.accumulatedSeconds >= MIN_SYNC_SECONDS) {
          syncToServer(); // 즉시 동기화
        }
      } else {
        // 다시 포그라운드로 전환 시
        isActiveRef.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 페이지 떠날 때 동기화
  useEffect(() => {
    const handleBeforeUnload = () => {
      const data = loadData();
      if (!data || data.accumulatedSeconds < MIN_SYNC_SECONDS) return;

      // sendBeacon으로 비동기 전송
      const blob = new Blob(
        [JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          seconds: data.accumulatedSeconds,
        })],
        { type: 'application/json' }
      );

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      navigator.sendBeacon(`${apiUrl}/users/${data.userId}/learning/time`, blob);

      // localStorage 초기화
      data.accumulatedSeconds = 0;
      saveData(data);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // 메인 추적 로직
  useEffect(() => {
    if (!user) return;

    const data = initializeData();

    // 1초마다 누적 (탭이 활성 상태일 때만)
    counterIntervalRef.current = setInterval(() => {
      if (isActiveRef.current && !document.hidden) {
        const currentData = loadData();
        if (currentData) {
          currentData.accumulatedSeconds += 1;
          saveData(currentData);
        }
      }
    }, 1000);

    // 5분마다 서버 동기화
    syncIntervalRef.current = setInterval(() => {
      syncToServer();
    }, SYNC_INTERVAL);

    // 로그인 직후 남은 데이터 확인 후 동기화
    if (data.accumulatedSeconds >= MIN_SYNC_SECONDS) {
      syncToServer();
    }

    return () => {
      if (counterIntervalRef.current) clearInterval(counterIntervalRef.current);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, [user?.id]);

  return {
    syncNow: () => syncToServer(),
  };
}
