import { useState } from 'react'
import { Search, Download, Filter, CheckCircle, XCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function AchievementAnalysis() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const students = [
    {
      id: 1,
      name: '김학생',
      email: 'student1@example.com',
      progress: 100,
      completed: true,
      lectures: [true, true, true, true, true, true, true]
    },
    {
      id: 2,
      name: '이학생',
      email: 'student2@example.com',
      progress: 88,
      completed: false,
      lectures: [true, true, true, false, true, false, true]
    },
    {
      id: 3,
      name: '박학생',
      email: 'student3@example.com',
      progress: 81,
      completed: false,
      lectures: [true, true, true, true, false, true, false]
    },
    {
      id: 4,
      name: '최학생',
      email: 'student4@example.com',
      progress: 77,
      completed: false,
      lectures: [true, true, false, true, true, false, true]
    },
    {
      id: 5,
      name: '정학생',
      email: 'student5@example.com',
      progress: 73,
      completed: false,
      lectures: [true, false, true, true, false, true, false]
    },
  ]

  const lectures = [
    '1강 이론', '2강 이론', '3강 이론', '4강 이론', '5강 이론', '6강 이론', '7강 이론'
  ]

  const rightActions = (
    <>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Filter className="h-4 w-4 mr-1" />
        필터
      </Button>
      <Button className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl">
        <Download className="h-4 w-4 mr-1" />
        내보내기
      </Button>
    </>
  )

  return (
    <CoursePageLayout
      currentPageTitle="성취도 분석"
      rightActions={rightActions}
    >
      <div className="mb-4">
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-base-content/70">전체</span>
          </div>
          <span className="text-sm text-base-content/50">12:49 업데이트</span>
        </div>
      </div>

        {/* Filters */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="completed" className="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded" />
              <label htmlFor="completed" className="text-sm text-base-content/80">완료</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="incomplete" className="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded" />
              <label htmlFor="incomplete" className="text-sm text-base-content/80">미완료</label>
            </div>
            <span className="text-sm text-base-content/70">총 26개 강의</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="수강생 이름, 이메일로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-base-300 rounded-lg text-sm bg-base-100 text-base-content focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="text-base-content/70 rounded-xl">
              <Filter className="h-4 w-4 mr-1" />
              필터
            </Button>
            <Button variant="outline" className="text-base-content/70 rounded-xl">
              <Download className="h-4 w-4 mr-1" />
              내보내기
            </Button>
          </div>
        </div>

        {/* Progress Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-base-300" style={{ minWidth: '800px' }}>
              <thead className="bg-base-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider w-20">
                    번호
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider w-48">
                    수강자 정보
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider w-24">
                    진도율
                  </th>
                  {lectures.map((lecture, index) => (
                    <th key={index} className="px-2 py-2 text-center text-xs font-medium text-base-content/70 uppercase tracking-wider w-16">
                      {lecture}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-300">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-base-200">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium text-base-content">{index + 1}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-base-300 flex items-center justify-center text-sm font-medium text-base-content">
                            {student.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-base-content">{student.name}</div>
                          <div className="text-sm text-base-content/70 truncate max-w-32">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-base-content">{student.progress}%</span>
                        {student.completed && (
                          <CheckCircle className="ml-1 h-4 w-4 text-success" />
                        )}
                      </div>
                    </td>
                    {student.lectures.map((completed, lectureIndex) => (
                      <td key={lectureIndex} className="px-2 py-2 whitespace-nowrap text-center">
                        {completed ? (
                          <CheckCircle className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-error mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-base-100 px-3 py-2 flex items-center justify-between border-t border-base-300">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-base-300 text-sm font-medium rounded-md text-base-content/70 bg-base-100 hover:bg-base-200">
                이전
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-base-300 text-sm font-medium rounded-md text-base-content/70 bg-base-100 hover:bg-base-200">
                다음
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-base-content/70">1</span>
                <span className="text-sm text-base-content/50">2</span>
                <span className="text-sm text-base-content/50">3</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-base-content/70">10개씩 보기</span>
              </div>
            </div>
          </div>
        </Card>
    </CoursePageLayout>
  )
}





