import apiClient from './client'
import type { ProfileData, Education, Experience, Project, Certificate, Language, Training } from '../../contexts/ProfileContext'

// 프로필 조회
export const getProfile = async (userId: number): Promise<ProfileData> => {
  const response = await apiClient.get(`/users/${userId}/profile`)
  return response.data
}

// 프로필 전체 업데이트
export const updateProfile = async (userId: number, data: Partial<ProfileData>): Promise<ProfileData> => {
  const response = await apiClient.put(`/users/${userId}/profile`, data)
  return response.data
}

// 이력서 사진 업로드
export const uploadResumePhoto = async (userId: number, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post(`/users/${userId}/profile/resume-photo`, formData)
  return response.data.url
}

// 프로필 사진 업로드
export const uploadProfilePhoto = async (userId: number, file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post(`/users/${userId}/profile/profile-photo`, formData)
  return response.data.url
}

// 학력 관련 API
export const addEducation = async (userId: number, education: Omit<Education, 'id'>): Promise<Education> => {
  const response = await apiClient.post(`/users/${userId}/profile/education`, education)
  return response.data
}

export const updateEducation = async (userId: number, id: string, education: Partial<Education>): Promise<Education> => {
  const response = await apiClient.put(`/users/${userId}/profile/education/${id}`, education)
  return response.data
}

export const deleteEducation = async (userId: number, id: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/profile/education/${id}`)
}

// 경력 관련 API
export const addExperience = async (userId: number, experience: Omit<Experience, 'id'>): Promise<Experience> => {
  const response = await apiClient.post(`/users/${userId}/profile/experience`, experience)
  return response.data
}

export const updateExperience = async (userId: number, id: string, experience: Partial<Experience>): Promise<Experience> => {
  const response = await apiClient.put(`/users/${userId}/profile/experience/${id}`, experience)
  return response.data
}

export const deleteExperience = async (userId: number, id: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/profile/experience/${id}`)
}

// 프로젝트 관련 API
export const addProject = async (userId: number, project: Omit<Project, 'id'>): Promise<Project> => {
  const response = await apiClient.post(`/users/${userId}/profile/projects`, project)
  return response.data
}

export const updateProject = async (userId: number, id: string, project: Partial<Project>): Promise<Project> => {
  const response = await apiClient.put(`/users/${userId}/profile/projects/${id}`, project)
  return response.data
}

export const deleteProject = async (userId: number, id: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/profile/projects/${id}`)
}

// 자격증 관련 API
export const addCertificate = async (userId: number, certificate: Omit<Certificate, 'id'>): Promise<Certificate> => {
  const response = await apiClient.post(`/users/${userId}/profile/certificates`, certificate)
  return response.data
}

export const updateCertificate = async (userId: number, id: string, certificate: Partial<Certificate>): Promise<Certificate> => {
  const response = await apiClient.put(`/users/${userId}/profile/certificates/${id}`, certificate)
  return response.data
}

export const deleteCertificate = async (userId: number, id: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/profile/certificates/${id}`)
}

// 외국어 관련 API
export const addLanguageSkill = async (userId: number, language: Omit<Language, 'id'>): Promise<Language> => {
  const response = await apiClient.post(`/users/${userId}/profile/languages`, language)
  return response.data
}

export const updateLanguageSkill = async (userId: number, id: string, language: Partial<Language>): Promise<Language> => {
  const response = await apiClient.put(`/users/${userId}/profile/languages/${id}`, language)
  return response.data
}

export const deleteLanguageSkill = async (userId: number, id: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/profile/languages/${id}`)
}

// 교육 이력 관련 API
export const addTraining = async (userId: number, training: Omit<Training, 'id'>): Promise<Training> => {
  const response = await apiClient.post(`/users/${userId}/profile/trainings`, training)
  return response.data
}

export const updateTraining = async (userId: number, id: string, training: Partial<Training>): Promise<Training> => {
  const response = await apiClient.put(`/users/${userId}/profile/trainings/${id}`, training)
  return response.data
}

export const deleteTraining = async (userId: number, id: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/profile/trainings/${id}`)
}
