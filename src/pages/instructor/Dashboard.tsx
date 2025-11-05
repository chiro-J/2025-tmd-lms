import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Users, Star, Home, BookOpen, Users2, Settings, Key } from 'lucide-react'
import Card from '../../components/ui/Card'
import { getCourses } from '../../core/api/courses'
import type { Course } from '../../types'

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'joint-courses'>('my-courses')
  const [myCourses, setMyCourses] = useState<Course[]>([])
  const [jointCourses] = useState<Course[]>([]) // 공동 제작은 나중에
  const [loading, setLoading] = useState(true)

  // DB에서 강좌 목록 로드
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        const courses = await getCourses()
        // 현재는 모든 강좌를 "내가 개설한 강좌"로 표시 (나중에 instructorId 필터링)
        setMyCourses(courses.map(course => {
          const courseWithDates = course as any
          return {
            id: String(course.id),
            title: course.title,
            status: course.status === 'published' ? '게시됨' : course.status === 'draft' ? '초안' : course.status,
            students: 0, // 나중에 실제 수강생 수로 교체
            rating: 0, // 나중에 실제 평점으로 교체
            lastEdited: courseWithDates.updatedAt ? new Date(courseWithDates.updatedAt).toLocaleDateString('ko-KR') : '방금 전',
            instructor: course.instructor || '김강사',
            image: course.thumbnail || '/photo/bbb.jpg',
          }
        }))
      } catch (error) {
        console.error('강좌 목록 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCourses()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Profile Section */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-800 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-lg text-gray-900 mb-1">김강사</h2>
              <p className="text-xs text-gray-600 mb-4">강의자님, 안녕하세요!</p>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-3 w-3 text-gray-600" />
                  <span className="text-xs text-gray-700">누적 수강생</span>
                  <span className="text-sm text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Star className="h-3 w-3 text-gray-600" />
                  <span className="text-xs text-gray-700">평점</span>
                  <span className="text-sm text-gray-900">0</span>
                </div>
              </div>

              {/* Create Course Button */}
              <Link
                to="/instructor/create"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs flex items-center justify-center space-x-1 transition-colors shadow-lg"
              >
                <PlusCircle className="h-3 w-3" />
                <span>강좌 만들기</span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <Link
                to="/instructor/dashboard"
                className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg text-sm"
              >
                <Home className="h-4 w-4" />
                <span>강의자 홈</span>
              </Link>
              <Link
                to="/instructor/courses?tab=my-courses"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span>내가 개설한 강좌</span>
              </Link>
              <Link
                to="/instructor/courses?tab=joint-courses"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
              >
                <Users2 className="h-4 w-4" />
                <span>공동 제작 중인 강좌</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Introduction Section */}
            <div className="mb-6">
              <h1 className="text-xl text-gray-900 mb-4">소개</h1>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500 mb-4">소개글이 없습니다.</p>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                  소개 작성하기
                </button>
              </div>
            </div>

            {/* Course Tabs */}
            <div className="mb-6">
              <div className="border-b-2 border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('my-courses')}
                    className={`py-4 px-2 border-b-4 text-sm ${
                      activeTab === 'my-courses'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    내가 개설한 강좌 {myCourses.length}
                  </button>
                  <button
                    onClick={() => setActiveTab('joint-courses')}
                    className={`py-4 px-2 border-b-4 text-sm ${
                      activeTab === 'joint-courses'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    공동 제작 중인 강좌 {jointCourses.length}
                  </button>
                </nav>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {loading ? (
                <div className="text-center py-8 text-gray-500">로딩 중...</div>
              ) : activeTab === 'my-courses' ? (
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
                              src={c.image || '/photo/bbb.jpg'}
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
              ) : (
                <div className="space-y-4">
                 {jointCourses.length === 0 ? (
                   <div className="text-center py-12">
                     <Users2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                     <p className="text-gray-500">공동 제작 중인 강좌가 없습니다.</p>
                   </div>
                 ) : jointCourses.map((c) => (
                   <Link
                     key={c.id}
                     to={`/instructor/course/${c.id}/home`}
                     className="block border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-lg transition-all"
                   >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                              src={c.image || '/photo/bbb.jpg'}
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
