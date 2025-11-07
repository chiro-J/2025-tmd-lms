import React from 'react'
import { FileText, Upload, Image, GripVertical, Trash2, MoveUp, MoveDown } from 'lucide-react'
import { Document, Page } from 'react-pdf'
import MarkdownEditor from '../editor/MarkdownEditor'
import type { ContentBlock } from '../../types/curriculum'

interface ContentBlockEditorProps {
  block: ContentBlock
  index?: number
  totalBlocks?: number
  pdfPages?: Record<string, number>
  pdfPageNumbers?: Record<string, number>
  onUpdateContent: (blockId: string, content: string) => void
  onRemove: (blockId: string) => void
  onMove: (blockId: string, direction: 'up' | 'down') => void
  onPdfUpload: (blockId: string, file: File) => void
  onImageUpload: (blockId: string, file: File) => void
  onPdfPageChange: (blockId: string, page: number) => void
  onDocumentLoadSuccess: (blockId: string, numPages: number) => void
  getYouTubeVideoId: (url: string) => string | null
  isEditMode?: boolean
}

export default function ContentBlockEditor({
  block,
  index,
  totalBlocks,
  pdfPages = {},
  pdfPageNumbers = {},
  onUpdateContent,
  onRemove,
  onMove,
  onPdfUpload,
  onImageUpload,
  onPdfPageChange,
  onDocumentLoadSuccess,
  getYouTubeVideoId,
  isEditMode = false,
}: ContentBlockEditorProps) {
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onPdfUpload(block.id, file)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onImageUpload(block.id, file)
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdateContent(block.id, reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const blockIndex = index ?? 0
  const totalBlocksCount = totalBlocks ?? 1

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 블록 헤더 */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {block.type === 'markdown' && 'Markdown 편집기'}
            {block.type === 'pdf' && 'PDF'}
            {block.type === 'video' && '동영상'}
            {block.type === 'image' && '이미지'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMove(block.id, 'up')}
            disabled={blockIndex === 0}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="위로 이동"
          >
            <MoveUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMove(block.id, 'down')}
            disabled={blockIndex === totalBlocksCount - 1}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="아래로 이동"
          >
            <MoveDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(block.id)}
            className="p-1.5 text-red-400 hover:text-red-600"
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 블록 내용 */}
      <div className="p-4">
        {block.type === 'markdown' && (
          <MarkdownEditor
            initialValue={block.content || ''}
            onChange={(md) => onUpdateContent(block.id, md)}
            height={400}
          />
        )}
        {block.type === 'pdf' && (
          <div className="space-y-4">
            {block.content ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">PDF 미리보기</span>
                  <button
                    onClick={() => onUpdateContent(block.id, '')}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    제거
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <Document
                    file={block.content}
                    onLoadSuccess={(pdf) => onDocumentLoadSuccess(block.id, pdf.numPages)}
                    loading={<div className="p-8 text-center text-gray-500">PDF 로딩 중...</div>}
                    error={<div className="p-8 text-center text-red-500">PDF 로드 실패</div>}
                  >
                    <Page
                      pageNumber={pdfPageNumbers[block.id] || 1}
                      width={600}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>
                {pdfPages[block.id] && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onPdfPageChange(block.id, Math.max(1, (pdfPageNumbers[block.id] || 1) - 1))}
                      disabled={pdfPageNumbers[block.id] === 1}
                      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-30"
                    >
                      이전
                    </button>
                    <span className="text-sm text-gray-600">
                      {pdfPageNumbers[block.id] || 1} / {pdfPages[block.id]}
                    </span>
                    <button
                      onClick={() => onPdfPageChange(block.id, Math.min(pdfPages[block.id], (pdfPageNumbers[block.id] || 1) + 1))}
                      disabled={pdfPageNumbers[block.id] === pdfPages[block.id]}
                      className="px-3 py-1 border border-gray-300 rounded disabled:opacity-30"
                    >
                      다음
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-700 mb-2">PDF 파일 업로드</p>
                  <p className="text-xs text-gray-500">클릭하여 파일 선택</p>
                </div>
              </label>
            )}
          </div>
        )}
        {block.type === 'video' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                동영상 URL (YouTube, Vimeo) 또는 파일 업로드
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={block.content || ''}
                  onChange={(e) => onUpdateContent(block.id, e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm flex items-center">
                  <Upload className="h-4 w-4 mr-1" />
                  파일
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {block.content && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {getYouTubeVideoId(block.content) ? (
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(block.content)}`}
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video controls className="w-full" src={block.content} />
                )}
              </div>
            )}
          </div>
        )}
        {block.type === 'image' && (
          <div className="space-y-4">
            {block.content ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">이미지 미리보기</span>
                  <button
                    onClick={() => onUpdateContent(block.id, '')}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    제거
                  </button>
                </div>
                <img src={block.content} alt="Uploaded" className="max-w-full rounded-lg border border-gray-200" />
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-700 mb-2">이미지 파일 업로드</p>
                  <p className="text-xs text-gray-500">클릭하여 파일 선택</p>
                </div>
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
