import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ExternalLink, ChevronLeft, ChevronRight, List } from 'lucide-react'
import { marked } from 'marked'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import VideoSideNav from '../../components/learning/VideoSideNav'
import type { ContentBlock } from '../../types/curriculum'
import type { CurriculumModule, Lesson } from '../../core/api/curriculum'
import { updateLearningProgress, getLearningProgress } from '../../core/api/learning-progress'
import { useAuth } from '../../contexts/AuthContext'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function Learning() {
  const params = useParams()
  const courseId = Number(params.id) || 1
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [sideNavTab, setSideNavTab] = useState('curriculum')
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true)
  const [curriculumModules, setCurriculumModules] = useState<CurriculumModule[]>([])
  const [selectedLessonData, setSelectedLessonData] = useState<{ title: string; text: string } | null>(null)
  const [selectedContentBlocks, setSelectedContentBlocks] = useState<ContentBlock[]>([])
  const [loadingLesson, setLoadingLesson] = useState(false)
  const [pdfPages, setPdfPages] = useState<Record<string, number>>({})
  const [pdfPageNumbers, setPdfPageNumbers] = useState<Record<string, number>>({})
  const [pdfLoading, setPdfLoading] = useState<Record<string, boolean>>({})
  const [pdfPageSizes, setPdfPageSizes] = useState<Record<string, { width: number; height: number }>>({})

  const selectedLessonId = useMemo(() => searchParams.get('lesson') || '', [searchParams])

  // 마지막 학습한 강좌 및 레슨 저장 (백엔드 API 사용)
  useEffect(() => {
    if (courseId && selectedLessonId && user?.id) {
      // lesson ID를 숫자로 변환
      let actualLessonId: number | null = null
      if (selectedLessonId && selectedLessonId.includes('-')) {
        const parts = selectedLessonId.split('-')
        actualLessonId = Number(parts[parts.length - 1])
      } else {
        actualLessonId = Number(selectedLessonId)
      }

      // 유효한 lesson ID인 경우에만 저장
      if (!isNaN(actualLessonId) && actualLessonId > 0) {
        const userId = typeof user.id === 'number' ? user.id : Number(user.id)
        updateLearningProgress({
          userId,
          courseId,
          lessonId: actualLessonId
        }).catch((error: any) => {
          // 500 에러는 서버 문제이므로 조용히 처리 (사용자 경험에 영향 최소화)
          if (error.response?.status === 500) {
            console.warn('서버 오류로 학습 진행률 저장 실패 (무시됨)')
          } else {
            console.error('학습 진행률 저장 실패:', error)
          }
        })
      }

      // localStorage 폴백 (기존 호환성 유지)
      localStorage.setItem('lastLearnedCourseId', String(courseId))
      localStorage.setItem(`lastLearnedLesson_${courseId}`, selectedLessonId)
    }
  }, [courseId, selectedLessonId, user?.id])

  // PDF 옵션 메모이제이션 (불필요한 리로드 방지)
  const pdfOptions = useMemo(
    () => ({
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
      // 원본 화질을 위한 옵션
      disableAutoFetch: false,
      disableStream: false,
      disableRange: false,
      verbosity: 0,
      // 고해상도 렌더링을 위한 옵션
      useSystemFonts: false,
      isEvalSupported: false,
    }),
    []
  )

  // 커리큘럼 데이터 로드
  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        const { getCurriculum } = await import('../../core/api/curriculum')
        const modules = await getCurriculum(courseId)
        setCurriculumModules(modules)
      } catch (error) {
        console.error('커리큘럼 로드 실패:', error)
      }
    }
    loadCurriculum()
  }, [courseId])

  // 선택된 레슨 데이터 찾기 및 DB에서 contentBlocks 불러오기
  useEffect(() => {
    if (!selectedLessonId || curriculumModules.length === 0) {
      // curriculumModules가 아직 로드되지 않았으면 로딩 상태 유지
      if (curriculumModules.length === 0 && selectedLessonId) {
        setLoadingLesson(true)
      } else {
        setSelectedLessonData(null)
        setLoadingLesson(false)
      }
      return
    }

    setLoadingLesson(true)

    // selectedLessonId가 "3-1" 형식인 경우 실제 lesson ID만 추출
    let actualLessonId = selectedLessonId
    if (selectedLessonId.includes('-')) {
      const parts = selectedLessonId.split('-')
      actualLessonId = parts[parts.length - 1]
    }
    const lessonId = Number(actualLessonId)

    // 모든 모듈의 레슨 중에서 선택된 레슨 찾기
    const loadLessonContent = async () => {
      for (const module of curriculumModules) {
        const lesson = module.lessons?.find((l: Lesson) => l.id === lessonId)
        if (lesson) {
          try {
            // DB에서 레슨 상세 정보 불러오기
            const { getLesson } = await import('../../core/api/curriculum')
            const lessonData = await getLesson(courseId, module.id, lessonId)

            // description을 사용하여 표시
            let description = lessonData.description || lesson.description

            // description이 JSON 형식인지 확인 (contentBlocks 배열)
            let contentBlocks: ContentBlock[] = []
            if (description) {
              try {
                const parsed = JSON.parse(description)
                if (Array.isArray(parsed) && parsed.length > 0) {
                  // JSON 배열인 경우: contentBlocks로 저장
                  // 'text' 타입은 제외하되, 'image', 'pdf', 'video', 'markdown', 'lexical'은 모두 포함
                  contentBlocks = parsed
                    .filter((block: unknown): block is { type: string; content?: string; id?: string } =>
                      typeof block === 'object' && block !== null && 'type' in block
                    )
                    .filter((block) => block.type !== 'text')
                    .map((block, index: number) => ({
                      id: block.id || `block-${lessonData.id}-${index}-${Date.now()}`,
                      type: (block.type === 'markdown' || block.type === 'lexical' || block.type === 'pdf' || block.type === 'video' || block.type === 'image')
                        ? block.type
                        : 'markdown', // 기본값은 markdown
                      content: block.content || ''
                    }))


                  // 기존 호환성을 위해 텍스트만 추출
                  description = contentBlocks
                    .filter((block) => block.type === 'markdown')
                    .map((block) => block.content || '')
                    .filter((content: string) => content.trim() !== '')
                    .join('\n\n')
                } else {
                  // 빈 배열이거나 유효하지 않은 경우
                  if (description.trim()) {
                    contentBlocks = [{
                      id: `block-${lessonData.id}-${Date.now()}`,
                      type: 'markdown',
                      content: description
                    }]
                  }
                }
              } catch {
                // JSON이 아닌 경우: 기존 텍스트를 마크다운 블록으로 변환
                if (description.trim()) {
                  contentBlocks = [{
                    id: `block-${lessonData.id}-${Date.now()}`,
                    type: 'markdown',
                    content: description
                  }]
                }
              }
            }

            if (!description || description.trim() === '') {
              // 레슨 제목에 따라 기본 설명 텍스트 생성
              const title = lesson.title.toLowerCase()
              if (title.includes('타입스크립트') || title.includes('typescript')) {
                description = '타입스크립트는 JavaScript에 정적 타입을 추가한 언어입니다. 이 강의에서는 타입스크립트의 기본 문법, 타입 정의, 인터페이스, 제네릭 등의 핵심 개념을 학습하고 실습을 통해 활용 방법을 익힙니다.'
                if (contentBlocks.length === 0) {
                  contentBlocks = [{
                    id: `block-${Date.now()}`,
                    type: 'markdown',
                    content: description
                  }]
                }
              } else {
                description = `${lesson.title}에 대한 강의입니다.\n\n이 강의에서는 ${lesson.title}의 핵심 개념과 실무 활용 방법을 학습합니다.`
                if (contentBlocks.length === 0) {
                  contentBlocks = [{
                    id: `block-${Date.now()}`,
                    type: 'markdown',
                    content: description
                  }]
                }
              }
            }

            setSelectedContentBlocks(contentBlocks)
            setSelectedLessonData({
              title: lesson.title,
              text: description
            })
          } catch (error: unknown) {
            // 404 에러는 무시하고 기본 내용으로 표시
            if (error && typeof error === 'object' && 'response' in error) {
              const apiError = error as { response?: { status?: number } }
              if (apiError.response?.status !== 404) {
                console.error('레슨 내용 불러오기 실패:', error)
              }
            } else {
              console.error('레슨 내용 불러오기 실패:', error)
            }
            // 에러 시 기본 텍스트로 표시
            const defaultText = lesson.description || `${lesson.title}에 대한 강의입니다.`
            setSelectedContentBlocks([{
              id: `block-${Date.now()}`,
              type: 'markdown',
              content: defaultText
            }])
            setSelectedLessonData({
              title: lesson.title,
              text: defaultText
            })
          }

          setLoadingLesson(false)
          return
        }
      }

      setSelectedLessonData(null)
      setSelectedContentBlocks([])
      setLoadingLesson(false)
    }

    loadLessonContent()
  }, [selectedLessonId, curriculumModules, courseId])

  const selectedContent = useMemo(() => {
    // curriculumModules가 로드되지 않았거나 레슨을 로딩 중이면 로딩 상태 표시
    if (loadingLesson || (selectedLessonId && curriculumModules.length === 0)) {
      return {
        title: '로딩 중...',
        text: '강의 내용을 불러오는 중입니다.'
      }
    }

    if (selectedLessonData) {
      return selectedLessonData
    }

    return {
      title: '학습 자료를 선택해 주세요',
      text: '오른쪽 커리큘럼에서 학습 항목을 선택하면 해당 자료가 표시됩니다.'
    }
  }, [selectedLessonData, loadingLesson, selectedLessonId, curriculumModules.length])

  // URL에서 lesson 파라미터가 없으면 마지막 수강 레슨으로 자동 이동 (백엔드 API 사용)
  useEffect(() => {
    const loadLastLearnedLesson = async () => {
      if (!selectedLessonId && curriculumModules.length > 0 && user?.id) {
        try {
          const userId = typeof user.id === 'number' ? user.id : Number(user.id)
          const progress = await getLearningProgress(userId, courseId)

          let lastLearnedLessonId: string | null = null
          if (progress?.lessonId) {
            lastLearnedLessonId = String(progress.lessonId)
          } else {
            // localStorage 폴백 (기존 데이터 호환성)
            lastLearnedLessonId = localStorage.getItem(`lastLearnedLesson_${courseId}`)
          }

          if (lastLearnedLessonId) {
            // 마지막 수강 레슨이 존재하면 해당 레슨으로 이동
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.set('lesson', lastLearnedLessonId)
            window.history.replaceState({}, '', newUrl.toString())
            // searchParams를 강제로 업데이트하기 위해 location 변경 이벤트 발생
            window.dispatchEvent(new PopStateEvent('popstate'))
          }
        } catch (error) {
          // 실패 시 localStorage 폴백
          const lastLearnedLessonId = localStorage.getItem(`lastLearnedLesson_${courseId}`)
          if (lastLearnedLessonId) {
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.set('lesson', lastLearnedLessonId)
            window.history.replaceState({}, '', newUrl.toString())
            window.dispatchEvent(new PopStateEvent('popstate'))
          }
        }
      }
    }
    loadLastLearnedLesson()
  }, [selectedLessonId, curriculumModules, courseId, user?.id])

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-hidden" style={{ top: '56px' }}>
        {/* Content Container */}
        <div
          className="fixed bottom-0 transition-all duration-300 bg-gray-50"
          style={{
            top: '56px',
            left: isSideNavExpanded ? '312px' : '56px',
            width: isSideNavExpanded ? 'calc(100vw - 312px)' : 'calc(100vw - 56px)'
          }}
        >
        {/* Content Switch */}
        {(
          <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="max-w-none w-full bg-gray-50 min-h-full">
              {/* 경로 표시 - 헤더 바로 아래에 위치 */}
              {(() => {
                // selectedLessonId가 "3-1" 형식인 경우 실제 lesson ID만 추출
                let actualLessonId = selectedLessonId
                if (selectedLessonId && selectedLessonId.includes('-')) {
                  const parts = selectedLessonId.split('-')
                  actualLessonId = parts[parts.length - 1]
                }
                const lessonIdNum = Number(actualLessonId)

                const currentModule = curriculumModules.find((m: CurriculumModule) =>
                  m.lessons?.some((l: Lesson) => l.id === lessonIdNum)
                )
                const currentLesson = currentModule?.lessons?.find((l: Lesson) => l.id === lessonIdNum)

                if (currentModule && currentLesson) {
                  return (
                    <div className="border-b-2 border-gray-300 shadow-sm pl-12" style={{ height: '56px', display: 'flex', alignItems: 'center' }}>
                      <div className="flex items-center space-x-2 text-lg text-gray-600">
                        <span className="font-semibold text-gray-900 text-xl">{currentModule.title}</span>
                        <span className="text-gray-500 text-lg">/</span>
                        <span className="text-gray-700 font-semibold text-xl">{currentLesson.title}</span>
                      </div>
                    </div>
                  )
                }
                return null
              })()}
              <div className="prose prose-lg max-w-none py-12 pl-12 pr-12">
                {selectedContentBlocks.length > 0 ? (
                  <div className="space-y-6">
                    {selectedContentBlocks.map((block) => {
                      if (block.type === 'markdown') {
                        return (
                          <div
                            key={block.id}
                            className="text-gray-900 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: marked(block.content || '') }}
                          />
                        )
                      }
                      if (block.type === 'lexical') {
                        return (
                          <div
                            key={block.id}
                            className="text-gray-900 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: block.content || '' }}
                          />
                        )
                      }
                      if (block.type === 'pdf' && block.content) {
                        // PDF URL 처리: base64 데이터 URL은 그대로 사용, 상대 경로면 절대 URL로 변환
                        let pdfUrl = block.content
                        if (!pdfUrl.startsWith('http') && !pdfUrl.startsWith('data:')) {
                          if (pdfUrl.startsWith('/')) {
                            pdfUrl = `http://localhost:3000${pdfUrl}`
                          } else if (pdfUrl) {
                            pdfUrl = `http://localhost:3000${pdfUrl.startsWith('/') ? '' : '/'}${pdfUrl}`
                          }
                        }

                        if (!pdfUrl || !pdfUrl.trim()) {
                          return (
                            <div key={block.id} className="p-8 text-center text-gray-500">PDF URL이 없습니다.</div>
                          )
                        }


                        const currentPage = pdfPageNumbers[block.id] || 1
                        const totalPages = pdfPages[block.id] || 0
                        // 원본 화질을 위한 고해상도 렌더링
                        const devicePixelRatio = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
                        // PDF 원본 크기 가져오기
                        const pageSize = pdfPageSizes[block.id]

                        // 컨테이너의 실제 사용 가능한 너비 계산 (사이드바 고려)
                        const sidebarWidth = isSideNavExpanded ? 304 : 0
                        const padding = isSideNavExpanded ? 160 : 128 // 좌우 패딩 합계
                        const availableWidth = window.innerWidth - sidebarWidth - padding

                        let pageWidth: number
                        let calculatedPageHeight: number | null = null

                        if (pageSize) {
                          // PDF 원본 비율 계산
                          const aspectRatio = pageSize.width / pageSize.height

                          // 너비를 먼저 결정 (사용 가능한 너비의 95% 사용)
                          pageWidth = availableWidth * 0.95

                          // 화질 향상을 위해 scale을 약간 높임 (최대 1.5배까지)
                          const baseScale = pageWidth / pageSize.width
                          const enhancedScale = Math.min(baseScale * 1.1, 1.5)
                          pageWidth = pageSize.width * enhancedScale

                          // 계산된 너비에 맞춰서 높이 계산 (PDF 원본 비율 유지)
                          calculatedPageHeight = pageWidth / aspectRatio
                        } else {
                          // 원본 크기를 아직 모르면 컨테이너 크기의 95% 사용
                          pageWidth = availableWidth * 0.95
                        }

                        // 새 창에서 PDF 열기
                        const handleOpenInNewWindow = () => {
                          // sessionStorage에 PDF URL 저장 (URL이 너무 길거나 base64인 경우 대비)
                          const storageKey = `pdf-viewer-${block.id}-${Date.now()}`
                          sessionStorage.setItem(storageKey, pdfUrl)

                          // 짧은 키만 URL 파라미터로 전달
                          const viewerUrl = `/student/pdf-viewer?key=${storageKey}`

                          // 팝업 차단 확인
                          const newWindow = window.open(viewerUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')

                          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                            alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.')
                            // 팝업이 차단된 경우 sessionStorage 정리
                            sessionStorage.removeItem(storageKey)
                          }
                        }

                        return (
                          <div key={block.id} className="w-full">
                            {/* PDF 뷰어 헤더 - 새 창 열기 버튼 */}
                            <div className="flex items-center justify-end p-2 bg-gray-100 border border-gray-200 rounded-t-lg border-b-0">
                              <button
                                onClick={handleOpenInNewWindow}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-200 rounded-lg transition-colors"
                                title="새 창에서 열기"
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span>새 창에서 열기</span>
                              </button>
                            </div>
                            {/* PDF 뷰어 컨테이너 - PDF 높이에 맞춰 동적 조정 */}
                            <div
                              className="border border-gray-200 border-t-0 overflow-hidden bg-gray-50 flex justify-center items-start"
                              style={{
                                width: '100%',
                                minHeight: '400px',
                                height: calculatedPageHeight ? `${calculatedPageHeight}px` : 'auto'
                              }}
                            >
                              <Document
                                file={pdfUrl}
                                onLoadStart={() => {
                                  setPdfLoading(prev => ({ ...prev, [block.id]: true }))
                                }}
                                onLoadSuccess={async (pdf) => {
                                  setPdfPages(prev => ({ ...prev, [block.id]: pdf.numPages }))
                                  if (!pdfPageNumbers[block.id]) {
                                    setPdfPageNumbers(prev => ({ ...prev, [block.id]: 1 }))
                                  }
                                  // 첫 페이지의 원본 크기 가져오기
                                  try {
                                    const firstPage = await pdf.getPage(1)
                                    const viewport = firstPage.getViewport({ scale: 1.0 })
                                    setPdfPageSizes(prev => ({
                                      ...prev,
                                      [block.id]: {
                                        width: viewport.width,
                                        height: viewport.height
                                      }
                                    }))
                                  } catch (error) {
                                    console.error('PDF 페이지 크기 가져오기 실패:', error)
                                  }
                                  setPdfLoading(prev => ({ ...prev, [block.id]: false }))
                                }}
                                onLoadError={(error) => {
                                  console.error('PDF 로드 에러:', { blockId: block.id, error, url: pdfUrl, originalContent: block.content })
                                  setPdfLoading(prev => ({ ...prev, [block.id]: false }))
                                }}
                                loading={
                                  <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                      <p className="text-gray-500">PDF 로딩 중...</p>
                                    </div>
                                  </div>
                                }
                                error={
                                  <div className="flex items-center justify-center h-full">
                                    <div className="text-center text-red-500">
                                      <p className="mb-2">PDF 로드 실패</p>
                                      <p className="text-sm text-gray-500">{pdfUrl}</p>
                                    </div>
                                  </div>
                                }
                                options={pdfOptions}
                              >
                                <div style={{ width: pageWidth, position: 'relative', margin: '0 auto' }}>
                                  {pdfLoading[block.id] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
                                      <div className="text-center">
                                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                        <p className="text-gray-500">페이지 로딩 중...</p>
                                      </div>
                                    </div>
                                  )}
                                  <Page
                                    pageNumber={currentPage}
                                    width={pageWidth}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    // 원본 화질을 위한 고해상도 렌더링 (원본 크기 유지)
                                    devicePixelRatio={devicePixelRatio}
                                    onLoadStart={() => {
                                      setPdfLoading(prev => ({ ...prev, [block.id]: true }))
                                    }}
                                    onLoadSuccess={() => {
                                      setPdfLoading(prev => ({ ...prev, [block.id]: false }))
                                    }}
                                    onLoadError={() => {
                                      setPdfLoading(prev => ({ ...prev, [block.id]: false }))
                                    }}
                                    loading={
                                      <div className="flex items-center justify-center" style={{ width: pageWidth, minHeight: '400px' }}>
                                        <div className="text-center">
                                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                          <p className="text-gray-500">페이지 로딩 중...</p>
                                        </div>
                                      </div>
                                    }
                                  />
                                </div>
                              </Document>
                            </div>

                            {/* PDF 뷰어 하단 컨트롤 바 - 페이지 이동 */}
                            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-b-lg border-t-0 shadow-sm">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => setPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.max(1, (prev[block.id] || 1) - 1) }))}
                                  disabled={currentPage === 1 || pdfLoading[block.id]}
                                  className="flex items-center justify-center w-10 h-10 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group"
                                  title="이전 페이지"
                                >
                                  <ChevronLeft className={`h-5 w-5 ${currentPage === 1 || pdfLoading[block.id] ? 'text-gray-400' : 'text-gray-700 group-hover:text-blue-600'}`} />
                                </button>
                                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm">
                                  <input
                                    type="number"
                                    min={1}
                                    max={totalPages}
                                    value={currentPage}
                                    onChange={(e) => {
                                      const page = parseInt(e.target.value) || 1
                                      const validPage = Math.max(1, Math.min(totalPages, page))
                                      setPdfPageNumbers(prev => ({ ...prev, [block.id]: validPage }))
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    className="w-12 px-1 py-1 text-center border-0 rounded text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-900 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    disabled={pdfLoading[block.id]}
                                    style={{ fontVariantNumeric: 'tabular-nums' }}
                                  />
                                  <span className="text-sm text-gray-500 font-medium">/</span>
                                  <span className="text-sm text-gray-700 font-semibold w-12 text-center tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{totalPages}</span>
                                </div>
                                <button
                                  onClick={() => setPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.min(totalPages, (prev[block.id] || 1) + 1) }))}
                                  disabled={currentPage === totalPages || pdfLoading[block.id]}
                                  className="flex items-center justify-center w-10 h-10 bg-white hover:bg-blue-50 border border-gray-300 hover:border-blue-400 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group"
                                  title="다음 페이지"
                                >
                                  <ChevronRight className={`h-5 w-5 ${currentPage === totalPages || pdfLoading[block.id] ? 'text-gray-400' : 'text-gray-700 group-hover:text-blue-600'}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      if (block.type === 'video' && block.content) {
                        const getYouTubeVideoId = (url: string) => {
                          // cSpell:ignore youtu
                          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
                          const match = url.match(regExp)
                          return (match && match[2].length === 11) ? match[2] : null
                        }
                        const videoId = getYouTubeVideoId(block.content)
                        return (
                          <div key={block.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            {videoId ? (
                              <iframe
                                width="100%"
                                height="400"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                frameBorder={0}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video controls className="w-full" src={block.content} />
                            )}
                          </div>
                        )
                      }
                      if (block.type === 'image' && block.content) {
                        // 이미지 URL 처리: base64 데이터 URL은 그대로 사용, 상대 경로면 절대 URL로 변환
                        let imageUrl = block.content
                        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                          if (imageUrl.startsWith('/')) {
                            imageUrl = `http://localhost:3000${imageUrl}`
                          } else if (imageUrl) {
                            imageUrl = `http://localhost:3000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
                          }
                        }

                        if (!imageUrl || !imageUrl.trim()) {
                          return (
                            <div key={block.id} className="p-8 text-center text-gray-500">이미지 URL이 없습니다.</div>
                          )
                        }


                        return (
                          <div key={block.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex justify-center p-4 min-h-[400px]">
                            <img
                              src={imageUrl}
                              alt="Content"
                              className="max-w-full h-auto object-contain"
                              style={{ maxWidth: '1200px', maxHeight: '800px' }}
                              onError={(e) => {
                                console.error('이미지 로드 실패:', { blockId: block.id, url: imageUrl, originalContent: block.content })
                                e.currentTarget.style.display = 'none'
                                const parent = e.currentTarget.parentElement
                                if (parent) {
                                  parent.innerHTML = `<div class="p-8 text-center text-red-500">이미지 로드 실패: ${imageUrl}</div>`
                                }
                              }}
                            />
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                ) : selectedContent.text ? (
                  <div
                    className="text-gray-900 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{
                      __html: selectedContent.text.includes('<') && selectedContent.text.includes('>')
                        ? selectedContent.text
                        : marked(selectedContent.text)
                    }}
                  />
                ) : (
                  <div className="text-gray-500">강의 내용이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side Navigation */}
      <VideoSideNav
        activeTab={sideNavTab}
        onTabChange={setSideNavTab}
        isExpanded={isSideNavExpanded}
        onExpandChange={setIsSideNavExpanded}
        courseId={courseId}
      />
    </div>
  )
}
