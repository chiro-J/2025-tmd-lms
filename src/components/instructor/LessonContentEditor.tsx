import { FileText, Plus } from 'lucide-react'
import { marked } from 'marked'
import type { ContentBlock, Lesson } from '../../types/curriculum'
import ContentBlockEditor from './ContentBlockEditor'

interface LessonContentEditorProps {
  lesson: Lesson
  isEditMode: boolean
  savedEditorType: 'text' | 'markdown'
  contentBlocks: ContentBlock[]
  content: string
  pdfPages: Record<string, number>
  pdfPageNumbers: Record<string, number>
  onAddBlock: (type: 'markdown' | 'pdf' | 'video' | 'image') => void
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
                <p className="text-xs text-gray-500">상단의 버튼을 클릭하여 Markdown, PDF, 동영상, 이미지를 추가할 수 있습니다</p>
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
            {content ? (
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

