import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourseByEnrollmentCode, enrollInCourse, getUserEnrollments } from '../../core/api/courses'
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
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [allExpanded, setAllExpanded] = useState(false)

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

      // 이미 등록된 강의인지 확인
      if (user?.id) {
        try {
          const userId = typeof user.id === 'number' ? user.id : Number(user.id)
          const enrollments = await getUserEnrollments(userId)
          const courseId = Number(foundCourse.id)
          const enrolled = enrollments.some(e => e.courseId === courseId)
          setIsEnrolled(enrolled)
        } catch (error) {
          console.error('수강 상태 확인 실패:', error)
          setIsEnrolled(false)
        }
      }

      // 강의자 정보 가져오기
      if (foundCourse.instructor || (foundCourse as any).instructors) {
        const instructorName = (foundCourse as any).instructors || foundCourse.instructor
        try {
          const { getInstructors } = await import('../../core/api/admin')
          const instructors = await getInstructors()
          const instructor = instructors.find(inst => inst.name === instructorName)

          if (instructor) {
            setInstructorInfo({
              name: instructor.name,
              email: instructor.email
            })
          } else {
            setInstructorInfo({
              name: instructorName,
              email: ''
            })
          }
        } catch (error) {
          setInstructorInfo({
            name: instructorName,
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
        <div className="space-y-8">
          {/* 상단: 수강코드 입력 */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">수강 코드 입력</h2>
            <form onSubmit={handleCheckCode} className="space-y-4 max-w-2xl">
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
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? '확인 중...' : '코드 확인'}
              </Button>
            </form>
          </Card>

          {/* 하단: 강의 정보 */}
          {course && (
            <div className="space-y-6">
              {/* 강의 기본 정보 */}
              <Card className="p-6">
                <div className="space-y-6">
                  {/* 제목과 썸네일 */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* 썸네일 */}
                    <div className="flex-shrink-0 w-full md:w-80 aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={normalizeThumbnailUrl(course.thumbnail)}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* 제목 */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h3>
                    </div>
                  </div>

                  {/* 강의 정보 (기간, 시간, 강사) */}
                  {(((course as any)?.lecturePeriodStart || (course as any)?.lecturePeriodEnd) || (course as any)?.educationSchedule || (course as any)?.instructors || instructorInfo) && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">강의 정보</h4>
                      <div className="space-y-3">
                        {/* 강의 기간 */}
                        {((course as any)?.lecturePeriodStart || (course as any)?.lecturePeriodEnd) && (
                          <div>
                            <span className="text-lg font-semibold text-blue-600">강의 기간:</span>{' '}
                            <span className="text-base text-gray-900">
                              {(course as any).lecturePeriodStart
                                ? new Date((course as any).lecturePeriodStart).toLocaleDateString('ko-KR')
                                : '미정'}{' '}
                              ~{' '}
                              {(course as any).lecturePeriodEnd
                                ? new Date((course as any).lecturePeriodEnd).toLocaleDateString('ko-KR')
                                : '미정'}
                            </span>
                          </div>
                        )}

                        {/* 교육시간 */}
                        {(course as any)?.educationSchedule && (
                          <div>
                            <span className="text-lg font-semibold text-blue-600">교육시간:</span>{' '}
                            <span className="text-base text-gray-900">{(course as any).educationSchedule}</span>
                          </div>
                        )}

                        {/* 강사 정보 */}
                        {((course as any)?.instructors || instructorInfo) && (
                          <div>
                            <span className="text-lg font-semibold text-blue-600">강사:</span>{' '}
                            <span className="text-base text-gray-900">
                              {(course as any)?.instructors || instructorInfo?.name || '미지정'}
                            </span>
                            {instructorInfo?.email && (
                              <>
                                {' '}
                                <span className="text-sm text-gray-500">({instructorInfo.email})</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 강의자 정보 (하단으로 이동) */}
                  {instructorInfo && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base text-gray-700 mb-1">
                            <span className="font-semibold text-gray-900">강의자:</span> <span className="ml-2">{instructorInfo.name}</span>
                          </p>
                          {instructorInfo.email && (
                            <p className="text-base text-gray-700">
                              <span className="font-semibold text-gray-900">이메일:</span> <span className="ml-2">{instructorInfo.email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 등록 버튼 */}
                  <div className="pt-4 border-t border-gray-200 flex justify-end">
                    {isEnrolled ? (
                      <div className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg">
                        이미 등록한 강의입니다
                      </div>
                    ) : (
                      <Button
                        onClick={handleEnroll}
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                      >
                        {isLoading ? '등록 중...' : '강의 등록하기'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* 강좌 소개 - 넓게 배치 */}
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
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">교육과정</h3>
                    {curriculum.length > 0 && (
                      <button
                        onClick={() => {
                          setAllExpanded(!allExpanded)
                          if (allExpanded) {
                            setExpandedModules(new Set())
                          } else {
                            setExpandedModules(new Set(curriculum.map(m => m.id)))
                          }
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {allExpanded ? '모두 접기' : '모두 펼치기'}
                      </button>
                    )}
                  </div>
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
                            className={`p-3 cursor-pointer hover:bg-base-200 transition-colors ${
                              !expandedModules.has(module.id) ? 'pl-6' : ''
                            }`}
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
                              <div className="flex-1 flex items-center space-x-2">
                                <span className="text-primary font-semibold text-sm">
                                  {String(moduleIndex + 1).padStart(2, '0')}
                                </span>
                                <h4 className="font-semibold text-base-content text-base">
                                  {module.title}
                                </h4>
                                {module.lessons && module.lessons.length > 0 && (
                                  <span className="text-xs text-base-content/70">
                                    {module.lessons.length}개
                                  </span>
                                )}
                              </div>
                              {expandedModules.has(module.id) ? (
                                <ChevronUp className="h-4 w-4 text-base-content/60" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-base-content/60" />
                              )}
                            </div>
                          </div>

                          {/* 레슨 목록 */}
                          {expandedModules.has(module.id) && module.lessons && module.lessons.length > 0 && (
                            <div className="bg-white">
                              {module.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="p-3 pl-12 border-b border-gray-100 last:border-b-0 flex items-center space-x-3 hover:bg-gray-50"
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
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

