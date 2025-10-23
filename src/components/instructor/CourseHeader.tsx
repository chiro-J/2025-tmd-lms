import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'

interface CourseHeaderProps {
  currentCourse?: {
    id: string
    title: string
    status: string
  }
  currentPageTitle?: string
  rightActions?: React.ReactNode
}

export default function CourseHeader({ currentCourse, currentPageTitle, rightActions }: CourseHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Current Course Breadcrumb */}
            {currentCourse && (
              <div className="flex items-center space-x-2">
                <Link 
                  to={`/instructor/course/${currentCourse.id}/home`}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">{currentCourse.title}</span>
                </Link>
                {currentPageTitle && (
                  <>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 font-medium">{currentPageTitle}</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {rightActions}
            <Link to="/instructor/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
              강의자 홈
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
