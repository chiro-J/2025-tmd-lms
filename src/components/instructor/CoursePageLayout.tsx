import CourseHeader from './CourseHeader'
import CourseSidebar from './CourseSidebar'

interface CoursePageLayoutProps {
  currentPageTitle: string
  rightActions?: React.ReactNode
  children: React.ReactNode
}

export default function CoursePageLayout({ currentPageTitle, rightActions, children }: CoursePageLayoutProps) {

  // Mock current course data
  const currentCourse = {
    id: '1',
    title: '(1회차) 풀스택 과정',
    status: '비공개'
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <CourseHeader
        currentCourse={currentCourse}
        currentPageTitle={currentPageTitle}
      />

      <div className="flex">
        <CourseSidebar />

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
