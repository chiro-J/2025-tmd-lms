import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { marked } from 'marked'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import VideoSideNav from '../../components/learning/VideoSideNav'
import type { ContentBlock } from '../../types/curriculum'
import type { CurriculumModule, Lesson } from '../../core/api/curriculum'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function Learning() {
  const params = useParams()
  const courseId = Number(params.id) || 1
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(window.location.search))
  const [sideNavTab, setSideNavTab] = useState('curriculum')
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(true)
  const [curriculumModules, setCurriculumModules] = useState<CurriculumModule[]>([])
  const [selectedLessonData, setSelectedLessonData] = useState<{ title: string; text: string } | null>(null)
  const [selectedContentBlocks, setSelectedContentBlocks] = useState<ContentBlock[]>([])
  const [loadingLesson, setLoadingLesson] = useState(false)
  const [pdfPages, setPdfPages] = useState<Record<string, number>>({})
  const [pdfPageNumbers, setPdfPageNumbers] = useState<Record<string, number>>({})
  const [pdfLoading, setPdfLoading] = useState<Record<string, boolean>>({})
  const [pdfScale, setPdfScale] = useState<Record<string, number>>({})

  const selectedLessonId = useMemo(() => searchParams.get('lesson') || '', [searchParams])

  // 마지막 학습한 강좌 저장
  useEffect(() => {
    if (courseId) {
      localStorage.setItem('lastLearnedCourseId', String(courseId))
      localStorage.setItem('lastLearnedCourseTimestamp', String(Date.now()))
    }
  }, [courseId])

  // PDF 옵션 메모이제이션 (불필요한 리로드 방지)
  const pdfOptions = useMemo(
    () => ({
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    }),
    []
  )

  // 마지막 학습한 강좌 저장
  useEffect(() => {
    if (courseId) {
      localStorage.setItem('lastLearnedCourseId', String(courseId))
      localStorage.setItem('lastLearnedCourseTimestamp', String(Date.now()))
    }
  }, [courseId])

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
      setSelectedLessonData(null)
      return
    }

    setLoadingLesson(true)
    const lessonId = Number(selectedLessonId)

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
    if (loadingLesson) {
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
  }, [selectedLessonData, loadingLesson])

  // URL 변경 감지 (뒤로가기 등)
  useEffect(() => {
    const onPop = () => setSearchParams(new URLSearchParams(window.location.search))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-hidden">
      {/* Header / GNB */}
      <div
        className="fixed top-0 z-40 bg-gray-100 border-b border-gray-300 shadow-sm"
        style={{
          left: isSideNavExpanded ? '368px' : '0',
          width: isSideNavExpanded ? 'calc(100vw - 368px)' : '100vw'
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-1 whitespace-normal break-words leading-snug text-gray-900">
                {selectedContent.title}
              </h1>
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-200"
            >
              ← 뒤로가기
            </button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div
        className="fixed top-16 bottom-0 transition-all duration-300 bg-gray-50"
        style={{
          left: isSideNavExpanded ? '368px' : '0',
          width: isSideNavExpanded ? 'calc(100vw - 368px)' : '100vw'
        }}
      >
        {/* Content Switch */}
        {(
          <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="max-w-none w-full bg-gray-50 min-h-full">
              {/* 경로 표시 */}
              {(() => {
                const currentModule = curriculumModules.find((m: CurriculumModule) =>
                  m.lessons?.some((l: Lesson) => l.id === Number(selectedLessonId))
                )
                const currentLesson = currentModule?.lessons?.find((l: Lesson) => l.id === Number(selectedLessonId))
                return currentModule && currentLesson ? (
                  <div className={`pt-8 pb-4 border-b border-gray-200 ${isSideNavExpanded ? 'pl-24' : 'pl-16'}`}>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{currentModule.title}</span>
                      <span>/</span>
                      <span className="text-gray-700">{currentLesson.title}</span>
                    </div>
                  </div>
                ) : null
              })()}
              <div className={`prose prose-lg max-w-none py-12 ${isSideNavExpanded ? 'pl-24 pr-8' : 'pl-16 pr-8'}`}>
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
                        const currentScale = pdfScale[block.id] || 1.0
                        const maxWidth = Math.min(1200, window.innerWidth - (isSideNavExpanded ? 400 : 100))
                        const pageWidth = maxWidth * currentScale

                        return (
                          <div key={block.id} className="w-full">
                            {/* PDF 뷰어 컨트롤 바 */}
                            <div className="flex items-center justify-between p-3 bg-gray-200 border border-gray-300 rounded-t-lg border-b-0">
                              {/* 페이지 이동 컨트롤 - 가운데 정렬 */}
                              <div className="flex-1 flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => setPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.max(1, (prev[block.id] || 1) - 1) }))}
                                  disabled={currentPage === 1 || pdfLoading[block.id]}
                                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                                >
                                  ← 이전
                                </button>
                                <div className="flex items-center space-x-2">
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
                                    className="w-16 px-2 py-2 text-center border border-gray-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                                    disabled={pdfLoading[block.id]}
                                  />
                                  <span className="text-sm text-gray-700 font-medium">/ {totalPages}</span>
                                </div>
                                <button
                                  onClick={() => setPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.min(totalPages, (prev[block.id] || 1) + 1) }))}
                                  disabled={currentPage === totalPages || pdfLoading[block.id]}
                                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                                >
                                  다음 →
                                </button>
                              </div>
                              {/* 줌 컨트롤 - 오른쪽 정렬 */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setPdfScale(prev => ({ ...prev, [block.id]: Math.max(0.5, (prev[block.id] || 1.0) - 0.25) }))}
                                  disabled={pdfLoading[block.id]}
                                  className="px-3 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                                  title="축소"
                                >
                                  −
                                </button>
                                <span className="text-sm text-gray-700 min-w-[60px] text-center font-medium">
                                  {Math.round(currentScale * 100)}%
                                </span>
                                <button
                                  onClick={() => setPdfScale(prev => ({ ...prev, [block.id]: Math.min(2.0, (prev[block.id] || 1.0) + 0.25) }))}
                                  disabled={pdfLoading[block.id]}
                                  className="px-3 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                                  title="확대"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* PDF 뷰어 컨테이너 - 고정 높이로 레이아웃 시프트 방지 */}
                            <div
                              className="border border-gray-200 rounded-b-lg overflow-auto bg-gray-50 flex justify-center items-start"
                              style={{
                                minHeight: '600px',
                                maxHeight: '800px',
                                height: '800px'
                              }}
                            >
                              <Document
                                file={pdfUrl}
                                onLoadStart={() => {
                                  setPdfLoading(prev => ({ ...prev, [block.id]: true }))
                                }}
                                onLoadSuccess={(pdf) => {
                                  setPdfPages(prev => ({ ...prev, [block.id]: pdf.numPages }))
                                  if (!pdfPageNumbers[block.id]) {
                                    setPdfPageNumbers(prev => ({ ...prev, [block.id]: 1 }))
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
                                <div style={{ minHeight: '600px', width: pageWidth, position: 'relative' }}>
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
                                    scale={currentScale}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
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
                                      <div className="flex items-center justify-center" style={{ minHeight: '600px', width: pageWidth }}>
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
