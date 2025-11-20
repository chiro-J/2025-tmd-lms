import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, User } from 'lucide-react'
import Card from '../../components/ui/Card'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import { marked } from 'marked'
import type { ContentBlock } from '../../types/curriculum'
import { safeHtml } from '../../utils/safeHtml'
import { getInstructorIntroductionPublic } from '../../core/api/admin'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function InstructorIntroduction() {
  const { instructorId } = useParams<{ instructorId: string }>()
  const navigate = useNavigate()
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [instructorName, setInstructorName] = useState<string>('')
  const [pdfPages, setPdfPages] = useState<Record<string, number>>({})
  const [pdfPageNumbers, setPdfPageNumbers] = useState<Record<string, number>>({})

  useEffect(() => {
    const loadIntroduction = async () => {
      if (!instructorId) {
        setLoading(false)
        return
      }

      try {
        // DB에서 강의자 소개 불러오기
        const introduction = await getInstructorIntroductionPublic(Number(instructorId))

        if (introduction) {
          try {
            const parsed = JSON.parse(introduction)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setContentBlocks(parsed)
            } else {
              // 단일 문자열인 경우
              const migratedBlock: ContentBlock = {
                id: `block-${Date.now()}`,
                type: 'markdown',
                content: introduction
              }
              setContentBlocks([migratedBlock])
            }
          } catch (error) {
            // JSON 파싱 실패 시 마크다운으로 처리
            const migratedBlock: ContentBlock = {
              id: `block-${Date.now()}`,
              type: 'markdown',
              content: introduction
            }
            setContentBlocks([migratedBlock])
          }
        }

        // 강의자 이름 가져오기 (선택사항)
        try {
          const { getInstructors } = await import('../../core/api/admin')
          const instructors = await getInstructors()
          const instructor = instructors.find(inst => inst.id === Number(instructorId))
          if (instructor) {
            setInstructorName(instructor.name || '강의자')
          }
        } catch (error) {
          console.error('강의자 정보 로드 실패:', error)
        }
      } catch (error) {
        console.error('강의자 소개 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadIntroduction()
  }, [instructorId])

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const pdfOptions = useMemo(
    () => ({
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    }),
    []
  )

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'markdown':
        return (
          <div
            className="text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: safeHtml(marked(block.content) as string) }}
          />
        )
      case 'lexical':
        return (
          <div
            className="text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: safeHtml(block.content) }}
          />
        )
      case 'pdf':
        if (!block.content) return null
        // PDF URL 처리
        let pdfUrl = block.content
        if (!pdfUrl.startsWith('http') && !pdfUrl.startsWith('data:')) {
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
          const baseUrl = apiBaseUrl.replace('/api', '')
          if (pdfUrl.startsWith('/')) {
            pdfUrl = `${baseUrl}${pdfUrl}`
          } else if (pdfUrl) {
            pdfUrl = `${baseUrl}/${pdfUrl}`
          }
        }
        return (
          <div className="w-full">
            {/* PDF 뷰어 컨트롤 바 */}
            <div className="flex items-center justify-between p-3 bg-gray-200 border border-gray-300 rounded-t-lg border-b-0">
              <div className="flex-1 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.max(1, (prev[block.id] || 1) - 1) }))}
                  disabled={pdfPageNumbers[block.id] <= 1}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                >
                  ← 이전
                </button>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    max={pdfPages[block.id] || 1}
                    value={pdfPageNumbers[block.id] || 1}
                    onChange={(e) => {
                      const page = parseInt(e.target.value) || 1
                      const validPage = Math.max(1, Math.min(pdfPages[block.id] || 1, page))
                      setPdfPageNumbers(prev => ({ ...prev, [block.id]: validPage }))
                    }}
                    className="w-16 px-2 py-2 text-center border border-gray-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  />
                  <span className="text-sm text-gray-700 font-medium">/ {pdfPages[block.id] || 1}</span>
                </div>
                <button
                  onClick={() => setPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.min(pdfPages[block.id] || 1, (prev[block.id] || 1) + 1) }))}
                  disabled={pdfPageNumbers[block.id] >= (pdfPages[block.id] || 1)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                >
                  다음 →
                </button>
              </div>
            </div>
            {/* PDF 뷰어 */}
            <div className="border border-gray-200 rounded-b-lg overflow-auto bg-gray-50 flex justify-center items-start" style={{ minHeight: '600px', maxHeight: '800px', height: '800px' }}>
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => {
                  setPdfPages(prev => ({ ...prev, [block.id]: numPages }))
                  if (!pdfPageNumbers[block.id]) {
                    setPdfPageNumbers(prev => ({ ...prev, [block.id]: 1 }))
                  }
                }}
                options={pdfOptions}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-500">PDF 로딩 중...</p>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={pdfPageNumbers[block.id] || 1}
                  width={Math.min(1200, typeof window !== 'undefined' ? window.innerWidth - 400 : 1200)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          </div>
        )
      case 'video':
        const videoId = getYouTubeVideoId(block.content)
        if (!videoId) {
          return (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-600">
              유효하지 않은 동영상 URL입니다.
            </div>
          )
        }
        return (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      case 'image':
        if (!block.content) return null
        // 이미지 URL 처리
        let imageUrl = block.content
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
          const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
          const baseUrl = apiBaseUrl.replace('/api', '')
          if (imageUrl.startsWith('/')) {
            imageUrl = `${baseUrl}${imageUrl}`
          } else if (imageUrl) {
            imageUrl = `${baseUrl}/${imageUrl}`
          }
        }
        return (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex justify-center p-4 min-h-[400px]">
            <img
              src={imageUrl}
              alt="소개 이미지"
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
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">돌아가기</span>
            </button>

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {instructorName ? `${instructorName} 강사님의 소개글` : '강사님의 소개글'}
                </h1>
              </div>
            </div>
          </div>

          {/* Introduction Content */}
          {contentBlocks.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">소개글이 없습니다</h3>
              <p className="text-gray-600">강의자가 아직 소개글을 작성하지 않았습니다.</p>
            </Card>
          ) : (
            <div className="prose prose-lg max-w-none py-12 space-y-6">
              {contentBlocks.map((block) => (
                <div key={block.id}>
                  {renderBlock(block)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

