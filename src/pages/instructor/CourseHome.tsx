import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ClipboardList, Edit3, AlertCircle, Play, Key, File } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import { getCourse, getCourseNotices, type CourseNotice } from '../../core/api/courses'
import { getCurriculum, type CurriculumModule, type Lesson } from '../../core/api/curriculum'
import { getLearningProgress } from '../../core/api/learning-progress'
import { useAuth } from '../../contexts/AuthContext'
import ViewEnrollmentCodeModal from '../../components/modals/ViewEnrollmentCodeModal'
import { normalizeThumbnailUrl } from '../../utils/thumbnail'

export default function CourseHome() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const courseId = Number(id) || 1
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showEnrollmentCodeModal, setShowEnrollmentCodeModal] = useState(false)
  const [notices, setNotices] = useState<CourseNotice[]>([])
  const [noticesLoading, setNoticesLoading] = useState(true)
  const [recentLesson, setRecentLesson] = useState<{ module: CurriculumModule; lesson: Lesson } | null>(null)
  const [curriculumLoading, setCurriculumLoading] = useState(true)
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([])

  // DB에서 강좌 정보 로드
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        const courseData = await getCourse(courseId)
        setCourse(courseData)
      } catch (error) {
        console.error('강좌 정보 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [courseId])

  // DB에서 공지사항 로드 (최대 3개)
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setNoticesLoading(true)
        const noticesData = await getCourseNotices(courseId)
        // 최신순으로 정렬하고 최대 3개만
        const sorted = noticesData.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setNotices(sorted.slice(0, 3))
      } catch (error) {
        console.error('공지사항 로드 실패:', error)
        setNotices([])
      } finally {
        setNoticesLoading(false)
      }
    }
    loadNotices()
  }, [courseId])

  // DB에서 커리큘럼 로드하여 마지막으로 본 레슨 찾기 (백엔드 API 사용)
  useEffect(() => {
    const loadRecentLesson = async () => {
      try {
        setCurriculumLoading(true)
        const curriculumData = await getCurriculum(courseId)
        setCurriculum(curriculumData)

        // 백엔드 API에서 마지막으로 본 레슨 조회
        let lastLearnedLessonId: number | null = null
        if (user?.id) {
          const userId = typeof user.id === 'number' ? user.id : Number(user.id)
          const progress = await getLearningProgress(userId, courseId)
          if (progress?.lessonId) {
            lastLearnedLessonId = progress.lessonId
          }
        }

        // localStorage 폴백 (기존 데이터 호환성)
        if (!lastLearnedLessonId) {
          const localLastLearned = localStorage.getItem(`lastLearnedLesson_${courseId}`)
          if (localLastLearned) {
            const parsed = Number(localLastLearned)
            if (!isNaN(parsed)) {
              lastLearnedLessonId = parsed
            }
          }
        }

        if (lastLearnedLessonId && curriculumData.length > 0) {
          // 모든 모듈과 레슨을 순회하며 마지막으로 본 레슨 찾기
          for (const module of curriculumData) {
            if (module.lessons && module.lessons.length > 0) {
              const foundLesson = module.lessons.find(lesson => {
                const lessonId = Number(lesson.id)
                return lessonId === lastLearnedLessonId
              })

              if (foundLesson) {
                setRecentLesson({
                  module,
                  lesson: foundLesson
                })
                return
              }
            }
          }
        }

        // 마지막으로 본 레슨이 없으면 첫 번째 모듈의 첫 번째 레슨 표시
        for (const module of curriculumData) {
          if (module.lessons && module.lessons.length > 0) {
            // order 순서대로 정렬
            const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order)
            setRecentLesson({
              module,
              lesson: sortedLessons[0]
            })
            break
          }
        }
      } catch (error) {
        console.error('커리큘럼 로드 실패:', error)
        setRecentLesson(null)
      } finally {
        setCurriculumLoading(false)
      }
    }
    loadRecentLesson()
  }, [courseId, user?.id])

  if (loading) {
    return (
      <CoursePageLayout currentPageTitle="강좌 홈">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </CoursePageLayout>
    )
  }

  if (!course) {
    return (
      <CoursePageLayout currentPageTitle="강좌 홈">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">강좌를 찾을 수 없습니다.</div>
        </div>
      </CoursePageLayout>
    )
  }

  return (
    <CoursePageLayout
      currentPageTitle="강좌 홈"
    >
      {/* Course Overview Card */}
      <Card className="p-8 mb-8">
        <div className="flex items-start gap-8">
          <div className="flex items-start space-x-8 flex-1">
            {/* Course Image */}
            <div className="w-96 aspect-video rounded-xl overflow-hidden flex-shrink-0 shadow-lg bg-gray-100">
              <img
                src={normalizeThumbnailUrl(course.thumbnail)}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Course Info */}
            <div className="flex-1 flex flex-col justify-between min-h-[240px]">
              <div>
                <h2 className="text-3xl font-bold text-base-content mb-4">{course.title}</h2>

                {/* Course Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                  {course.instructor && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">강의자:</span>
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  {course.status && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">상태:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === '공개' ? 'bg-green-100 text-green-800' :
                        course.status === '비공개' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                  )}
                  {curriculum && curriculum.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">모듈:</span>
                      <span>{curriculum.length}개</span>
                    </div>
                  )}
                  {curriculum && curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">레슨:</span>
                      <span>{curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}개</span>
                    </div>
                  )}
                </div>

                {/* Course Description (if available) */}
                {course.content && (
                  <div className="mb-4">
                    <div
                      className="text-sm text-gray-600 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.content }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons - 우측 하단 가로 배치 */}
              <div className="flex items-center justify-end gap-3">
                <Link to={`/instructor/course/${id}/info`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 text-base">
                    <Edit3 className="h-5 w-5 mr-2" />
                    강좌 정보 편집
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowEnrollmentCodeModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 text-base"
                >
                  <Key className="h-5 w-5 mr-2" />
                  수강코드 보기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>


      {/* Content Sections */}
      <div className="space-y-8">
        {/* Ongoing Class */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">최근 진행한 강의</h3>
            {recentLesson && (
              <Button
                onClick={() => navigate(`/instructor/course/${id}/learning?lesson=${recentLesson.lesson.id}`)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2"
              >
                이어 하기
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {curriculumLoading ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">로딩 중...</p>
              </div>
            ) : recentLesson ? (
              <div
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => navigate(`/instructor/course/${id}/learning?lesson=${recentLesson.lesson.id}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Play className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{recentLesson.module.title} - {recentLesson.lesson.title}</h4>
                    <p className="text-sm text-gray-600">현재 진행 중</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">등록된 강의가 없습니다.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Posted Announcements */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">공지사항</h3>
            <Button
              onClick={() => navigate(`/instructor/course/${id}/notices`)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2"
            >
              바로가기
            </Button>
          </div>
          {noticesLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">로딩 중...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    navigate(`/instructor/course/${courseId}/notice/${notice.id}`)
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notice.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">
                        {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </p>
                      {notice.attachments && notice.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-blue-600 text-sm">
                          <File className="h-3 w-3" />
                          <span>첨부파일 {notice.attachments.length}개</span>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Exams */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">시험관리</h3>
            <Button
              onClick={() => navigate(`/instructor/course/${id}/exams`)}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-2"
            >
              바로가기
            </Button>
          </div>
          <div className="h-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ClipboardList className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs">등록된 시험이 없습니다.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 수강코드 모달 */}
      <ViewEnrollmentCodeModal
        open={showEnrollmentCodeModal}
        onClose={() => setShowEnrollmentCodeModal(false)}
        enrollmentCode={course?.enrollmentCode}
      />
    </CoursePageLayout>
  )
}
