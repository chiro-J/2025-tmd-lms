import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, FileText, CheckCircle, Star, BookOpen, MessageSquare, Download, Image, Code, Link, Search } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { mockResources } from '../../mocks'
import type { Resource } from '../../types'

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

  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([
    {
      id: '1',
      title: '오리엔테이션',
      completed: 1,
      total: 1,
      expanded: false,
      lessons: [
        { id: '1-1', title: '강의 소개 및 환경 설정', completed: true, date: '25. 10. 13.' }
      ]
    },
    {
      id: '2',
      title: '권혁진_풀스택',
      completed: 7,
      total: 7,
      expanded: false,
      lessons: [
        { id: '2-1', title: 'HTML/CSS 기초', completed: true, date: '25. 10. 14.' },
        { id: '2-2', title: 'JavaScript 기초', completed: true, date: '25. 10. 15.' },
        { id: '2-3', title: 'DOM 조작', completed: true, date: '25. 10. 16.' },
        { id: '2-4', title: 'ES6 문법', completed: true, date: '25. 10. 17.' },
        { id: '2-5', title: '비동기 프로그래밍', completed: true, date: '25. 10. 18.' },
        { id: '2-6', title: 'API 연동', completed: true, date: '25. 10. 19.' },
        { id: '2-7', title: '프로젝트 실습', completed: true, date: '25. 10. 20.' }
      ]
    },
    {
      id: '3',
      title: '정보통신개론 및 IT 기본 실습',
      completed: 6,
      total: 6,
      expanded: false,
      lessons: [
        { id: '3-1', title: '컴퓨터 구조', completed: true, date: '25. 10. 21.' },
        { id: '3-2', title: '네트워크 기초', completed: true, date: '25. 10. 22.' },
        { id: '3-3', title: '데이터베이스 기초', completed: true, date: '25. 10. 23.' },
        { id: '3-4', title: '운영체제 기초', completed: true, date: '25. 10. 24.' },
        { id: '3-5', title: '보안 기초', completed: true, date: '25. 10. 25.' },
        { id: '3-6', title: 'IT 실습', completed: true, date: '25. 10. 26.' }
      ]
    },
    {
      id: '4',
      title: '리엑트 NEW',
      completed: 1,
      total: 12,
      expanded: true,
      lessons: [
        { id: '4-1', title: '타입스크립트', completed: true, date: '25. 10. 13.', isLastViewed: true },
        { id: '4-2', title: '타입스크립트 기초 연습문제', completed: false },
        { id: '4-3', title: 'ES6', completed: false },
        { id: '4-4', title: '리엑트 설명', completed: false },
        { id: '4-5', title: '컴포넌트 기초', completed: false },
        { id: '4-6', title: 'JSX 문법', completed: false },
        { id: '4-7', title: 'Props와 State', completed: false },
        { id: '4-8', title: '이벤트 처리', completed: false },
        { id: '4-9', title: '조건부 렌더링', completed: false },
        { id: '4-10', title: '리스트와 키', completed: false },
        { id: '4-11', title: '폼 처리', completed: false },
        { id: '4-12', title: '라이프사이클', completed: false }
      ]
    }
  ])

  const [allExpanded, setAllExpanded] = useState(false)

  // 강의 자료 필터링
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || resource.type === selectedType
    return matchesSearch && matchesType
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
      // 실제 파일 다운로드 로직
      console.log('다운로드:', resource.title)
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
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">강좌 정보</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">강의자 소개</h4>
                      <p className="text-gray-700">
                        김강사는 10년차 풀스택 개발자로, React, Node.js, TypeScript 등 다양한 기술 스택에 대한
                        깊은 이해를 바탕으로 실무 중심의 강의를 제공합니다.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">강좌 소개</h4>
                      <p className="text-gray-700">
                        이 강좌는 React 기초부터 고급 개념까지 체계적으로 학습할 수 있도록 구성되었습니다.
                        실습 위주의 학습으로 실제 프로젝트에 바로 적용할 수 있는 실무 능력을 기를 수 있습니다.
                      </p>
                    </div>
                  </div>
                </Card>
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
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">강의 관련 질문을 하고 답변을 받아보세요</p>
                    <Button
                      onClick={() => navigate(`/student/course/${id}/qna`)}
                      className="btn-primary"
                    >
                      Q&A 보기
                    </Button>
                  </div>
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
