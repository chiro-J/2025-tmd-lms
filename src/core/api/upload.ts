import apiClient from './client'

/**
 * 파일 업로드
 * POST /api/upload
 * @param file 업로드할 파일
 * @param type 파일 타입
 * @param source 파일 출처 (lesson, thumbnail, assignment, resource)
 */
export const uploadFile = async (file: File, type: 'pdf' | 'image' | 'video', source: 'lesson' | 'thumbnail' | 'assignment' | 'resource' = 'lesson'): Promise<{ url: string }> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('source', source)

    const response = await apiClient.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // 백엔드에서 이미 절대 URL을 반환하므로 그대로 사용
    return response.data
  } catch (error) {
    console.error('파일 업로드 실패:', error)
    throw error
  }
}

