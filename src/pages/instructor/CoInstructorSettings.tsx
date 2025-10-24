import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, MoreVertical, HelpCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CourseSidebar from '../../components/instructor/CourseSidebar'
import CourseHeader from '../../components/instructor/CourseHeader'

export default function CoInstructorSettings() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Mock current course data
  const currentCourse = {
    id: '1',
    title: '(1회차) 풀스택 과정',
    status: '비공개'
  }
  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: '김강사',
      email: 'instructor1@example.com',
      role: '메인 강의자',
      notificationEnabled: true,
      avatar: '김'
    },
    {
      id: 2,
      name: '김강사',
      email: 'instructor2@example.com',
      role: '공동 강의자',
      notificationEnabled: true,
      avatar: '김'
    },
    {
      id: 3,
      name: '김강사',
      email: 'instructor3@example.com',
      role: '공동 강의자',
      notificationEnabled: false,
      avatar: '김'
    },
    {
      id: 4,
      name: '김강사',
      email: 'instructor4@example.com',
      role: '공동 강의자',
      notificationEnabled: false,
      avatar: '김'
    }
  ])

  const [selectedInstructors, setSelectedInstructors] = useState<number[]>([])

  const handleSelectAll = () => {
    if (selectedInstructors.length === instructors.length) {
      setSelectedInstructors([])
    } else {
      setSelectedInstructors(instructors.map(i => i.id))
    }
  }

  const handleSelectInstructor = (id: number) => {
    setSelectedInstructors(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const toggleNotification = (id: number) => {
    setInstructors(prev =>
      prev.map(instructor =>
        instructor.id === id
          ? { ...instructor, notificationEnabled: !instructor.notificationEnabled }
          : instructor
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CourseHeader
        currentCourse={currentCourse}
        currentPageTitle="공동 강의자 설정"
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
          <h1 className="text-2xl font-bold text-base-content">공동 강의자 설정</h1>
        </div>

        {/* Instructors Section */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">메인/공동 강의자 {instructors.length}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInstructors.length === instructors.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    권한
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일(선택)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      알림 이메일 수신
                      <HelpCircle className="ml-1 h-3 w-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInstructors.includes(instructor.id)}
                        onChange={() => handleSelectInstructor(instructor.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                            {instructor.avatar}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                          <div className="text-sm text-gray-500">{instructor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        instructor.role === '메인 강의자'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {instructor.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instructor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleNotification(instructor.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          instructor.notificationEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            instructor.notificationEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {instructor.role === '메인 강의자' ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <button className="text-red-600 hover:text-red-900">
                          [→ 퇴장]
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                이전
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">1</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">5개씩 보기</span>
              </div>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  )
}
