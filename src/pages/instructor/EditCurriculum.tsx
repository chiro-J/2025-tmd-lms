import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronRight, FileText, Edit, Save, Upload, X } from 'lucide-react'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import TinyEditor from '../../components/editor/TinyEditor'
import MarkdownEditor from '../../components/editor/MarkdownEditor'
import Button from '../../components/ui/Button'
import { Document, Page, pdfjs } from 'react-pdf'
import { marked } from 'marked'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Lesson {
  id: string
  title: string
  type: 'folder' | 'file'
  completed?: number
  total?: number
  children?: Lesson[]
  isNew?: boolean
  isSelected?: boolean
  studyDate?: string
}

interface Curriculum {
  id: string
  title: string
  lessons: Lesson[]
}

export default function EditCurriculum() {
  const [expandedCurriculums, setExpandedCurriculums] = useState<string[]>(['curriculum-1', 'curriculum-2', 'curriculum-3', 'curriculum-4'])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageInput, setPageInput] = useState<string>('1')
  const [pdfContainerWidth, setPdfContainerWidth] = useState<number>(0)
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState<string>('')
  const [editorType, setEditorType] = useState<'text' | 'markdown'>('text')
  const [savedEditorType, setSavedEditorType] = useState<'text' | 'markdown'>('text')

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleEditorTypeChange = (type: 'text' | 'markdown') => {
    setEditorType(type)
    setContent('') // 에디터 변경 시 내용 초기화
  }

  const handleSave = () => {
    // TODO: 나중에 DB에 저장
    console.log('저장할 내용:', content)
    console.log('에디터 타입:', editorType)
    setSavedEditorType(editorType)
    setIsEditMode(false)
  }

  useEffect(() => {
    const updateWidth = () => {
      if (pdfContainerRef.current) {
        const width = pdfContainerRef.current.clientWidth - 32 // padding 제거
        setPdfContainerWidth(width)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [selectedLesson]) // selectedLesson이 변경될 때마다 다시 계산

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
      setPageNumber(1)
      setPageInput('1')
    }
  }

  const handleRemovePdf = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
    }
    setPdfUrl(null)
    setPageNumber(1)
    setPageInput('1')
  }

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1
      setPageNumber(newPage)
      setPageInput(newPage.toString())
    }
  }

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      const newPage = pageNumber + 1
      setPageNumber(newPage)
      setPageInput(newPage.toString())
    }
  }

  const curriculums: Curriculum[] = [
    {
      id: 'curriculum-1',
      title: '오리엔테이션',
      lessons: [
        { id: 'lesson-1', title: '오리엔테이션', type: 'file', completed: 1, total: 1 }
      ]
    },
    {
      id: 'curriculum-2',
      title: '권혁진_풀스택',
      lessons: [
        { id: 'lesson-2', title: '환경설정/기본문법/조건문/반복문', type: 'file', completed: 1, total: 1, studyDate: '25. 10. 13.' },
        { id: 'lesson-3', title: '(코드)함수/배열/객체', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-4', title: '함수/배열/객체/DOM', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-5', title: '(코드)DOM', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-6', title: '이벤트 처리', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-7', title: '웹 API', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-8', title: 'HTML/CSS', type: 'file', completed: 1, total: 1 },
      ]
    },
    {
      id: 'curriculum-3',
      title: '정보통신개론 및 IT 기본 실습',
      lessons: [
        { id: 'lesson-9', title: 'IT 산업 역사와 웹 개발 현황', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-10', title: '250926 영상강의', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-11', title: 'Github 대문꾸미기', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-12', title: '알고리즘 연습방법', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-13', title: 'Github 와 백준허브 연동방법', type: 'file', completed: 1, total: 1 },
        { id: 'lesson-14', title: '온라인 타자연습', type: 'file', completed: 1, total: 1 },
      ]
    },
    {
      id: 'curriculum-4',
      title: '리엑트 NEW',
      lessons: [
        { id: 'lesson-15', title: '타입스크립트', type: 'file', completed: 1, total: 1, studyDate: '25. 10. 13.', isSelected: true },
        { id: 'lesson-16', title: '타입스크립트 기초 연습문제', type: 'file', total: 1 },
        { id: 'lesson-17', title: 'ES6', type: 'file', total: 1 },
        { id: 'lesson-18', title: '리엑트 설명', type: 'file', total: 1 },
        { id: 'lesson-19', title: '컴포넌트 기초', type: 'file', total: 1 },
        { id: 'lesson-20', title: 'JSX 문법', type: 'file', total: 1 },
        { id: 'lesson-21', title: 'Props와 State', type: 'file', total: 1 },
        { id: 'lesson-22', title: '이벤트 처리', type: 'file', total: 1 },
        { id: 'lesson-23', title: '조건부 렌더링', type: 'file', total: 1 },
        { id: 'lesson-24', title: '리스트와 키', type: 'file', total: 1 },
        { id: 'lesson-25', title: '폼 처리', type: 'file', total: 1 },
        { id: 'lesson-26', title: '라이프사이클', type: 'file', total: 1 },
      ]
    }
  ]

  const toggleCurriculum = (curriculumId: string) => {
    setExpandedCurriculums(prev =>
      prev.includes(curriculumId)
        ? prev.filter(id => id !== curriculumId)
        : [...prev, curriculumId]
    )
  }

  const renderLesson = (lesson: Lesson) => (
    <div
      key={lesson.id}
      onClick={() => setSelectedLesson(lesson)}
      className={`p-3 cursor-pointer hover:bg-white transition-colors border-b border-gray-200 last:border-b-0 ${
        lesson.isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 ml-4">
          <FileText className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="text-sm text-gray-700">{lesson.title}</span>
          {lesson.isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">NEW</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {lesson.studyDate && !isEditMode && (
            <span className="text-xs text-gray-500">수강일: {lesson.studyDate}</span>
          )}
          {lesson.completed && lesson.total && lesson.completed === lesson.total && !isEditMode && (
            <FileText className="h-4 w-4 text-blue-500" aria-hidden="true" />
          )}
          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                // 삭제 로직
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
              title="삭제"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <CoursePageLayout
      currentPageTitle="교육과정"
      rightActions={
        !isEditMode ? (
          <Button
            onClick={() => setIsEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>편집하기</span>
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>변경내용 저장하기</span>
          </Button>
        )
      }
    >
      <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 300px)' }}>
        {/* 강의 구성 사이드바 */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md flex flex-col">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">강의 구성</h3>
                {isEditMode && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1"
                    title="새 강의 추가"
                  >
                    <span>+</span>
                    <span>추가</span>
                  </button>
                )}
              </div>
              {isEditMode && (
                <p className="text-xs text-orange-600 mt-2">편집 모드: 강의 추가/삭제/이동 가능</p>
              )}
              {/* 전체 열기/닫기 버튼 */}
              <div className="mt-3">
                <button
                  onClick={() => {
                    if (expandedCurriculums.length === curriculums.length) {
                      setExpandedCurriculums([])
                    } else {
                      setExpandedCurriculums(curriculums.map(c => c.id))
                    }
                  }}
                  className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {expandedCurriculums.length === curriculums.length ? '전체목록 닫기' : '전체목록 열기'}
                </button>
              </div>
            </div>

            {/* 강의 목록 */}
            <div className="overflow-y-auto">
              {curriculums.map((curriculum, index) => {
                const isExpanded = expandedCurriculums.includes(curriculum.id)
                const completed = curriculum.lessons.filter(l => l.completed).length
                const total = curriculum.lessons.length

                return (
                  <div key={curriculum.id} className="border-b border-gray-200 last:border-b-0">
                    {/* 과정 제목 */}
                    <div
                      onClick={() => toggleCurriculum(curriculum.id)}
                      className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex items-center space-x-2">
                          <span className="text-blue-500 font-medium text-sm">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <h4 className="font-medium text-gray-900 text-sm">{curriculum.title}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!isEditMode && (
                            <span className="text-xs text-gray-600">
                              {completed}/{total}
                            </span>
                          )}
                          {isEditMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                // 과정 삭제 로직
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                              title="과정 삭제"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 하위 강의 목록 */}
                    {isExpanded && (
                      <div className="bg-gray-50">
                        {curriculum.lessons.map(lesson => renderLesson(lesson))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 편집 에디터 영역 */}
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-auto">
          {/* 상태 메시지 */}
          {isEditMode && (
            <div className="p-4 bg-orange-50 border-b border-orange-200 sticky top-0 z-10">
              <p className="text-sm text-orange-600 flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>편집 모드 - 왼쪽 강의 구성도 추가/제거 가능합니다</span>
              </p>
            </div>
          )}

          {/* 내용 영역 */}
          <div className="p-6">
            {selectedLesson ? (
              <div className="space-y-6">
                {/* 강의 제목 */}
                <div className="mb-8 pb-6 border-b-2 border-gray-300">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedLesson.title}</h2>
                </div>

                {/* PDF 영역 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mt-8">
                  {isEditMode && !pdfUrl && (
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-700">PDF가 없습니다</span>
                      </div>
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span>PDF 업로드</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handlePdfUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* PDF 제어 헤더 */}
                  {pdfUrl && (
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                      {isEditMode && (
                        <button
                          onClick={handleRemovePdf}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                          title="PDF 삭제"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}

                      <div className="flex items-center space-x-3 flex-1 justify-center">
                        <button
                          onClick={goToPrevPage}
                          disabled={pageNumber <= 1}
                          className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-30 border border-gray-300"
                        >
                          <span className="text-sm">이전</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="1"
                            max={numPages}
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value)
                              if (!value || value < 1) {
                                setPageInput('1')
                                setPageNumber(1)
                              } else if (value > numPages) {
                                setPageInput(numPages.toString())
                                setPageNumber(numPages)
                              } else {
                                setPageInput(value.toString())
                                setPageNumber(value)
                              }
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur()
                              }
                            }}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                          />
                          <span className="text-sm text-gray-600">/ {numPages}</span>
                        </div>
                        <button
                          onClick={goToNextPage}
                          disabled={pageNumber >= numPages}
                          className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-30 border border-gray-300"
                        >
                          <span className="text-sm">다음</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PDF 표시 영역 */}
                  <div ref={pdfContainerRef} className="bg-white overflow-auto p-4" style={{ minHeight: '600px' }}>
                    {pdfUrl ? (
                      <div className="flex justify-center items-start h-full">
                        <Document
                          file={pdfUrl}
                          onLoadSuccess={({ numPages }) => {
                            setNumPages(numPages)
                            setPageNumber(1)
                            setPageInput('1')
                          }}
                          loading={
                            <div className="flex items-center justify-center h-full">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                          }
                        >
                          <Page
                            pageNumber={pageNumber}
                            width={pdfContainerWidth || 800}
                            className="shadow-lg"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </Document>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">
                            {isEditMode ? 'PDF를 업로드하세요' : 'PDF가 없습니다'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 에디터 내용 */}
                {isEditMode ? (
                  <div className="space-y-4">
                    {/* 에디터 타입 선택 버튼 */}
                    <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                      <button
                        onClick={() => handleEditorTypeChange('text')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          editorType === 'text'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Text 편집기
                      </button>
                      <button
                        onClick={() => handleEditorTypeChange('markdown')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          editorType === 'markdown'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Markdown 편집기
                      </button>
                      <span className="text-xs text-gray-500 ml-2">입력기 변경 시 입력한 내용이 전부 사라집니다.</span>
                    </div>

                    {/* 선택된 에디터 렌더링 */}
                    {editorType === 'text' ? (
                      <TinyEditor
                        initialValue={content}
                        onChange={handleContentChange}
                        height={400}
                      />
                    ) : (
                      <MarkdownEditor
                        initialValue={content}
                        onChange={handleContentChange}
                        height={400}
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[400px]">
                    {savedEditorType === 'markdown' ? (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: content ? marked(content) : '이 곳에 강의 내용이 표시됩니다.' }}
                      />
                    ) : (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || '이 곳에 강의 내용이 표시됩니다.' }} />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">강의를 선택하세요</h3>
                  <p className="text-sm text-gray-500">
                    왼쪽에서 편집할 강의를 선택하면 이곳에 내용이 표시됩니다
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CoursePageLayout>
  )
}

