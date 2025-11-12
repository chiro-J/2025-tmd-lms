import apiClient from './client'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * 파일 업로드
 * POST /api/upload
 */
export const uploadFile = async (file: File, type: 'pdf' | 'image' | 'video'): Promise<{ url: string }> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await apiClient.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // 상대 경로를 절대 URL로 변환
    const absoluteUrl = response.data.url.startsWith('http')
      ? response.data.url
      : `${API_BASE_URL}${response.data.url}`

    return {
      ...response.data,
      url: absoluteUrl
    }
  } catch (error) {
    console.error('파일 업로드 실패:', error)
    throw error
  }
}

