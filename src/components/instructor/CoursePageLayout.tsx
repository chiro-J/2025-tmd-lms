import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CourseHeader from './CourseHeader'
import CourseSidebar from './CourseSidebar'
import { getCourse } from '../../core/api/courses'

interface CoursePageLayoutProps {
  currentPageTitle: string
  rightActions?: React.ReactNode
  children: React.ReactNode
}

export default function CoursePageLayout({ currentPageTitle, rightActions, children }: CoursePageLayoutProps) {
  const { id } = useParams()
  const courseId = Number(id) || 1
  const [currentCourse, setCurrentCourse] = useState<{
    id: string
    title: string
    status: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        const course = await getCourse(courseId)
        if (course) {
          // status를 실제 DB 값으로 표시
          const status = course.status === '공개' ? '공개' : '비공개'
          setCurrentCourse({
            id: String(course.id),
            title: course.title,
            status
          })
        }
      } catch (error) {
        console.error('강좌 정보 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [courseId])

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <CourseHeader
        currentCourse={currentCourse || undefined}
        currentPageTitle={currentPageTitle}
      />

      <div className="flex">
        <CourseSidebar currentCourse={currentCourse || undefined} />

        <div className="flex-1 p-6">
          {/* Page Title and Actions */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-base-content">{currentPageTitle}</h1>
              {rightActions && (
                <div className="flex items-center space-x-3">
                  {rightActions}
                </div>
              )}
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
