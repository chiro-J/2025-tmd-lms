import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Mail, Download, MoreVertical, UserPlus, Settings, ChevronDown } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function StudentManagement() {
  const [activeTab, setActiveTab] = useState('enrolled')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const students = [
    { id: 1, name: '김학생', email: 'student1@example.com', group: '기본 그룹', avatar: '김' },
    { id: 2, name: '이학생', email: 'student2@example.com', group: '기본 그룹', avatar: '이' },
    { id: 3, name: '박학생', email: 'student3@example.com', group: '기본 그룹', avatar: '박' },
    { id: 4, name: '최학생', email: 'student4@example.com', group: '기본 그룹', avatar: '최' },
    { id: 5, name: '정학생', email: 'student5@example.com', group: '기본 그룹', avatar: '정' },
  ]


  const rightActions = (
    <>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Settings className="h-4 w-4 mr-1" />
        그룹 편집
      </Button>
      <Link to="/instructor/course/1/invite-students">
        <Button className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl">
          <UserPlus className="h-4 w-4 mr-1" />
          신규 수강자 초대하기
        </Button>
      </Link>
    </>
  )

  return (
    <CoursePageLayout 
      currentPageTitle="전체 수강자"
      rightActions={rightActions}
    >

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-base-300">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'enrolled'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'
                }`}
              >
                수강 중인 수강자 (22)
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300'
                }`}
              >
                대기 중인 수강자 (0)
              </button>
            </nav>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ChevronDown className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">그룹</span>
            </div>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              초기화
            </button>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="이름, 이메일로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-gray-600 rounded-xl">
              <Mail className="h-4 w-4 mr-1" />
              메일 보내기
            </Button>
            <Button variant="outline" className="text-gray-600 rounded-xl">
              <Download className="h-4 w-4 mr-1" />
              파일 내보내기
            </Button>
          </div>
        </div>

        {/* Students Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수강자 번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수강자 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    그룹
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                            {student.avatar}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.group}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900">
                        [→ 퇴장]
                      </button>
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
                <span className="text-sm text-gray-500">2</span>
                <span className="text-sm text-gray-500">3</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">5개씩 보기</span>
              </div>
            </div>
          </div>
        </Card>
    </CoursePageLayout>
  )
}
