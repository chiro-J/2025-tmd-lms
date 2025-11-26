import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Search, Mail, Download, MoreVertical, UserPlus, Settings, ChevronDown, UserX } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import { getCourseEnrollments, unenrollFromCourse, type CourseEnrollment } from '../../core/api/courses'

export default function ManageStudents() {
  const { id } = useParams()
  const courseId = Number(id) || 1
  const [activeTab, setActiveTab] = useState('enrolled')
  const [searchTerm, setSearchTerm] = useState('')
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        setLoading(true)
        const data = await getCourseEnrollments(courseId)
        setEnrollments(data)
      } catch (error) {
        console.error('수강자 목록 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEnrollments()
  }, [courseId])

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRemoveStudent = async (enrollment: CourseEnrollment) => {
    if (!window.confirm(`정말 ${enrollment.user.name}님을 수강에서 제외하시겠습니까?`)) {
      return
    }

    try {
      await unenrollFromCourse(courseId, enrollment.user.id)
      // 목록에서 제거
      setEnrollments(prev => prev.filter(e => e.id !== enrollment.id))
      alert('수강자가 제외되었습니다.')
    } catch (error) {
      console.error('수강자 제외 실패:', error)
      alert('수강자 제외에 실패했습니다.')
    }
  }


  const rightActions = (
    <Link to="/instructor/course/1/invite-students">
      <Button className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl">
        <UserPlus className="h-4 w-4 mr-1" />
        신규 수강자 초대하기
      </Button>
    </Link>
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
                수강 중인 수강자 ({enrollments.length})
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
                    수강자 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      로딩 중...
                    </td>
                  </tr>
                ) : filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      수강자가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((enrollment, index) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enrollment.user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => handleRemoveStudent(enrollment)}
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5"
                        >
                          <UserX className="h-4 w-4" />
                          강의에서 제외
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
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





