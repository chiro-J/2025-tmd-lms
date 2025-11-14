import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, FileText, CheckCircle, BookOpen, MessageSquare, Download, Image, Code, Link, Search, LogOut, Calendar, Lock, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../contexts/AuthContext'
// curriculum API는 동적 import로 로드
import { transformApiToDetailFormat } from '../../utils/curriculumTransform'
import { getCourse, getCourseNotices, getCourseQnAs, createCourseQnA, createCourseQnAAnswer, getCourseResources, unenrollFromCourse, type CourseNotice, type CourseQnA, type CourseResource } from '../../core/api/courses'
import { getAssignments } from '../../core/api/assignments'
import { safeHtml } from '../../utils/safeHtml'
import type { Course } from '../../types'
import type { Assignment } from '../../types/assignment'

function CourseNotices({ courseId }: { courseId: number }) {
  const navigate = useNavigate()
  const [notices, setNotices] = useState<CourseNotice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotices = async () => {
      try {
        setLoading(true)
        const data = await getCourseNotices(courseId)
        setNotices(data)
      } catch (error) {
        console.error('공지사항 로드 실패:', error)
        setNotices([])
      } finally {
        setLoading(false)
      }
    }
    loadNotices()
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

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">공지사항</h3>
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">공지사항이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="border border-gray-200 rounded-lg p-4 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/student/course/${courseId}/notice/${notice.id}`)}
              >
                <h4 className="font-medium text-gray-900 mb-2">{notice.title}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(notice.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}

interface CurriculumItem {
  id: string
  title: string
  completed: number
  total: number
  expanded: boolean
  lessons: {
    id: string
    title: string
    completed: boolean
    date?: string
    isLastViewed?: boolean
  }[]
}

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'home' | 'info' | 'exam' | 'notice' | 'resources' | 'qna'>('home')

  // 강의 자료 관련 상태
  const [resources, setResources] = useState<CourseResource[]>([])
  const [resourcesLoading, setResourcesLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // QnA 관련 상태
  const [qnaSearchQuery, setQnaSearchQuery] = useState('')
  const [showAskInline, setShowAskInline] = useState(false)
  const [askTitle, setAskTitle] = useState('')
  const [askText, setAskText] = useState('')
  const [askIsPublic, setAskIsPublic] = useState(true)
  const [qnaList, setQnaList] = useState<CourseQnA[]>([])
  const [qnaLoading, setQnaLoading] = useState(true)
  const [qnaCurrentPage, setQnaCurrentPage] = useState(1)
  const qnaItemsPerPage = 10

  const courseId = Number(id) || 1
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([])
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<Course | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [assignmentsLoading, setAssignmentsLoading] = useState(true)
  const [lastLearnedLessonTitle, setLastLearnedLessonTitle] = useState<string | null>(null)
  const [instructorInfo, setInstructorInfo] = useState<{ name: string; email: string; userId?: number } | null>(null)

  // YouTube URL에서 video ID 추출
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // 강좌 목록에서 제거
  const handleRemoveCourse = async () => {
    if (!user?.id) return

    if (window.confirm('정말 이 강좌를 목록에서 제거하시겠습니까?')) {
      try {
        await unenrollFromCourse(courseId, user.id)
        // 대시보드로 이동
        navigate('/student/dashboard')
      } catch (error) {
        console.error('수강 취소 실패:', error)
        alert('수강 취소에 실패했습니다.')
      }
    }
  }

  // DB에서 강좌 정보 로드
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await getCourse(courseId)
        setCourse(courseData as Course)

        // 강의자 정보 가져오기
        if (courseData.instructor) {
          try {
            // instructors 테이블에서 강의자 정보 찾기
            const { getInstructors } = await import('../../core/api/admin')
            const instructors = await getInstructors()
            const instructor = instructors.find(inst => inst.name === courseData.instructor)

            if (instructor) {
              setInstructorInfo({
                name: instructor.name,
                email: instructor.email,
                userId: instructor.userId
              })
            } else {
              // 찾지 못한 경우 강의자 이름만 표시
              setInstructorInfo({
                name: courseData.instructor,
                email: ''
              })
            }
          } catch (error) {
            // API 실패 시 강의자 이름만 표시
            setInstructorInfo({
              name: courseData.instructor,
              email: ''
            })
          }
        }
      } catch (error) {
        console.error('강좌 정보 로드 실패:', error)
      }
    }

    loadCourse()
  }, [courseId])

  // DB에서 과제 목록 로드
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setAssignmentsLoading(true)
        const assignmentsData = await getAssignments(courseId)
        setAssignments(assignmentsData)
      } catch (error) {
        console.error('과제 목록 로드 실패:', error)
        setAssignments([])
      } finally {
        setAssignmentsLoading(false)
      }
    }

    loadAssignments()
  }, [courseId])

  // DB에서 QnA 목록 로드
  useEffect(() => {
    const loadQnAs = async () => {
      try {
        setQnaLoading(true)
        const qnaData = await getCourseQnAs(courseId)
        setQnaList(qnaData)
      } catch (error) {
        console.error('QnA 목록 로드 실패:', error)
        setQnaList([])
      } finally {
        setQnaLoading(false)
      }
    }

    loadQnAs()
  }, [courseId])

  // DB에서 강의 자료 목록 로드
  useEffect(() => {
    const loadResources = async () => {
      try {
        setResourcesLoading(true)
        const resourcesData = await getCourseResources(courseId)
        setResources(resourcesData)
      } catch (error) {
        console.error('강의 자료 로드 실패:', error)
        setResources([])
      } finally {
        setResourcesLoading(false)
      }
    }

    loadResources()
  }, [courseId])

  // 원본 API 모듈 데이터 저장 (실제 lesson.id 접근용)
  const [originalModules, setOriginalModules] = useState<any[]>([])

  // DB에서 커리큘럼 데이터 로드
  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        setLoading(true)

        // 커리큘럼 데이터 로드
        const { getCurriculum } = await import('../../core/api/curriculum')
        const apiModules = await getCurriculum(courseId)
        const transformed = transformApiToDetailFormat(apiModules)

        // 원본 API 데이터를 저장하여 실제 lesson.id에 접근할 수 있도록 함
        setOriginalModules(apiModules)

        // 임시 완료 처리 (나중에 실제 사용자 진행 데이터로 교체)
        if (transformed.length > 0) {
          transformed[0].completed = 1
          transformed[0].lessons[0].completed = true
          transformed[0].lessons[0].date = '25. 10. 13.'
        }
        if (transformed.length > 1 && transformed[1].lessons.length > 0) {
          transformed[1].completed = transformed[1].lessons.length
          transformed[1].lessons.forEach((lesson, idx) => {
            lesson.completed = true
            lesson.date = `25. 10. ${14 + idx}.`
          })
        }
        if (transformed.length > 2 && transformed[2].lessons.length > 0) {
          transformed[2].completed = transformed[2].lessons.length
          transformed[2].lessons.forEach((lesson, idx) => {
            lesson.completed = true
            lesson.date = `25. 10. ${21 + idx}.`
          })
        }
        if (transformed.length > 3 && transformed[3].lessons.length > 0) {
          transformed[3].completed = 1
          transformed[3].lessons[0].completed = true
          transformed[3].lessons[0].date = '25. 10. 13.'
          transformed[3].lessons[0].isLastViewed = true
        }

        setCurriculum(transformed)

        // 마지막 수강한 레슨 찾기
        const lastLearnedLessonId = localStorage.getItem(`lastLearnedLesson_${courseId}`)
        if (lastLearnedLessonId && transformed.length > 0) {
          for (const module of transformed) {
            const lesson = module.lessons.find(l => {
              if (l.id === lastLearnedLessonId || l.id === `lesson-${lastLearnedLessonId}`) {
                return true
              }
              if (l.id.includes('-')) {
                const parts = l.id.split('-')
                const lessonIdPart = parts[parts.length - 1]
                return lessonIdPart === lastLearnedLessonId || Number(lessonIdPart) === Number(lastLearnedLessonId)
              }
              const lessonIdNum = Number(l.id.replace('lesson-', '').replace(/^.*-/, ''))
              const lastLearnedNum = Number(lastLearnedLessonId)
              return !isNaN(lessonIdNum) && !isNaN(lastLearnedNum) && lessonIdNum === lastLearnedNum
            })
            if (lesson) {
              setLastLearnedLessonTitle(lesson.title)
              break
            }
          }
        }
      } catch (error) {
        console.error('커리큘럼 로드 실패:', error)
        setCurriculum([])
      } finally {
        setLoading(false)
      }
    }

    loadCurriculum()
  }, [courseId])

  const [allExpanded, setAllExpanded] = useState(false)

  // 강의 자료 필터링
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // QnA 필터링 로직 (공개된 QnA와 자신의 QnA만 표시)
  const filteredQnA = qnaList.filter(qna => {
    // 공개된 QnA이거나 자신이 작성한 QnA인 경우만 표시
    const isVisible = qna.isPublic || qna.userId === user?.id

    if (!isVisible) return false

    const userName = (qna.user.name || qna.user.username || '').toLowerCase()
    const matchesSearch = (qna.title?.toLowerCase().includes(qnaSearchQuery.toLowerCase()) || false) ||
                          qna.question.toLowerCase().includes(qnaSearchQuery.toLowerCase()) ||
                          userName.includes(qnaSearchQuery.toLowerCase())
    return matchesSearch
  })

  // QnA 페이지네이션 계산
  const qnaTotalPages = Math.ceil(filteredQnA.length / qnaItemsPerPage)
  const qnaStartIndex = (qnaCurrentPage - 1) * qnaItemsPerPage
  const qnaEndIndex = qnaStartIndex + qnaItemsPerPage
  const paginatedQnA = filteredQnA.slice(qnaStartIndex, qnaEndIndex)

  // 검색어 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setQnaCurrentPage(1)
  }, [qnaSearchQuery])

  // 강의 자료 타입별 아이콘
  const getTypeIcon = (type: CourseResource['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />
      case 'slide':
        return <Image className="h-5 w-5 text-blue-600" />
      case 'code':
        return <Code className="h-5 w-5 text-green-600" />
      case 'link':
        return <Link className="h-5 w-5 text-purple-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  // 강의 자료 타입별 라벨
  const getTypeLabel = (type: CourseResource['type']) => {
    switch (type) {
      case 'pdf':
        return 'PDF'
      case 'slide':
        return '슬라이드'
      case 'code':
        return '코드'
      case 'link':
        return '링크'
      default:
        return '파일'
    }
  }

  // 강의 자료 타입별 색상
  const getTypeColor = (type: CourseResource['type']) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800'
      case 'slide':
        return 'bg-blue-100 text-blue-800'
      case 'code':
        return 'bg-green-100 text-green-800'
      case 'link':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 다운로드 핸들러
  const handleDownload = (resource: CourseResource) => {
    if (resource.type === 'link' && resource.linkUrl) {
      window.open(resource.linkUrl, '_blank')
    } else if (resource.type === 'code' && resource.code) {
      // 코드는 새 창에서 표시
      const codeWindow = window.open('', '_blank')
      if (codeWindow) {
        codeWindow.document.write(`
          <html>
            <head><title>${resource.title}</title></head>
            <body style="font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4;">
              <pre style="white-space: pre-wrap; word-wrap: break-word;">${resource.code}</pre>
            </body>
          </html>
        `)
      }
    } else if (resource.fileUrl && resource.downloadAllowed) {
      // 파일 다운로드
      window.open(resource.fileUrl, '_blank')
    } else if (!resource.downloadAllowed) {
      alert('다운로드가 허용되지 않은 자료입니다.')
    }
  }

  const toggleCurriculum = (id: string) => {
    setCurriculum(prev => prev.map(item =>
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ))
  }

  const toggleAll = () => {
    setAllExpanded(!allExpanded)
    setCurriculum(prev => prev.map(item => ({ ...item, expanded: !allExpanded })))
  }

  const handleLessonClick = (lessonId: string) => {
    // lessonId가 "3-1" 형식인 경우 실제 lesson ID만 추출
    let actualLessonId = lessonId
    if (lessonId.includes('-')) {
      const parts = lessonId.split('-')
      // 마지막 부분이 실제 lesson ID
      actualLessonId = parts[parts.length - 1]
    }

    // 원본 모듈 데이터에서 실제 lesson ID 확인
    for (const module of originalModules) {
      const lesson = module.lessons?.find((l: any) => {
        const transformedId = `${module.id}-${l.id}`
        return transformedId === lessonId || String(l.id) === actualLessonId
      })
      if (lesson) {
        actualLessonId = String(lesson.id)
        break
      }
    }

    navigate(`/student/learning/${id}?lesson=${actualLessonId}`)
  }

  const tabs = [
    { id: 'home', label: '강좌 홈', icon: BookOpen },
    { id: 'info', label: '강좌 정보', icon: FileText },
    { id: 'exam', label: '시험/과제', icon: CheckCircle },
    { id: 'resources', label: '강의 자료', icon: FileText },
    { id: 'qna', label: 'Q&A', icon: MessageSquare }
  ] as const


  if (!course) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content">
        <main className="container-page py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">강좌 정보를 불러오는 중...</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="container-page py-8">
        {/* Course Header */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-80 h-48 rounded-xl overflow-hidden flex-shrink-0 relative">
              <img
                src={course?.thumbnail || '/photo/bbb.jpg'}
                alt={course?.title || '강좌 썸네일'}
                className="w-full h-full object-cover"
              />
              {course?.title && (
                <div className="absolute bottom-2 left-2 text-white font-bold text-sm">
                  {course.title.length > 10 ? course.title.substring(0, 10) + '...' : course.title}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {course?.title || '강좌 제목'}
                </h1>
                {lastLearnedLessonTitle ? (
                  <p className="text-gray-600 mb-4">마지막 수강: {lastLearnedLessonTitle}</p>
                ) : (
                  <p className="text-gray-600 mb-4">마지막 수강: 수강 기록이 없습니다</p>
                )}
              </div>

              <div className="flex space-x-3 mb-4">
                <Button
                  onClick={() => navigate(`/student/learning/${id}`)}
                  className="px-8 py-3 flex items-center justify-center"
                >
                  이어하기
                </Button>
                <Button
                  onClick={handleRemoveCourse}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>수강 취소</span>
                </Button>
              </div>

              {/* 강의자 정보 섹션 */}
              {instructorInfo && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        강의자: {instructorInfo.name}
                      </p>
                      {instructorInfo.email && (
                        <p className="text-xs text-gray-600">{instructorInfo.email}</p>
                      )}
                    </div>
                    <Button
                      onClick={async () => {
                        // DB에서 강의자 소개 불러오기
                        const instructorName = instructorInfo.name
                        let introduction: string | null = null

                        try {
                          // instructorId로 DB에서 불러오기
                          if (instructorInfo.userId) {
                            // 먼저 instructors 테이블에서 instructorId 찾기
                            const { getInstructors } = await import('../../core/api/admin')
                            const instructors = await getInstructors()
                            const instructor = instructors.find(inst => inst.userId === instructorInfo.userId)

                            if (instructor?.id) {
                              const { getInstructorIntroductionPublic } = await import('../../core/api/admin')
                              introduction = await getInstructorIntroductionPublic(instructor.id)
                            }
                          }
                        } catch (error) {
                          console.error('DB에서 강의자 소개 로드 실패:', error)
                        }

                        // DB에서 못 찾으면 localStorage에서 찾기 (하위 호환성)
                        if (!introduction) {
                          if (instructorInfo.userId) {
                            const userId = typeof instructorInfo.userId === 'number'
                              ? instructorInfo.userId
                              : (typeof instructorInfo.userId === 'string' ? parseInt(instructorInfo.userId, 10) : null)

                            if (userId) {
                              introduction = localStorage.getItem(`instructor_bio_blocks_${userId}`)
                              if (!introduction) {
                                introduction = localStorage.getItem(`instructor_bio_${userId}`)
                              }
                            }
                          }

                          if (!introduction) {
                            introduction = localStorage.getItem(`instructor_bio_blocks_${instructorName}`)
                            if (!introduction) {
                              introduction = localStorage.getItem(`instructor_bio_${instructorName}`)
                            }
                          }
                        }

                        if (introduction) {
                          // 새 창에서 강의자 소개 표시
                          const newWindow = window.open('', '_blank')
                          if (newWindow) {
                            try {
                              let content: any[]
                              try {
                                const parsed = JSON.parse(introduction)
                                content = Array.isArray(parsed) ? parsed : [{ type: 'markdown', content: introduction }]
                              } catch {
                                content = [{ type: 'markdown', content: introduction }]
                              }

                              newWindow.document.write(`
                                <html>
                                  <head><title>${instructorName} 강의자 소개</title></head>
                                  <body style="font-family: sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
                                    <h1>${instructorName} 강의자 소개</h1>
                                    <div style="margin-top: 20px;">
                                      ${content.map((block: any) => {
                                        if (block.type === 'markdown') {
                                          return `<div>${block.content.replace(/\n/g, '<br>')}</div>`
                                        } else if (block.type === 'lexical') {
                                          return `<div>${block.content}</div>`
                                        }
                                        return ''
                                      }).join('')}
                                    </div>
                                  </body>
                                </html>
                              `)
                            } catch (error) {
                              console.error('소개글 표시 실패:', error)
                              alert('강의자 소개를 표시하는 중 오류가 발생했습니다.')
                            }
                          }
                        } else {
                          alert('강의자 소개가 아직 작성되지 않았습니다.')
                        }
                      }}
                      variant="outline"
                      className="px-4 py-2 text-sm"
                    >
                      강의자 소개
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-6">
          <div className="tabs tabs-boxed p-2" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'home' && (
              <div id="tabpanel-home" role="tabpanel" aria-labelledby="tab-home">
                <div className="border border-base-300 rounded-lg overflow-hidden">
                  {/* Header Row */}
                  <div className="p-3 bg-base-200 border-b border-base-300">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-base-content text-sm">교육 과정</h3>
                      <div className="flex items-center space-x-2">
                        {!loading && curriculum.length > 0 && (
                          <>
                            <button
                              onClick={toggleAll}
                              className="text-xs text-base-content/70 hover:text-base-content transition-colors"
                            >
                              {allExpanded ? '모두 접기' : '모두 펼치기'}
                            </button>
                            <ChevronDown className="h-4 w-4 text-base-content/60" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8 text-gray-500">로딩 중...</div>
                  ) : curriculum.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">커리큘럼이 없습니다.</div>
                  ) : (
                    curriculum.map((item, index) => (
                    <div key={item.id}>
                      <div
                        className={`p-3 cursor-pointer hover:bg-base-200 transition-colors border-b border-base-300 last:border-b-0 ${
                          !item.expanded ? 'pl-6' : ''
                        }`}
                        onClick={() => toggleCurriculum(item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 flex items-center space-x-2">
                            <span className="text-primary font-medium text-sm">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <h4 className="font-medium text-base-content text-sm">
                              {item.title}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-base-content/70">
                              {item.completed}/{item.total}
                            </span>
                            {item.expanded ? (
                              <ChevronUp className="h-4 w-4 text-base-content/60" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-base-content/60" />
                            )}
                          </div>
                        </div>
                      </div>

                      {item.expanded && (
                        <div className="bg-base-200">
                          {item.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`p-3 border-b border-base-300 last:border-b-0 cursor-pointer hover:bg-base-100 transition-colors ${
                                lesson.isLastViewed ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLessonClick(lesson.id)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 ml-4">
                                  <FileText className="h-4 w-4 text-base-content/60" />
                                  <span className="text-sm text-base-content/80">{lesson.title}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {lesson.date && (
                                    <span className="text-xs text-base-content/70">수강일: {lesson.date}</span>
                                  )}
                                  {lesson.completed && (
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )))}
                </div>
            </div>
          )}

            {activeTab === 'info' && (
              <div id="tabpanel-info" role="tabpanel" aria-labelledby="tab-info">
                <div className="space-y-6">
                  {/* Course Video */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">소개 영상</h3>
                    {course?.videoUrl ? (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(course.videoUrl) || ''}`}
                          title="강좌 소개 영상"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">소개 영상이 없습니다.</p>
                      </div>
                    )}
                  </Card>

                  {/* Course Content */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">강좌 소개</h3>
                    {course?.content ? (
                      <div
                        className="text-gray-700 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: safeHtml(course.content) }}
                      />
                    ) : (
                      <div className="text-gray-500">강좌 소개 내용이 없습니다.</div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'exam' && (
              <div id="tabpanel-exam" role="tabpanel" aria-labelledby="tab-exam">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">시험/과제</h3>

                  {assignmentsLoading ? (
                    <div className="text-center py-8 text-gray-500">과제 목록을 불러오는 중...</div>
                  ) : assignments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">등록된 과제가 없습니다</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assignments.map((assignment) => {
                        const isPastDue = new Date(assignment.dueDate) < new Date()
                        const statusBadge = isPastDue ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            마감
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            진행 중
                          </span>
                        )

                        return (
                          <div
                            key={assignment.id}
                            className="card p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/student/assignment/${assignment.id}`)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                              </div>
                              {statusBadge}
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm text-gray-500">
                                마감일: {new Date(assignment.dueDate).toLocaleDateString('ko-KR')}
                              </span>
                              <span className="text-sm text-gray-500">
                                만점: {assignment.maxScore}점
                              </span>
                            </div>

                            {assignment.description && (
                              <p className="text-sm text-gray-600 mb-3">
                                {assignment.description}
                              </p>
                            )}

                            {assignment.instructions && assignment.instructions.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-700 mb-1">제출 안내:</p>
                                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                                  {assignment.instructions.map((instruction, idx) => (
                                    <li key={idx}>{instruction}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {assignment.allowedFileTypes && assignment.allowedFileTypes.length > 0 && (
                              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs font-medium text-blue-900 mb-2">📎 제출 가능한 파일 형식</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {assignment.allowedFileTypes.map((fileType, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 bg-white text-blue-700 text-xs rounded border border-blue-200 font-medium"
                                    >
                                      {fileType.replace('.', '').toUpperCase()}
                                    </span>
                                  ))}
                                </div>
                                {assignment.maxFileSize && (
                                  <div className="text-xs text-blue-700 space-y-1">
                                    <p className="font-medium">📦 최대 파일 크기: {assignment.maxFileSize}MB</p>
                                    <p className="text-blue-600">
                                      • 여러 파일을 제출할 경우 각 파일의 크기가 {assignment.maxFileSize}MB 이하여야 합니다
                                    </p>
                                    <p className="text-blue-600">
                                      • 파일은 ZIP 압축하여 제출할 수 있습니다
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                제출: {assignment.submissions}명 / 총 {assignment.total}명
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/student/assignment/${assignment.id}`)
                                }}
                                className="btn-primary"
                                disabled={isPastDue}
                              >
                                {isPastDue ? '마감됨' : '과제 제출하기'}
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {activeTab === 'resources' && (
              <div id="tabpanel-resources" role="tabpanel" aria-labelledby="tab-resources">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">강의 자료</h3>

                  {/* 검색 */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="자료 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* 강의 자료 목록 */}
                  {resourcesLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">로딩 중...</div>
                    </div>
                  ) : filteredResources.length > 0 ? (
                    <div className="space-y-4">
                      {filteredResources.map((resource) => (
                        <div
                          key={resource.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getTypeIcon(resource.type)}
                              <div>
                                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                                    {getTypeLabel(resource.type)}
                                  </span>
                                  {resource.fileSize && (
                                    <span className="text-xs text-gray-500">
                                      {formatFileSize(resource.fileSize)}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {new Date(resource.createdAt).toLocaleDateString()}
                                  </span>
                                  {!resource.downloadAllowed && (
                                    <span className="text-xs text-red-500">다운로드 불가</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDownload(resource)}
                              className="btn-outline flex items-center space-x-2"
                              disabled={resource.type !== 'link' && resource.type !== 'code' && !resource.downloadAllowed}
                            >
                              <Download className="h-4 w-4" />
                              <span>{resource.type === 'link' ? '열기' : resource.type === 'code' ? '코드 보기' : '다운로드'}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">등록된 강의 자료가 없습니다</p>
                      <p className="text-sm text-gray-500">강의자가 자료를 등록하면 여기에 표시됩니다</p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {activeTab === 'qna' && (
              <div id="tabpanel-qna" role="tabpanel" aria-labelledby="tab-qna">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">질문과 답변</h3>

                  {/* 검색 */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="질문 검색..."
                        value={qnaSearchQuery}
                        onChange={(e) => setQnaSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* QnA 게시판 테이블 */}
                  {qnaLoading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">로딩 중...</div>
                    </div>
                  ) : filteredQnA.length > 0 ? (
                    <Card className="overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-16">번호</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">제목</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">작성자</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">작성일</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedQnA.map((qna, index) => (
                              <tr
                                key={qna.id}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => {
                                  navigate(`/student/course/${courseId}/qna/${qna.id}`)
                                }}
                              >
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {filteredQnA.length - (qnaStartIndex + index)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center space-x-2">
                                    {!qna.isPublic && (
                                      <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    )}
                                    <span className="text-gray-900 font-medium truncate">
                                      {qna.title || '제목 없음'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {qna.user.name || qna.user.username || '알 수 없음'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                  {new Date(qna.createdAt).toLocaleDateString('ko-KR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* 페이지네이션 */}
                      {qnaTotalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                          <div className="text-sm text-gray-700">
                            {qnaStartIndex + 1} - {Math.min(qnaEndIndex, filteredQnA.length)} / {filteredQnA.length}개
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setQnaCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={qnaCurrentPage === 1}
                              className="rounded-xl"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: qnaTotalPages }, (_, i) => i + 1).map((page) => {
                                if (
                                  page === 1 ||
                                  page === qnaTotalPages ||
                                  (page >= qnaCurrentPage - 2 && page <= qnaCurrentPage + 2)
                                ) {
                                  return (
                                    <Button
                                      key={page}
                                      variant={qnaCurrentPage === page ? 'default' : 'outline'}
                                      onClick={() => setQnaCurrentPage(page)}
                                      className={`rounded-xl ${qnaCurrentPage === page ? 'bg-blue-600 text-white' : ''}`}
                                    >
                                      {page}
                                    </Button>
                                  )
                                } else if (page === qnaCurrentPage - 3 || page === qnaCurrentPage + 3) {
                                  return <span key={page} className="px-2">...</span>
                                }
                                return null
                              })}
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => setQnaCurrentPage(prev => Math.min(qnaTotalPages, prev + 1))}
                              disabled={qnaCurrentPage === qnaTotalPages}
                              className="rounded-xl"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">검색 결과가 없습니다</p>
                      <p className="text-sm text-gray-500">다른 검색어나 필터를 시도해보세요</p>
                    </div>
                  )}

                  {/* 새 질문 작성 버튼 */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowAskInline(!showAskInline)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {showAskInline ? '작성 창 닫기' : '새 질문 작성하기'}
                    </Button>
                  </div>
                  {showAskInline && (
                    <div className="mt-4 p-4 border border-base-300 rounded-lg bg-base-100">
                      <label className="block text-sm font-medium text-base-content mb-2">질문 제목 *</label>
                      <input
                        type="text"
                        value={askTitle}
                        onChange={(e) => setAskTitle(e.target.value)}
                        placeholder="질문 제목을 입력해주세요."
                        className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-4"
                        maxLength={255}
                      />
                      <label className="block text-sm font-medium text-base-content mb-2">질문 내용 *</label>
                      <textarea
                        value={askText}
                        onChange={(e) => setAskText(e.target.value)}
                        placeholder="질문 내용을 작성해주세요."
                        className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        rows={5}
                        maxLength={1000}
                      />
                      <div className="flex items-center justify-between text-xs text-base-content/70 mt-1">
                        <span>질문을 작성해주세요</span>
                        <span>{askText.length}/1000</span>
                      </div>
                      {/* 공개/비공개 설정 */}
                      <div className="mt-4 flex items-center space-x-4">
                        <label className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg border-2 transition-all ${
                          askIsPublic
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}>
                          <input
                            type="radio"
                            name="qnaVisibility"
                            checked={askIsPublic}
                            onChange={() => setAskIsPublic(true)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-sm font-medium ${
                            askIsPublic ? 'text-blue-700' : 'text-gray-700'
                          }`}>공개 (다른 수강생도 볼 수 있음)</span>
                        </label>
                        <label className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg border-2 transition-all ${
                          !askIsPublic
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}>
                          <input
                            type="radio"
                            name="qnaVisibility"
                            checked={!askIsPublic}
                            onChange={() => setAskIsPublic(false)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`text-sm font-medium ${
                            !askIsPublic ? 'text-blue-700' : 'text-gray-700'
                          }`}>비공개 (강의자만 볼 수 있음)</span>
                        </label>
                      </div>
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button variant="outline" className="rounded-xl" onClick={() => { setAskTitle(''); setAskText(''); setAskIsPublic(true); setShowAskInline(false) }}>취소</Button>
                        <Button
                          className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
                          disabled={!askTitle.trim() || !askText.trim()}
                          onClick={async () => {
                            try {
                              if (!user?.id) {
                                alert('로그인이 필요합니다.')
                                return
                              }
                              await createCourseQnA(courseId, user.id, askTitle.trim(), askText.trim(), askIsPublic)
                              // QnA 목록 새로고침
                              const qnaData = await getCourseQnAs(courseId)
                              setQnaList(qnaData)
                              setAskTitle('')
                              setAskText('')
                              setAskIsPublic(true)
                              setShowAskInline(false)
                              alert('질문이 등록되었습니다.')
                            } catch (error) {
                              console.error('질문 등록 실패:', error)
                              alert('질문 등록에 실패했습니다.')
                            }
                          }}
                        >
                          질문 등록
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}

          </div>

          {/* Right Sidebar - Notice */}
          <div className="lg:col-span-1">
            <CourseNotices courseId={courseId} />
          </div>
        </div>
      </main>
    </div>
  )
}
