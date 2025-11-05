import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Key, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import UserInfoCard from '../../components/student/UserInfoCard'
import StudentCalendar from '../../components/student/StudentCalendar'
import ActivityHeatmap from '../../components/student/ActivityHeatmap'
import EnrollCodeModal from '../../components/modals/EnrollCodeModal'
import { mockUser } from '../../mocks'
import { getCourses } from '../../core/api/courses'
import type { Course } from '../../types'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // 강좌 목록 새로고침용

  // 등록된 강좌 정보 로드 함수
  const loadEnrolledCourses = async () => {
    if (!isLoggedIn || !user) return

    // 로컬 스토리지에서 등록된 강좌 ID 목록 가져오기
    const enrolledCourseIds = JSON.parse(
      localStorage.getItem('enrolledCourseIds') || '[]'
    ) as number[]

    if (enrolledCourseIds.length === 0) {
      setCourses([])
      return
    }

    try {
      setLoading(true)
      const allCourses = await getCourses()
      const enrolledCourses = allCourses.filter(course =>
        enrolledCourseIds.includes(Number(course.id))
      )
      setCourses(enrolledCourses)
    } catch (error) {
      console.error('등록된 강의 목록 로드 실패:', error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  // 수강코드로 등록한 강좌만 표시 (로컬 스토리지에서 관리)
  useEffect(() => {
    loadEnrolledCourses()
  }, [isLoggedIn, user, refreshKey])

  // 수강코드 등록 성공 시 강좌 목록 새로고침
  const handleEnrollSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  // 강좌 목록에서 제거
  const handleRemoveCourse = (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation() // 카드 클릭 이벤트 방지

    if (window.confirm('정말 이 강좌를 목록에서 제거하시겠습니까?')) {
      const enrolledCourseIds = JSON.parse(
        localStorage.getItem('enrolledCourseIds') || '[]'
      ) as number[]

      const updatedIds = enrolledCourseIds.filter(id => id !== courseId)
      localStorage.setItem('enrolledCourseIds', JSON.stringify(updatedIds))

      // 목록 새로고침
      setRefreshKey(prev => prev + 1)
    }
  }

  // 비로그인 상태일 때 환영 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/welcome', { replace: true })
    }
  }, [isLoggedIn, user, navigate])

  // 로그인되지 않은 상태면 아무것도 렌더링하지 않음
  if (!isLoggedIn || !user) {
    return null
  }

  // Get current date and time
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const timeStr = `오후 ${String(now.getHours() % 12 || 12).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-surface-200">
      <main className="max-w-7xl mx-auto px-2 py-4 md:py-8">
        <div className="space-y-4 md:space-y-6">
          {/* Top Row: Profile (20%) + Right Content (80%) */}
          <div className="grid grid-cols-1 lg:grid-cols-[20%_1fr] gap-4 md:gap-6">
            {/* Left: Profile Card */}
            <div>
              <UserInfoCard user={mockUser} />
            </div>

            {/* Right: Top Content Grid */}
            <div className="space-y-4">
              {/* Row 1: Enroll Code + Last Login */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Enroll Code Section */}
                <div className="card-panel p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="h-4 w-4 md:h-5 md:w-5 text-neutral-700" />
                    <h3 className="text-base md:text-lg font-bold text-neutral-900">수강 코드</h3>
                  </div>
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    코드 입력
                  </button>
                </div>

                {/* Last Login Info */}
                <div className="card-panel p-4 flex items-center justify-between">
                  <span className="text-sm md:text-base font-semibold text-neutral-900">최근 로그인 시각</span>
                  <div className="text-sm md:text-base text-neutral-700 font-medium">
                    {dateStr} {timeStr}
                  </div>
                </div>
              </div>

              {/* Row 2: Calendar + Activity Heatmap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StudentCalendar />
                <ActivityHeatmap />
              </div>
            </div>
          </div>

          {/* Bottom Row: Course Sections (Full Width) */}
          <div className="space-y-6">
            {/* Recent Learning Section */}
            <section className="card-panel p-6 border border-gray-300">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-base-content">최근 학습 강좌</h2>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">로딩 중...</div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">수강 중인 강의가 없습니다.</div>
                ) : (
                  courses.slice(0, 1).map((course) => (
                  <div
                    key={course.id}
                    className="card-panel p-6 cursor-pointer hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 border border-gray-200 relative"
                    onClick={() => navigate(`/student/course/${course.id}`)}
                  >
                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => handleRemoveCourse(Number(course.id), e)}
                      className="absolute top-4 right-4 z-10 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md"
                      aria-label="강좌 제거"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="flex items-center space-x-4">
                      {/* Course Thumbnail */}
                      <div
                        className="w-40 h-24 rounded-lg relative overflow-hidden flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${course.thumbnail || '/photo/bbb.jpg'}')` }}
                      >
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-base-content mb-1">{course.title}</h3>
                        <p className="text-sm text-base-content/70 mb-1">마지막 수강 강의: 타입스크립트</p>
                        <p className="text-sm text-base-content/70 mb-3">마지막 학습 일자: 2025.10.13</p>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/student/learning/${course.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600 px-8 py-3"
                      >
                        이어하기
                      </Link>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </section>

            {/* Learning Now Section - 작은 가로 카드들 */}
            <section className="card-panel p-6 border border-gray-300">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-base-content">
                  수강중인 강좌({courses.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {loading ? (
                  <div className="col-span-full text-center py-8 text-gray-500">로딩 중...</div>
                ) : courses.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    수강 중인 강의가 없습니다.
                  </div>
                ) : (
                  courses.map((course) => (
                  <div
                    key={course.id}
                    className="card-panel p-4 cursor-pointer hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 border border-gray-200 relative"
                    onClick={() => navigate(`/student/course/${course.id}`)}
                  >
                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => handleRemoveCourse(Number(course.id), e)}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md"
                      aria-label="강좌 제거"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="space-y-3">
                      {/* Course Thumbnail */}
                      <div
                        className="w-full h-24 rounded-lg relative overflow-hidden bg-cover bg-center"
                        style={{ backgroundImage: `url('${course.thumbnail || '/photo/ccc.jpg'}')` }}
                      >
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>

                      {/* Course Info */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-base-content line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-base-content/70">강의자: {course.instructor || '강사명 없음'}</p>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-base-content/70">진행률</span>
                            <span className="text-base-content/80 font-medium">{course.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Enroll Code Modal */}
      <EnrollCodeModal
        open={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onEnrollSuccess={handleEnrollSuccess}
      />
    </div>
  )
}
