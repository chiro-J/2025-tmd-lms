import { useState, useMemo } from 'react'
import { FileText, Plus } from 'lucide-react'
import { marked } from 'marked'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import type { ContentBlock, Lesson } from '../../types/curriculum'
import ContentBlockEditor from './ContentBlockEditor'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface LessonContentEditorProps {
  lesson: Lesson
  isEditMode: boolean
  savedEditorType: 'text' | 'markdown'
  contentBlocks: ContentBlock[]
  content: string
  pdfPages: Record<string, number>
  pdfPageNumbers: Record<string, number>
  onAddBlock: (type: 'markdown' | 'lexical' | 'pdf' | 'video' | 'image') => void
  onUpdateBlockContent: (blockId: string, content: string) => void
  onRemoveBlock: (blockId: string) => void
  onMoveBlock: (blockId: string, direction: 'up' | 'down') => void
  onPdfUpload: (blockId: string, file: File) => void
  onImageUpload: (blockId: string, file: File) => void
  onPdfPageChange: (blockId: string, page: number) => void
  onDocumentLoadSuccess: (blockId: string, numPages: number) => void
  getYouTubeVideoId: (url: string) => string | null
}

function LessonContentEditor({
  lesson,
  isEditMode,
  savedEditorType,
  contentBlocks,
  content,
  pdfPages,
  pdfPageNumbers,
  onAddBlock,
  onUpdateBlockContent,
  onRemoveBlock,
  onMoveBlock,
  onPdfUpload,
  onImageUpload,
  onPdfPageChange,
  onDocumentLoadSuccess,
  getYouTubeVideoId,
}: LessonContentEditorProps) {
  // 비편집 모드용 PDF 페이지 상태
  const [viewPdfPages, setViewPdfPages] = useState<Record<string, number>>({})
  const [viewPdfPageNumbers, setViewPdfPageNumbers] = useState<Record<string, number>>({})

  // PDF 옵션 메모이제이션
  const pdfOptions = useMemo(
    () => ({
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    }),
    []
  )
  return (
    <div className="space-y-6">
      {/* 강의 제목 */}
      <div className="mb-8 pb-6 border-b-2 border-gray-300">
        <h2 className="text-3xl font-bold text-gray-900">{lesson.title}</h2>
      </div>

      {/* 강의 내용 편집 영역 - 블록 기반 */}
      <div className="mt-8">
        {isEditMode ? (
          <div className="space-y-6">
            {/* 추가 버튼들 */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">강의 내용</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onAddBlock('lexical')}
                  className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Text 편집기</span>
                </button>
                <button
                  onClick={() => onAddBlock('markdown')}
                  className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Markdown 편집기</span>
                </button>
                <button
                  onClick={() => onAddBlock('pdf')}
                  className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>PDF 추가</span>
                </button>
                <button
                  onClick={() => onAddBlock('video')}
                  className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>동영상 추가</span>
                </button>
                <button
                  onClick={() => onAddBlock('image')}
                  className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>이미지 추가</span>
                </button>
              </div>
            </div>

            {/* 블록이 없을 때 안내 메시지 */}
            {contentBlocks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 font-medium mb-2">버튼을 눌러 강의를 추가하세요</p>
                <p className="text-xs text-gray-500">상단의 버튼을 클릭하여 Text, Markdown, PDF, 동영상, 이미지를 추가할 수 있습니다</p>
              </div>
            )}

            {/* 블록 목록 */}
            {contentBlocks.length > 0 && (
              <div className="space-y-4">
                {contentBlocks.map((block) => (
                  <ContentBlockEditor
                    key={block.id}
                    block={block}
                    index={undefined}
                    totalBlocks={undefined}
                    pdfPages={pdfPages}
                    pdfPageNumbers={pdfPageNumbers}
                    onUpdateContent={onUpdateBlockContent}
                    onRemove={onRemoveBlock}
                    onMove={onMoveBlock}
                    onPdfUpload={onPdfUpload}
                    onImageUpload={onImageUpload}
                    onPdfPageChange={onPdfPageChange}
                    onDocumentLoadSuccess={onDocumentLoadSuccess}
                    getYouTubeVideoId={getYouTubeVideoId}
                    isEditMode={isEditMode}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg min-h-[400px]">
            {contentBlocks.length > 0 ? (
              <div className="p-6 space-y-6">
                {contentBlocks.map((block) => {
                  if (block.type === 'markdown') {
                    return (
                      <div
                        key={block.id}
                        className="prose prose-lg max-w-none text-gray-900 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: marked(block.content || '') }}
                      />
                    )
                  }
                  if (block.type === 'lexical') {
                    return (
                      <div
                        key={block.id}
                        className="prose prose-lg max-w-none text-gray-900 leading-relaxed"
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

                    return (
                      <div key={block.id} className="w-full max-w-full overflow-x-auto">
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex justify-center p-4">
                          <Document
                            file={pdfUrl}
                            onLoadSuccess={(pdf) => {
                              setViewPdfPages(prev => ({ ...prev, [block.id]: pdf.numPages }))
                              setViewPdfPageNumbers(prev => ({ ...prev, [block.id]: 1 }))
                            }}
                            onLoadError={(error) => {
                              console.error('PDF 로드 에러:', { blockId: block.id, error, url: pdfUrl, originalContent: block.content })
                            }}
                            loading={<div className="p-8 text-center text-gray-500">PDF 로딩 중...</div>}
                            error={<div className="p-8 text-center text-red-500">PDF 로드 실패: {pdfUrl}</div>}
                            options={pdfOptions}
                          >
                            <Page
                              pageNumber={viewPdfPageNumbers[block.id] || 1}
                              width={Math.min(1000, typeof window !== 'undefined' ? window.innerWidth - 500 : 1000)}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              loading={<div className="p-8 text-center text-gray-500">페이지 로딩 중...</div>}
                            />
                          </Document>
                        </div>
                        {viewPdfPages[block.id] && (
                          <div className="flex items-center justify-center space-x-4 p-4 bg-white border-t border-gray-200">
                            <button
                              onClick={() => setViewPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.max(1, (prev[block.id] || 1) - 1) }))}
                              disabled={viewPdfPageNumbers[block.id] === 1}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              이전
                            </button>
                            <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
                              {viewPdfPageNumbers[block.id] || 1} / {viewPdfPages[block.id]}
                            </span>
                            <button
                              onClick={() => setViewPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.min(viewPdfPages[block.id], (prev[block.id] || 1) + 1) }))}
                              disabled={viewPdfPageNumbers[block.id] === viewPdfPages[block.id]}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              다음
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  }
                  if (block.type === 'video' && block.content) {
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

                    return (
                      <div key={block.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex justify-center p-4">
                        <img
                          src={imageUrl}
                          alt="Content"
                          className="max-w-full h-auto object-contain"
                          style={{ maxWidth: '100%', maxHeight: '800px' }}
                          onError={(e) => {
                            console.error('이미지 로드 실패:', { blockId: block.id, url: imageUrl, originalContent: block.content })
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.innerHTML = `<div class="p-8 text-center text-red-500">이미지 로드 실패</div>`
                            }
                          }}
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            ) : content ? (
              <div className="p-6">
                {savedEditorType === 'markdown' ? (
                  <div
                    className="prose prose-lg max-w-none text-gray-900 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: marked(content) }}
                  />
                ) : (
                  <div
                    className="prose prose-lg max-w-none text-gray-900 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <p className="text-gray-500">이 곳에 강의 내용이 표시됩니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonContentEditor

