import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, TrendingUp, MessageSquare } from 'lucide-react'
import { getCourses, getCourseQnAs } from '../../core/api/courses'
import { useAuth } from '../../contexts/AuthContext'
import InstructorSidebar from '../../components/instructor/InstructorSidebar'
import type { Course } from '../../types'
import { normalizeThumbnailUrl } from '../../utils/thumbnail'

function InstructorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myCourses, setMyCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalQnAs: 0,
    unansweredQnAs: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  // DB에서 강좌 목록 로드
  useEffect(() => {
    const loadCourses = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const courses = await getCourses()

        // 일단 모든 강의 표시 (필터링 제거)
        const filteredCourses = courses

        setMyCourses(filteredCourses.map(course => {
          const courseWithDates = course as any
          return {
            id: String(course.id),
            title: course.title,
            status: (course.status as string) === 'published' ? '공개' : (course.status as string) === 'draft' ? '초안' : (course.status as '초안' | '비공개' | '공개' | undefined),
            students: 0, // 나중에 실제 수강생 수로 교체
            rating: 0, // 나중에 실제 평점으로 교체
            lastEdited: courseWithDates.updatedAt ? new Date(courseWithDates.updatedAt).toLocaleDateString('ko-KR') : '방금 전',
            instructor: course.instructor || '김강사',
            image: normalizeThumbnailUrl(course.thumbnail, '/thumbnails/bbb.jpg'),
          }
        }))
      } catch (error) {
        console.error('강좌 목록 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [user])

  // 통계 데이터 로드
  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) {
        setStatsLoading(false)
        return
      }

      try {
        setStatsLoading(true)
        const courses = await getCourses()

        // 일단 모든 강의 표시 (필터링 제거)
        const filteredCourses = courses

        let totalQnAs = 0
        let unansweredQnAs = 0

        for (const course of filteredCourses) {
          try {
            // QnA 통계 집계
            const qnas = await getCourseQnAs(Number(course.id))
            totalQnAs += qnas.length
            unansweredQnAs += qnas.filter(qna => !qna.answers || qna.answers.length === 0).length
          } catch (error) {
            console.error(`강좌 ${course.id} 통계 로드 실패:`, error)
          }
        }

        setStats({ totalQnAs, unansweredQnAs })
      } catch (error) {
        console.error('통계 로드 실패:', error)
      } finally {
        setStatsLoading(false)
      }
    }
    loadStats()
  }, [user])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <InstructorSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl text-gray-900 mb-1">강의자 대시보드</h1>
                  {user && (
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <p className="font-medium text-gray-900">강의자: {user.name || '강의자'}</p>
                      {user.email && (
                        <>
                          <span className="text-gray-400">|</span>
                          <p>{user.email}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            {!statsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => {
                    navigate('/instructor/qna/all')
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">전체 QnA</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalQnAs}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    navigate('/instructor/qna/unanswered')
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-orange-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">미답변 QnA</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.unansweredQnAs}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* My Courses Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h1 className="text-xl text-gray-900 mb-4">나의 강의</h1>
              {loading ? (
                <div className="text-center py-8 text-gray-500">로딩 중...</div>
              ) : (
                <div className="space-y-4">
                 {myCourses.length === 0 ? (
                   <div className="text-center py-12">
                     <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                     <p className="text-gray-500">개설한 강좌가 없습니다.</p>
                     <Link
                       to="/instructor/create"
                       className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm transition-colors"
                     >
                       첫 강좌 만들기
                     </Link>
                   </div>
                 ) : myCourses.map((c) => (
                   <Link
                     key={c.id}
                     to={`/instructor/course/${c.id}/home`}
                     className="block border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-lg transition-all"
                   >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                              src={normalizeThumbnailUrl(c.image, '/thumbnails/bbb.jpg')}
                              alt={c.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg text-gray-900 mb-1">{c.title}</h3>
                            <p className="text-sm text-gray-500">상태: {c.status} · 마지막 편집: {c.lastEdited}</p>
                          </div>
                        </div>
                        <span className="text-blue-600 text-sm">강좌 홈 열기 →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboard
