import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ClipboardList, Edit3, AlertCircle, Play, Key } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import { getCourse, getCourseNotices, type CourseNotice } from '../../core/api/courses'
import ViewEnrollmentCodeModal from '../../components/modals/ViewEnrollmentCodeModal'

export default function CourseHome() {
  const { id } = useParams()
  const navigate = useNavigate()
  const courseId = Number(id) || 1
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showEnrollmentCodeModal, setShowEnrollmentCodeModal] = useState(false)
  const [notices, setNotices] = useState<CourseNotice[]>([])
  const [noticesLoading, setNoticesLoading] = useState(true)

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
      <Card className="p-6 mb-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start space-x-6 flex-1">
            {/* Course Image */}
            <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={course.thumbnail || '/photo/aaa.jpg'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Course Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-base-content mb-4">{course.title}</h2>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Link to={`/instructor/course/${id}/info`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    <Edit3 className="h-4 w-4 mr-2" />
                    강좌 정보 편집
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 수강코드 버튼 - 오른쪽 */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowEnrollmentCodeModal(true)}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors shadow-md"
            >
              <Key className="h-5 w-5" />
              <span>수강코드 보기</span>
            </button>
          </div>
        </div>
      </Card>


      {/* Content Sections */}
      <div className="space-y-8">
        {/* Ongoing Class */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">최근 진행한 강의</h3>
            <Button
              onClick={() => navigate(`/instructor/course/${id}/edit`)}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2"
            >
              이어 하기
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">1강. React 기초</h4>
                  <p className="text-sm text-gray-600">현재 진행 중</p>
                </div>
              </div>
            </div>
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
                    <div>
                      <h4 className="font-medium text-gray-900">{notice.title}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </p>
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
