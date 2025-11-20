import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import * as profileApi from '../core/api/profile'

// 이력서 관련 타입 정의
export interface Education {
  id: string
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
  status: 'graduated' | 'enrolled' | 'dropped'
  gpa?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Project {
  id: string
  name: string
  description: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  techStack: string[]
  url?: string
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
}

export interface Language {
  id: string
  language: string
  certificate?: string
  certificateDate?: string
  level: 'basic' | 'conversational' | 'business' | 'native'
}

export interface Training {
  id: string
  institution: string
  content: string
  startDate: string
  endDate: string
}

export type ResumeTemplate = 'modern' | 'classic' | 'minimal' | 'creative'

export interface ProfileData {
  // 개인 정보
  name: string
  email: string
  phone: string
  address: string
  job: string
  language: string
  bio: string
  languages: string[]
  githubUrl: string
  notionUrl: string
  profileImage?: string // 프로필 사진 URL

  // 소셜 로그인 연동 상태
  googleLinked: boolean
  kakaoLinked: boolean
  googleLinkedDate?: string
  kakaoLinkedDate?: string

  // 이력서 정보
  resumePhoto?: string // 이력서 사진 (720x960)
  education: Education[]
  experience: Experience[]
  projects: Project[]
  certificates: Certificate[]
  skills: string[]
  portfolioUrl?: string
  resumeTemplate: ResumeTemplate // 이력서 템플릿
  languageSkills: Language[] // 외국어 능력
  trainings: Training[] // 교육 이력
}

interface ProfileContextType {
  profileData: ProfileData
  updateProfile: (data: Partial<ProfileData>) => void
  addEducation: (education: Education) => void
  updateEducation: (id: string, education: Partial<Education>) => void
  deleteEducation: (id: string) => void
  addExperience: (experience: Experience) => void
  updateExperience: (id: string, experience: Partial<Experience>) => void
  deleteExperience: (id: string) => void
  addProject: (project: Project) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  addCertificate: (certificate: Certificate) => void
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void
  deleteCertificate: (id: string) => void
  addLanguageSkill: (language: Language) => void
  updateLanguageSkill: (id: string, language: Partial<Language>) => void
  deleteLanguageSkill: (id: string) => void
  addTraining: (training: Training) => void
  updateTraining: (id: string, training: Partial<Training>) => void
  deleteTraining: (id: string) => void
  saveToLocalStorage: () => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = typeof user?.id === 'number' ? user.id : (typeof user?.id === 'string' ? parseInt(user.id, 10) : 0)

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    job: '',
    language: '한국어',
    bio: '',
    languages: [],
    githubUrl: '',
    notionUrl: '',
    profileImage: '',
    googleLinked: false,
    kakaoLinked: false,
    googleLinkedDate: undefined,
    kakaoLinkedDate: undefined,
    resumePhoto: '',
    education: [],
    experience: [],
    projects: [],
    certificates: [],
    skills: [],
    resumeTemplate: 'modern',
    languageSkills: [],
    trainings: []
  })

  // API 또는 localStorage에서 데이터 로드
  useEffect(() => {
    if (!user || !userId) return

    const loadProfile = async () => {
      try {
        // API에서 프로필 데이터 로드 시도
        const data = await profileApi.getProfile(userId)
        setProfileData({
          ...data,
          name: user.name || data.name || '',
          email: user.email || data.email || '',
          phone: user.phone || data.phone || '',
          languageSkills: data.languageSkills || [],
          trainings: data.trainings || []
        })
      } catch (error: any) {
        // API 실패 시 localStorage에서 로드
        console.log('Loading from localStorage (API not available)')
        const savedProfile = localStorage.getItem(`profile_${userId}`)

        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile)
            setProfileData({
              ...parsed,
              name: user.name || parsed.name || '',
              email: user.email || parsed.email || '',
              phone: user.phone || parsed.phone || '',
              languageSkills: parsed.languageSkills || [],
              trainings: parsed.trainings || []
            })
          } catch (parseError) {
            console.error('Failed to parse profile data:', parseError)
            // 파싱 실패 시 기본값으로 설정
            setProfileData(prev => ({
              ...prev,
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || ''
            }))
          }
        } else {
          // 기존 개별 항목에서 마이그레이션
          const savedAddress = localStorage.getItem(`address_${userId}`)
          const savedJob = localStorage.getItem(`job_${userId}`)
          const savedBio = localStorage.getItem(`bio_${userId}`)
          const savedLanguages = localStorage.getItem(`languages_${userId}`)
          const savedGithub = localStorage.getItem(`github_url_${userId}`)
          const savedNotion = localStorage.getItem(`notion_url_${userId}`)
          const savedPhone = localStorage.getItem(`phone_${userId}`)

          setProfileData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || savedPhone || '',
            address: savedAddress || '',
            job: savedJob || '',
            language: '한국어',
            bio: savedBio || '',
            languages: savedLanguages ? JSON.parse(savedLanguages) : [],
            githubUrl: savedGithub || '',
            notionUrl: savedNotion || '',
            profileImage: '',
            googleLinked: false,
            kakaoLinked: false,
            googleLinkedDate: undefined,
            kakaoLinkedDate: undefined,
            resumePhoto: '',
            education: [],
            experience: [],
            projects: [],
            certificates: [],
            skills: [],
            resumeTemplate: 'modern',
            languageSkills: [],
            trainings: []
          })
        }
      }
    }

    loadProfile()
  }, [user, userId])

  const saveToLocalStorage = async () => {
    if (!userId) return

    try {
      // API에 저장 시도
      await profileApi.updateProfile(userId, profileData)
      // 성공 시 localStorage에도 백업
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData))
    } catch (error) {
      // API 실패 시 localStorage만 저장
      console.log('Saving to localStorage only (API not available)')
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData))
    }
  }

  // 자동 저장: profileData 변경 시 자동으로 localStorage에 저장 (API는 저장 버튼 클릭 시만)
  useEffect(() => {
    if (!userId || !user) return

    const timer = setTimeout(() => {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData))
    }, 1000) // 1초 디바운스

    return () => clearTimeout(timer)
  }, [profileData, userId, user])

  const updateProfile = async (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }))
    // API 업데이트는 saveToLocalStorage에서 처리
  }

  // Education 관리
  const addEducation = async (education: Education) => {
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, education]
    }))
    // API 호출은 즉시 진행하지 않고 localStorage 자동 저장에 의존
  }

  const updateEducation = async (id: string, education: Partial<Education>) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...education } : edu
      )
    }))
  }

  const deleteEducation = async (id: string) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  // Experience 관리
  const addExperience = async (experience: Experience) => {
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, experience]
    }))
  }

  const updateExperience = async (id: string, experience: Partial<Experience>) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, ...experience } : exp
      )
    }))
  }

  const deleteExperience = async (id: string) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  // Project 관리
  const addProject = async (project: Project) => {
    setProfileData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }))
  }

  const updateProject = async (id: string, project: Partial<Project>) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, ...project } : proj
      )
    }))
  }

  const deleteProject = async (id: string) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }))
  }

  // Certificate 관리
  const addCertificate = async (certificate: Certificate) => {
    setProfileData(prev => ({
      ...prev,
      certificates: [...prev.certificates, certificate]
    }))
  }

  const updateCertificate = async (id: string, certificate: Partial<Certificate>) => {
    setProfileData(prev => ({
      ...prev,
      certificates: prev.certificates.map(cert =>
        cert.id === id ? { ...cert, ...certificate } : cert
      )
    }))
  }

  const deleteCertificate = async (id: string) => {
    setProfileData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== id)
    }))
  }

  // LanguageSkill 관리
  const addLanguageSkill = async (language: Language) => {
    setProfileData(prev => ({
      ...prev,
      languageSkills: [...prev.languageSkills, language]
    }))
  }

  const updateLanguageSkill = async (id: string, language: Partial<Language>) => {
    setProfileData(prev => ({
      ...prev,
      languageSkills: prev.languageSkills.map(lang =>
        lang.id === id ? { ...lang, ...language } : lang
      )
    }))
  }

  const deleteLanguageSkill = async (id: string) => {
    setProfileData(prev => ({
      ...prev,
      languageSkills: prev.languageSkills.filter(lang => lang.id !== id)
    }))
  }

  // Training 관리
  const addTraining = async (training: Training) => {
    setProfileData(prev => ({
      ...prev,
      trainings: [...prev.trainings, training]
    }))
  }

  const updateTraining = async (id: string, training: Partial<Training>) => {
    setProfileData(prev => ({
      ...prev,
      trainings: prev.trainings.map(train =>
        train.id === id ? { ...train, ...training } : train
      )
    }))
  }

  const deleteTraining = async (id: string) => {
    setProfileData(prev => ({
      ...prev,
      trainings: prev.trainings.filter(train => train.id !== id)
    }))
  }

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        updateProfile,
        addEducation,
        updateEducation,
        deleteEducation,
        addExperience,
        updateExperience,
        deleteExperience,
        addProject,
        updateProject,
        deleteProject,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        addLanguageSkill,
        updateLanguageSkill,
        deleteLanguageSkill,
        addTraining,
        updateTraining,
        deleteTraining,
        saveToLocalStorage
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}



