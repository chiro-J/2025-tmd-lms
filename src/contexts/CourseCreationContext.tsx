import { createContext, useContext, useState, ReactNode } from 'react'

export interface CourseCreationData {
  // Step 1 - Essential Settings
  title: string
  thumbnail: string | null
  difficulty: '쉬움' | '보통' | '어려움'
  isPublic: boolean
  applicationStartDate: string
  applicationEndDate: string

  // Step 2 - Introduction
  tags: string[]
  category1: string
  category2: string
  durationStartDate: string
  durationEndDate: string
  description: string
  videoUrl: string
  content: string
  uploadedImages: {url: string, name: string}[]
  uploadedFiles: {url: string, name: string}[]
}

interface CourseCreationContextType {
  courseData: CourseCreationData
  updateCourseData: (data: Partial<CourseCreationData>) => void
  resetCourseData: () => void
}

const initialData: CourseCreationData = {
  title: '',
  thumbnail: null,
  difficulty: '보통',
  isPublic: true,
  applicationStartDate: '',
  applicationEndDate: '',
  tags: [],
  category1: '비즈니스',
  category2: '기타',
  durationStartDate: '',
  durationEndDate: '',
  description: '',
  videoUrl: '',
  content: '',
  uploadedImages: [],
  uploadedFiles: []
}

const CourseCreationContext = createContext<CourseCreationContextType | undefined>(undefined)

export function CourseCreationProvider({ children }: { children: ReactNode }) {
  const [courseData, setCourseData] = useState<CourseCreationData>(initialData)

  const updateCourseData = (data: Partial<CourseCreationData>) => {
    setCourseData(prev => ({
      ...prev,
      ...data
    }))
  }

  const resetCourseData = () => {
    setCourseData(initialData)
  }

  return (
    <CourseCreationContext.Provider value={{ courseData, updateCourseData, resetCourseData }}>
      {children}
    </CourseCreationContext.Provider>
  )
}

export function useCourseCreation() {
  const context = useContext(CourseCreationContext)
  if (!context) {
    throw new Error('useCourseCreation must be used within CourseCreationProvider')
  }
  return context
}










