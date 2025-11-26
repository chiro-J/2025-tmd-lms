import apiClient from './client'

export interface DailyLearningData {
  date: string // 'YYYY-MM-DD'
  totalSeconds: number
  sessionCount: number
}

export interface WeeklyLearningData {
  thisWeek: number[] // 7개 요소, 시간 단위
  lastWeek: number[] // 7개 요소, 시간 단위
}

export interface LearningSession {
  id: number
  userId: number
  courseId: number
  startedAt: string
  endedAt?: string
  duration?: number
  activityType: string
  createdAt: string
}

// 주간 학습 데이터 조회 (최근 14일) - API가 구현되지 않았으므로 조용히 처리
export async function getWeeklyLearningData(userId: number): Promise<WeeklyLearningData> {
  try {
    const response = await apiClient.get(`/users/${userId}/learning/weekly`)
    return response.data
  } catch (error) {
    // API가 구현되지 않았으므로 조용히 처리 (404 오류는 무시)
    // 에러 시 빈 데이터 반환
    return {
      thisWeek: [0, 0, 0, 0, 0, 0, 0],
      lastWeek: [0, 0, 0, 0, 0, 0, 0]
    }
  }
}

// 학습 세션 시작 - API가 구현되지 않았으므로 조용히 처리
export async function startLearningSession(
  userId: number,
  courseId: number
): Promise<LearningSession> {
  try {
    const response = await apiClient.post('/learning/sessions/start', {
      userId,
      courseId
    }, {
      // 404 오류를 조용히 처리하기 위한 설정
      validateStatus: (status) => status < 500
    })
    return response.data
  } catch (error: any) {
    // API가 구현되지 않았으므로 조용히 처리 (404 오류는 무시)
    // 더미 세션 반환
    return {
      id: Date.now(),
      userId,
      courseId,
      startedAt: new Date().toISOString(),
      activityType: 'view',
      createdAt: new Date().toISOString()
    }
  }
}

// 학습 세션 종료 - API가 구현되지 않았으므로 조용히 처리
export async function endLearningSession(sessionId: number): Promise<LearningSession> {
  try {
    const response = await apiClient.post(`/learning/sessions/${sessionId}/end`, {}, {
      // 404 오류를 조용히 처리하기 위한 설정
      validateStatus: (status) => status < 500
    })
    return response.data
  } catch (error: any) {
    // API가 구현되지 않았으므로 조용히 처리 (404 오류는 무시)
    // 더미 세션 반환
    return {
      id: sessionId,
      userId: 0,
      courseId: 0,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      activityType: 'view',
      createdAt: new Date().toISOString()
    }
  }
}

// 학습 활동 heartbeat (페이지 활성 상태 추적, 선택사항) - API가 구현되지 않았으므로 조용히 처리
export async function recordLearningActivity(sessionId: number): Promise<void> {
  try {
    await apiClient.post(`/learning/sessions/${sessionId}/heartbeat`, {}, {
      // 404 오류를 조용히 처리하기 위한 설정
      validateStatus: (status) => status < 500
    })
  } catch (error: any) {
    // API가 구현되지 않았으므로 조용히 처리 (404 오류는 무시)
  }
}

// 일별 학습 통계 조회 - API가 구현되지 않았으므로 조용히 처리
export async function getDailyLearningStats(
  userId: number,
  startDate: string,
  endDate: string
): Promise<DailyLearningData[]> {
  try {
    const response = await apiClient.get(`/users/${userId}/learning/daily`, {
      params: { startDate, endDate }
    })
    return response.data
  } catch (error: any) {
    // API가 구현되지 않았으므로 조용히 처리 (404 오류는 무시)
    // 빈 배열 반환
    return []
  }
}

