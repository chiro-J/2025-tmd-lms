import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, ClipboardList, Calendar, ChevronLeft, ChevronRight, Bell } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CourseSidebar from '../../components/instructor/CourseSidebar'
import CourseHeader from '../../components/instructor/CourseHeader'
import { getCourse, getCourseNotices, type CourseNotice } from '../../core/api/courses'

export default function NoticeManagement() {
  const { id } = useParams()
  const navigate = useNavigate()
  const courseId = Number(id) || 1
  const [notices, setNotices] = useState<CourseNotice[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentCourse, setCurrentCourse] = useState<{ id: string; title: string; status: string } | null>(null)
  const itemsPerPage = 10

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const course = await getCourse(courseId)
        if (course) {
          setCurrentCourse({
            id: String(course.id),
            title: course.title,
            status: (course.status as string) === 'published' ? '공개' : '비공개'
          })
        }
        const data = await getCourseNotices(courseId)
        setNotices(data)
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [courseId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalPages = Math.ceil(notices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNotices = notices.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CourseHeader
          currentCourse={currentCourse || undefined}
          currentPageTitle="공지 관리"
        />
        <div className="flex">
          <CourseSidebar currentCourse={currentCourse || undefined} />
          <div className="flex-1 p-8 flex items-center justify-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CourseHeader
        currentCourse={currentCourse || undefined}
        currentPageTitle="공지 관리"
      />

      <div className="flex">
        <CourseSidebar
          currentCourse={currentCourse || undefined}
        />

        <div className="flex-1 p-8">
          {/* Page Title and Action */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-base-content">공지 관리</h1>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              onClick={() => navigate(`/instructor/course/${courseId}/notices/new`)}
            >
              <Plus className="h-4 w-4 mr-1" />
              공지사항 작성
            </Button>
          </div>

          {/* Notices List */}
          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ClipboardList className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-200 rounded-sm transform rotate-12"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                등록된 공지 사항이 없습니다.
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                첫 번째 공지사항을 작성해보세요.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                onClick={() => navigate(`/instructor/course/${courseId}/notices/new`)}
              >
                <Plus className="h-4 w-4 mr-1" />
                첫 공지사항 작성하기
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentNotices.map((notice) => (
                  <button
                    key={notice.id}
                    onClick={() => navigate(`/instructor/course/${courseId}/notice/${notice.id}`)}
                    className="w-full text-left card-panel p-5 hover:shadow-md transition-all hover:bg-gray-50 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {notice.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(notice.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
