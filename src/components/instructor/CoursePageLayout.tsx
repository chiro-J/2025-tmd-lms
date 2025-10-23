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
        rightActions={rightActions}
      />

      <div className="flex">
        <CourseSidebar />
        
        <div className="flex-1 p-2">
          {/* Page Title */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-base-content">{currentPageTitle}</h1>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}