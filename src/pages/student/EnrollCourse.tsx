import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourseByEnrollmentCode, enrollInCourse } from '../../core/api/courses'
import { useAuth } from '../../contexts/AuthContext'
import { normalizeThumbnailUrl } from '../../utils/thumbnail'
import { safeHtml } from '../../utils/safeHtml'
import { getCurriculum, type CurriculumModule } from '../../core/api/curriculum'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import type { Course } from '../../types'

export default function EnrollCourse() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [course, setCourse] = useState<Course | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [instructorInfo, setInstructorInfo] = useState<{ name: string; email: string } | null>(null)
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([])
  const [curriculumLoading, setCurriculumLoading] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())

  // 수강코드로 강좌 조회
  const handleCheckCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsChecking(true)

    try {
      const foundCourse = await getCourseByEnrollmentCode(code.trim().toUpperCase())
      if (!foundCourse) {
        setError('유효하지 않은 수강 코드입니다.')
        setCourse(null)
        setIsChecking(false)
        return
      }

      // 공개/비공개 설정 확인
      const isPublic = foundCourse.status === '공개'
      if (!isPublic) {
        setError('이 강좌는 비공개 강좌입니다. 수강 신청이 불가능합니다.')
        setCourse(null)
        setIsChecking(false)
        return
      }

      setCourse(foundCourse)
      setError('')

      // 강의자 정보 가져오기
      if (foundCourse.instructor) {
        try {
          const { getInstructors } = await import('../../core/api/admin')
          const instructors = await getInstructors()
          const instructor = instructors.find(inst => inst.name === foundCourse.instructor)

          if (instructor) {
            setInstructorInfo({
              name: instructor.name,
              email: instructor.email
            })
          } else {
            setInstructorInfo({
              name: foundCourse.instructor,
              email: ''
            })
          }
        } catch (error) {
          setInstructorInfo({
            name: foundCourse.instructor,
            email: ''
          })
        }
      }

      // 교육과정 로드
      if (foundCourse.id) {
        try {
          setCurriculumLoading(true)
          const courseId = Number(foundCourse.id)
          const curriculumData = await getCurriculum(courseId)
          setCurriculum(curriculumData)
          // 첫 번째 모듈 자동 펼치기
          if (curriculumData.length > 0) {
            setExpandedModules(new Set([curriculumData[0].id]))
          }
        } catch (error) {
          console.error('교육과정 로드 실패:', error)
          setCurriculum([])
        } finally {
          setCurriculumLoading(false)
        }
      }
    } catch (error: any) {
      console.error('수강코드 확인 실패:', error)
      const errorMessage = error.response?.data?.message || error.message || '수강 코드 확인 중 오류가 발생했습니다.'
      setError(errorMessage)
      setCourse(null)
    } finally {
      setIsChecking(false)
    }
  }

  // 수강 등록
  const handleEnroll = async () => {
    if (!course || !user?.id) {
      setError('로그인이 필요합니다.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const courseId = Number(course.id)
      await enrollInCourse(courseId, typeof user.id === 'number' ? user.id : Number(user.id))

      // localStorage 동기화 (백업용)
      const enrolledCourseIds = JSON.parse(
        localStorage.getItem('enrolledCourseIds') || '[]'
      ) as number[]
      if (!enrolledCourseIds.includes(courseId)) {
        enrolledCourseIds.push(courseId)
        localStorage.setItem('enrolledCourseIds', JSON.stringify(enrolledCourseIds))
      }

      // 강좌 상세 페이지로 이동
      navigate(`/student/course/${course.id}`)
    } catch (error: any) {
      console.error('수강코드 등록 실패:', error)
      const errorMessage = error.response?.data?.message || error.message || '수강 등록 중 오류가 발생했습니다.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="container-page py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 좌측: 수강코드 입력 */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수강 코드 입력</h2>
              <form onSubmit={handleCheckCode} className="space-y-4">
                <div>
                  <label htmlFor="enroll-code" className="block text-sm font-medium text-gray-700 mb-2">
                    수강 코드
                  </label>
                  <input
                    id="enroll-code"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value)
                      setCourse(null)
                      setInstructorInfo(null)
                      setCurriculum([])
                      setExpandedModules(new Set())
                      setError('')
                    }}
                    placeholder="수강 코드를 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus-visible:outline-none text-lg"
                    autoFocus
                    required
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isChecking || !code.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChecking ? '확인 중...' : '코드 확인'}
                </Button>
              </form>
            </Card>
          </div>

          {/* 우측: 강의 정보 */}
          <div className="space-y-6">
            {course ? (
              <>
                {/* 강의 기본 정보 */}
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* 썸네일 - 가로 늘리기 */}
                    <div className="flex-shrink-0">
                      <img
                        src={normalizeThumbnailUrl(course.thumbnail)}
                        alt={course.title}
                        className="w-full md:w-64 h-40 md:h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    {/* 강의 정보 */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h3>
                      {instructorInfo && (
                        <div className="space-y-2 mb-6">
                          <p className="text-base text-gray-700">
                            <span className="font-semibold text-gray-900">강의자:</span> <span className="ml-2">{instructorInfo.name}</span>
                          </p>
                          {instructorInfo.email && (
                            <p className="text-base text-gray-700">
                              <span className="font-semibold text-gray-900">이메일:</span> <span className="ml-2">{instructorInfo.email}</span>
                            </p>
                          )}
                        </div>
                      )}
                      <div className="mt-auto flex justify-end">
                        <Button
                          onClick={handleEnroll}
                          disabled={isLoading}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                        >
                          {isLoading ? '등록 중...' : '강의 등록하기'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 강좌 소개 */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-200">강좌 소개</h3>
                  {course.content ? (
                    <div
                      className="text-gray-700 prose prose-lg max-w-none leading-relaxed"
                      style={{ lineHeight: '1.8' }}
                      dangerouslySetInnerHTML={{ __html: safeHtml(course.content) }}
                    />
                  ) : (
                    <div className="text-gray-500 py-4">강좌 소개 내용이 없습니다.</div>
                  )}
                </Card>

                {/* 교육과정 */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-200">교육과정</h3>
                  {curriculumLoading ? (
                    <div className="text-center py-8 text-gray-500">로딩 중...</div>
                  ) : curriculum.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">교육과정이 없습니다.</div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {curriculum.map((module, moduleIndex) => (
                        <div key={module.id} className="border-b border-gray-200 last:border-b-0">
                          {/* 모듈 헤더 */}
                          <div
                            className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => {
                              const newExpanded = new Set(expandedModules)
                              if (newExpanded.has(module.id)) {
                                newExpanded.delete(module.id)
                              } else {
                                newExpanded.add(module.id)
                              }
                              setExpandedModules(newExpanded)
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {String(moduleIndex + 1).padStart(2, '0')}
                                </span>
                                <h4 className="font-semibold text-gray-900">{module.title}</h4>
                                {module.lessons && module.lessons.length > 0 && (
                                  <span className="text-xs text-gray-500">
                                    ({module.lessons.length}개 레슨)
                                  </span>
                                )}
                              </div>
                              {expandedModules.has(module.id) ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* 레슨 목록 */}
                          {expandedModules.has(module.id) && module.lessons && module.lessons.length > 0 && (
                            <div className="bg-white">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className="p-4 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                                >
                                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <Card className="p-6">
                <div className="text-center py-12">
                  <p className="text-gray-500">좌측에서 수강 코드를 입력하면 강의 정보가 표시됩니다.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

