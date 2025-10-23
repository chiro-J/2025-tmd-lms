import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ClipboardList } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CourseSidebar from '../../components/instructor/CourseSidebar'
import CourseHeader from '../../components/instructor/CourseHeader'

export default function NoticeManagement() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Mock current course data
  const currentCourse = {
    id: '1',
    title: '(1회차) 풀스택 과정',
    status: '비공개'
  }
  const [notices, setNotices] = useState([]) // Empty for now

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CourseHeader 
        currentCourse={currentCourse}
        currentPageTitle="공지 관리"
      />

      <div className="flex">
        <CourseSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          currentCourse={currentCourse}
        />
        
        <div className="flex-1 p-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">공지 관리</h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-8">
            {/* Clipboard Icon */}
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="h-12 w-12 text-gray-400" />
            </div>
            {/* Paper with folded corner */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-200 rounded-sm transform rotate-12"></div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="absolute top-4 -right-4 w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="absolute -bottom-4 left-4 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            등록된 공지 사항이 없습니다.
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            첫 번째 공지사항을 작성해보세요.
          </p>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            <Plus className="h-4 w-4 mr-1" />
            첫 공지사항 작성하기
          </Button>
        </div>
        </div>
      </div>
    </div>
  )
}
