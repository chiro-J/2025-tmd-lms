import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

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

  // 이력서 정보
  education: Education[]
  experience: Experience[]
  projects: Project[]
  certificates: Certificate[]
  skills: string[]
  portfolioUrl?: string
  resumeTemplate: ResumeTemplate // 이력서 템플릿
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
    education: [],
    experience: [],
    projects: [],
    certificates: [],
    skills: [],
    resumeTemplate: 'modern'
  })

  // localStorage에서 데이터 로드
  useEffect(() => {
    if (!user) return

    const loadFromLocalStorage = () => {
      const savedProfile = localStorage.getItem(`profile_${userId}`)

      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          setProfileData({
            ...parsed,
            name: user.name || parsed.name || '',
            email: user.email || parsed.email || '',
            phone: user.phone || parsed.phone || ''
          })
        } catch (error) {
          console.error('Failed to parse profile data:', error)
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
          education: [],
          experience: [],
          projects: [],
          certificates: [],
          skills: [],
          resumeTemplate: 'modern'
        })
      }
    }

    loadFromLocalStorage()
  }, [user, userId])

  const saveToLocalStorage = () => {
    if (!userId) return
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData))
  }

  // 자동 저장: profileData 변경 시 자동으로 localStorage에 저장
  useEffect(() => {
    if (!userId || !user) return

    const timer = setTimeout(() => {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData))
    }, 1000) // 1초 디바운스

    return () => clearTimeout(timer)
  }, [profileData, userId, user])

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }))
  }

  // Education 관리
  const addEducation = (education: Education) => {
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, education]
    }))
  }

  const updateEducation = (id: string, education: Partial<Education>) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...education } : edu
      )
    }))
  }

  const deleteEducation = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  // Experience 관리
  const addExperience = (experience: Experience) => {
    setProfileData(prev => ({
      ...prev,
      experience: [...prev.experience, experience]
    }))
  }

  const updateExperience = (id: string, experience: Partial<Experience>) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, ...experience } : exp
      )
    }))
  }

  const deleteExperience = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  // Project 관리
  const addProject = (project: Project) => {
    setProfileData(prev => ({
      ...prev,
      projects: [...prev.projects, project]
    }))
  }

  const updateProject = (id: string, project: Partial<Project>) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, ...project } : proj
      )
    }))
  }

  const deleteProject = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }))
  }

  // Certificate 관리
  const addCertificate = (certificate: Certificate) => {
    setProfileData(prev => ({
      ...prev,
      certificates: [...prev.certificates, certificate]
    }))
  }

  const updateCertificate = (id: string, certificate: Partial<Certificate>) => {
    setProfileData(prev => ({
      ...prev,
      certificates: prev.certificates.map(cert =>
        cert.id === id ? { ...cert, ...certificate } : cert
      )
    }))
  }

  const deleteCertificate = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== id)
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



