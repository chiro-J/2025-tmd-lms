import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, FileText, CheckCircle, Star, BookOpen, MessageSquare, Download, Image, Code, Link, Search } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { mockResources, mockQnA } from '../../mocks'
import type { Resource, QnAItem } from '../../types'
import { getCurriculumForCourseDetail } from '../../data/curriculum'

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
  const [activeTab, setActiveTab] = useState<'home' | 'info' | 'exam' | 'notice' | 'resources' | 'qna'>('home')

  // 강의 자료 관련 상태
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<Resource['type'] | 'all'>('all')

  // QnA 관련 상태
  const [qnaSearchQuery, setQnaSearchQuery] = useState('')
  const [showAskInline, setShowAskInline] = useState(false)
  const [askText, setAskText] = useState('')

  // curriculum.ts에서 공통 데이터 가져오기
  const initialCurriculum = useMemo(() => {
    const data = getCurriculumForCourseDetail()
    // 첫 번째 강의와 마지막 강의 일부 완료 처리 (임시)
    if (data.length > 0) {
      data[0].completed = 1
      data[0].lessons[0].completed = true
      data[0].lessons[0].date = '25. 10. 13.'
    }
    if (data.length > 1) {
      data[1].completed = 7
      data[1].lessons.forEach((lesson, idx) => {
        lesson.completed = true
        lesson.date = `25. 10. ${14 + idx}.`
      })
    }
    if (data.length > 2) {
      data[2].completed = 6
      data[2].lessons.forEach((lesson, idx) => {
        lesson.completed = true
        lesson.date = `25. 10. ${21 + idx}.`
      })
    }
    if (data.length > 3) {
      data[3].completed = 1
      data[3].lessons[0].completed = true
      data[3].lessons[0].date = '25. 10. 13.'
      data[3].lessons[0].isLastViewed = true
    }
    return data
  }, [])

  const [curriculum, setCurriculum] = useState<CurriculumItem[]>(initialCurriculum)

  const [allExpanded, setAllExpanded] = useState(false)

  // 강의 자료 필터링
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || resource.type === selectedType
    return matchesSearch && matchesType
  })

  // QnA 필터링 로직
  const filteredQnA = mockQnA.filter(qna => {
    const matchesSearch = qna.question.toLowerCase().includes(qnaSearchQuery.toLowerCase()) ||
                          qna.author.toLowerCase().includes(qnaSearchQuery.toLowerCase())
    return matchesSearch
  })

  // 강의 자료 타입별 아이콘
  const getTypeIcon = (type: Resource['type']) => {
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
  const getTypeLabel = (type: Resource['type']) => {
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
  const getTypeColor = (type: Resource['type']) => {
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
  const handleDownload = (resource: Resource) => {
    if (resource.type === 'link') {
      window.open(resource.url, '_blank')
    } else {
      // TODO: 실제 다운로드 구현
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
    navigate(`/student/learning/${id}?lesson=${lessonId}`)
  }

  const tabs = [
    { id: 'home', label: '강좌 홈', icon: BookOpen },
    { id: 'info', label: '강좌 정보', icon: FileText },
    { id: 'exam', label: '시험/과제', icon: CheckCircle },
    { id: 'resources', label: '강의 자료', icon: FileText },
    { id: 'qna', label: 'Q&A', icon: MessageSquare }
  ] as const


  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="container-page py-8">
        {/* Course Header */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-80 h-48 rounded-xl overflow-hidden flex-shrink-0 relative">
              <img
                src="/photo/bbb.jpg"
                alt="풀스택 과정"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white font-bold text-sm">
                풀스택
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">(1회차) 풀스택 과정</h1>
                <p className="text-gray-600 mb-2">마지막 수강 강의 : 타입스크립트</p>
                <p className="text-sm text-gray-600 mb-4">26강의 중 15개 강의 수강</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">진행률</span>
                  <span className="text-sm text-gray-600">57.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: '57.7%' }}
                    role="progressbar"
                    aria-valuenow={57.7}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => navigate(`/student/learning/${id}`)}
                  className="btn-primary px-8 py-3"
                >
                  이어하기
                </Button>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm text-gray-600 ml-2">수강평 남기기</span>
                </div>
              </div>
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
                        <button
                          onClick={toggleAll}
                          className="text-xs text-base-content/70 hover:text-base-content transition-colors"
                        >
                          {allExpanded ? '모두 접기' : '모두 펼치기'}
                        </button>
                        <ChevronDown className="h-4 w-4 text-base-content/60" />
                      </div>
                    </div>
                  </div>

                  {curriculum.map((item, index) => (
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
                            {item.id === '4' && (
                              <span className="bg-success/10 text-success text-xs px-2 py-1 rounded">
                                NEW
                              </span>
                            )}
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
                  ))}
                </div>
            </div>
          )}

            {activeTab === 'info' && (
              <div id="tabpanel-info" role="tabpanel" aria-labelledby="tab-info">
                <div className="space-y-6">
                  {/* Course Video */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">소개 영상</h3>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/example"
                        title="강좌 소개 영상"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </Card>

                  {/* Course Content */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">강좌 소개</h3>
                    <div className="text-gray-700 prose max-w-none">
                      <p>이 강좌는 React 기초부터 고급 개념까지 체계적으로 학습할 수 있도록 구성되었습니다.</p>
                      <p>실습 위주의 학습으로 실제 프로젝트에 바로 적용할 수 있는 실무 능력을 기를 수 있습니다.</p>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'exam' && (
              <div id="tabpanel-exam" role="tabpanel" aria-labelledby="tab-exam">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">시험/과제</h3>
                  <div className="space-y-4">
                    <div className="card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">과제 1: React 컴포넌트 개발</h4>
                        <span className="text-sm text-gray-500">마감: 2024-11-25</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        React를 사용하여 재사용 가능한 컴포넌트를 개발하고, 이를 활용한 간단한 애플리케이션을 구현하세요.
                      </p>
                      <Button
                        onClick={() => navigate(`/student/assignment/1`)}
                        className="btn-primary"
                      >
                        과제 제출하기
                      </Button>
                    </div>

                    <div className="card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">퀴즈 1: React 기초</h4>
                        <span className="text-sm text-gray-500">마감: 2024-11-25</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        React의 기본 개념과 사용법에 대한 퀴즈입니다. 30분 제한시간이 있습니다.
                      </p>
                      <Button
                        onClick={() => navigate(`/student/quiz/1`)}
                        className="btn-outline"
                      >
                        퀴즈 시작하기
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'resources' && (
              <div id="tabpanel-resources" role="tabpanel" aria-labelledby="tab-resources">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">강의 자료</h3>

                  {/* 검색 및 필터 */}
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* 검색 */}
                      <div className="flex-1">
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

                      {/* 타입 필터 */}
                      <div className="flex space-x-2">
                        {[
                          { value: 'all', label: '전체' },
                          { value: 'pdf', label: 'PDF' },
                          { value: 'slide', label: '슬라이드' },
                          { value: 'code', label: '코드' },
                          { value: 'link', label: '링크' }
                        ].map(type => (
                          <button
                            key={type.value}
                            onClick={() => setSelectedType(type.value as Resource['type'] | 'all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedType === type.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 강의 자료 목록 */}
                  {filteredResources.length > 0 ? (
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
                                {resource.description && (
                                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                                )}
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
                                    {new Date(resource.uploadedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDownload(resource)}
                              className="btn-outline flex items-center space-x-2"
                            >
                              <Download className="h-4 w-4" />
                              <span>{resource.type === 'link' ? '열기' : '다운로드'}</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">검색 결과가 없습니다</p>
                      <p className="text-sm text-gray-500">다른 검색어나 필터를 시도해보세요</p>
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

                  {/* QnA 목록 */}
                  {filteredQnA.length > 0 ? (
                    <div className="space-y-4">
                      {filteredQnA.map((qna) => (
                        <div
                          key={qna.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-2">{qna.question}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <span>{qna.author}</span>
                                <span>{new Date(qna.createdAt).toLocaleDateString()}</span>
                                <span>{qna.answers.length}개 답변</span>
                              </div>

                              {/* 답변 미리보기 */}
                              {qna.answers.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <MessageSquare className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">답변</span>
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {qna.answers[0].content}
                                  </p>
                                  <div className="mt-2">
                                    <span className="text-xs text-gray-500">
                                      {qna.answers[0].author} • {new Date(qna.answers[0].createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                      <label className="block text-sm font-medium text-base-content mb-2">질문 내용 *</label>
                      <textarea
                        value={askText}
                        onChange={(e) => setAskText(e.target.value)}
                        placeholder="질문을 자세히 작성해주세요. (최소 10자 이상)"
                        className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        rows={5}
                        maxLength={1000}
                      />
                      <div className="flex items-center justify-between text-xs text-base-content/70 mt-1">
                        <span>최소 10자 이상 작성해주세요</span>
                        <span>{askText.length}/1000</span>
                      </div>
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button variant="outline" className="rounded-xl" onClick={() => { setAskText(''); setShowAskInline(false) }}>취소</Button>
                        <Button
                          className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
                          disabled={askText.length < 10}
                          onClick={() => {
                            setAskText('')
                            setShowAskInline(false)
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
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">공지사항</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">공지사항이 없습니다.</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
