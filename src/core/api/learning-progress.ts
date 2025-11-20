import apiClient from './client'
import { useAuth } from '../../contexts/AuthContext'

export interface LearningProgress {
  id: number
  userId: number
  courseId: number
  lessonId: number | null
  lastAccessedAt: string
  createdAt: string
  updatedAt: string
  lesson?: {
    id: number
    title: string
    curriculumModuleId: number
  }
  course?: {
    id: number
    title: string
  }
}

/**
 * 특정 강좌의 학습 진행률 조회
 * GET /api/learning-progress/:userId/course/:courseId
 */
export const getLearningProgress = async (userId: number, courseId: number): Promise<LearningProgress | null> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: LearningProgress | null }>(
      `/learning-progress/${userId}/course/${courseId}`
    )
    return response.data.data || null
  } catch (error: any) {
    // 404는 진행률이 없는 것이므로 null 반환
    if (error.response?.status === 404) {
      return null
    }
    console.error('학습 진행률 조회 실패:', error)
    return null
  }
}

/**
 * 학습 진행률 업데이트 또는 생성
 * POST /api/learning-progress
 */
export const updateLearningProgress = async (data: {
  userId: number
  courseId: number
  lessonId?: number | null
}): Promise<LearningProgress> => {
  try {
    const response = await apiClient.post<{ success: boolean; data: LearningProgress }>(
      '/learning-progress',
      data
    )
    return response.data.data
  } catch (error: any) {
    // 상세 에러 정보 로깅
    if (error.response) {
      console.error('학습 진행률 업데이트 실패:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        requestData: data
      })
    } else {
      console.error('학습 진행률 업데이트 실패:', error)
    }
    // 500 에러는 조용히 처리 (서버 문제이므로 사용자 경험에 영향 최소화)
    if (error.response?.status === 500) {
      console.warn('서버 오류로 학습 진행률 저장 실패 (무시됨)')
      // 에러를 throw하지 않고 조용히 실패 처리
      throw error
    }
    throw error
  }
}

/**
 * 사용자의 마지막 학습 강좌 조회
 * GET /api/learning-progress/:userId/last-learned
 */
export const getLastLearnedCourse = async (userId: number): Promise<LearningProgress | null> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: LearningProgress | null }>(
      `/learning-progress/${userId}/last-learned`
    )
    return response.data.data || null
  } catch (error: any) {
    // 404는 기록이 없는 것이므로 null 반환
    if (error.response?.status === 404) {
      return null
    }
    console.error('마지막 학습 강좌 조회 실패:', error)
    return null
  }
}

