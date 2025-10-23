import React, { useState, useCallback } from 'react'
import { 
  Type, 
  Image, 
  Video, 
  FileText, 
  Code, 
  File,
  Plus,
  Trash2,
  Move,
  Save,
  X
} from 'lucide-react'
import type { ContentEditorProps, ContentBlock } from '../../types'
import StableLexicalEditor from './StableLexicalEditor'
import MediaUpload from './MediaUpload'

const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onUpdate,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(content.title)
  const [description, setDescription] = useState(content.description || '')
  const [blocks, setBlocks] = useState<ContentBlock[]>(content.blocks)
  const [completionCriteria, setCompletionCriteria] = useState(content.completionCriteria || {
    enabled: false,
    type: 'time' as const,
    value: 0
  })
  const [allowDownload, setAllowDownload] = useState(content.allowDownload)
  const [isUploading, setIsUploading] = useState(false)

  const handleSave = useCallback(() => {
    const updatedContent = {
      ...content,
      title,
      description,
      blocks,
      completionCriteria,
      allowDownload
    }
    onUpdate(updatedContent)
    onSave()
  }, [title, description, blocks, completionCriteria, allowDownload, content, onUpdate, onSave])

  const addBlock = useCallback((type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `block_${Date.now()}`,
      type,
      content: '',
      order: blocks.length,
      metadata: {}
    }
    setBlocks([...blocks, newBlock])
  }, [blocks])

  const updateBlock = useCallback((blockId: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ))
  }, [blocks])

  const removeBlock = useCallback((blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId))
  }, [blocks])

  const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(block => block.id === blockId)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(currentIndex, 1)
    newBlocks.splice(newIndex, 0, movedBlock)
    
    // 순서 재정렬
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }))
    
    setBlocks(reorderedBlocks)
  }, [blocks])

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.onloadedmetadata = () => {
        resolve(video.duration)
      }
      video.src = URL.createObjectURL(file)
    })
  }

  const handleFileUpload = useCallback(async (file: File, blockId: string): Promise<string> => {
    setIsUploading(true)
    try {
      // 여기서는 임시로 URL 생성
      const url = URL.createObjectURL(file)
      
      // 메타데이터 업데이트
      const metadata = {
        fileName: file.name,
        fileSize: file.size,
        ...(file.type.startsWith('image/') && {
          dimensions: await getImageDimensions(file)
        }),
        ...(file.type.startsWith('video/') && {
          duration: await getVideoDuration(file)
        })
      }

      updateBlock(blockId, {
        content: url,
        metadata
      })

      return url
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [updateBlock, getImageDimensions, getVideoDuration])

  const renderBlock = (block: ContentBlock) => {
    const blockIndex = blocks.findIndex(b => b.id === block.id)
    const canMoveUp = blockIndex > 0
    const canMoveDown = blockIndex < blocks.length - 1

    return (
      <div key={block.id} className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              {getBlockTypeLabel(block.type)}
            </span>
            <span className="text-xs text-gray-500">
              #{blockIndex + 1}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => moveBlock(block.id, 'up')}
              disabled={!canMoveUp}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              title="위로 이동"
            >
              <Move className="w-4 h-4 rotate-90" />
            </button>
            <button
              onClick={() => moveBlock(block.id, 'down')}
              disabled={!canMoveDown}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              title="아래로 이동"
            >
              <Move className="w-4 h-4 -rotate-90" />
            </button>
            <button
              onClick={() => removeBlock(block.id)}
              className="p-1 text-red-400 hover:text-red-600"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {block.type === 'text' && (
          <StableLexicalEditor
            value={block.content}
            onChange={(html) => updateBlock(block.id, { content: html })}
            placeholder="텍스트 내용을 입력하세요..."
            className="min-h-[200px]"
          />
        )}

        {block.type === 'code' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">언어:</label>
              <select
                value={block.metadata?.language || 'javascript'}
                onChange={(e) => updateBlock(block.id, {
                  metadata: { ...block.metadata, language: e.target.value }
                })}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="코드를 입력하세요..."
            />
          </div>
        )}

        {block.type === 'markdown' && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="마크다운을 입력하세요..."
          />
        )}

        {(block.type === 'image' || block.type === 'video' || block.type === 'pdf') && (
          <MediaUpload
            type={block.type}
            onUpload={(file) => handleFileUpload(file, block.id)}
            onRemove={() => updateBlock(block.id, { content: '' })}
            existingFiles={block.content ? [block.content] : []}
            maxFiles={1}
            maxSize={100}
          />
        )}
      </div>
    )
  }

  const getBlockTypeLabel = (type: ContentBlock['type']): string => {
    const labels = {
      text: '텍스트',
      image: '이미지',
      video: '동영상',
      pdf: 'PDF',
      code: '코드',
      markdown: '마크다운'
    }
    return labels[type] || type
  }

  const getBlockTypeIcon = (type: ContentBlock['type']) => {
    const icons = {
      text: Type,
      image: Image,
      video: Video,
      pdf: FileText,
      code: Code,
      markdown: File
    }
    return icons[type] || File
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">강의 콘텐츠 편집</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            저장
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            강의 제목 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="강의 제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            강의 설명
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="강의 설명을 입력하세요"
            rows={3}
          />
        </div>

        {/* 완료 기준 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="completionCriteria"
              checked={completionCriteria.enabled}
              onChange={(e) => setCompletionCriteria({
                ...completionCriteria,
                enabled: e.target.checked
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="completionCriteria" className="text-sm font-medium text-gray-700">
              강의 수강 완료 기준 사용
            </label>
          </div>

          {completionCriteria.enabled && (
            <div className="ml-7 space-y-3">
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-600">기준 유형:</label>
                <select
                  value={completionCriteria.type}
                  onChange={(e) => setCompletionCriteria({
                    ...completionCriteria,
                    type: e.target.value as 'time' | 'interaction' | 'quiz'
                  })}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="time">시간 기준</option>
                  <option value="interaction">상호작용 기준</option>
                  <option value="quiz">퀴즈 기준</option>
                </select>
              </div>
              
              {completionCriteria.type === 'time' && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">최소 수강 시간 (분):</label>
                  <input
                    type="number"
                    value={completionCriteria.value || 0}
                    onChange={(e) => setCompletionCriteria({
                      ...completionCriteria,
                      value: parseInt(e.target.value) || 0
                    })}
                    className="w-20 px-3 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 다운로드 허용 */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="allowDownload"
            checked={allowDownload}
            onChange={(e) => setAllowDownload(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="allowDownload" className="text-sm font-medium text-gray-700">
            다운로드 허용
          </label>
        </div>
      </div>

      {/* 콘텐츠 블록 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">강의 내용</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {blocks.length}개 블록
            </span>
          </div>
        </div>

        {/* 블록 추가 버튼 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {(['text', 'image', 'video', 'pdf', 'code', 'markdown'] as const).map((type) => {
            const Icon = getBlockTypeIcon(type)
            return (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Icon className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  {getBlockTypeLabel(type)}
                </span>
              </button>
            )
          })}
        </div>

        {/* 콘텐츠 블록들 */}
        {blocks.length > 0 ? (
          <div className="space-y-4">
            {blocks.map(renderBlock)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">콘텐츠 블록을 추가하세요</p>
            <p className="text-sm">위의 버튼을 클릭하여 다양한 유형의 콘텐츠를 추가할 수 있습니다.</p>
          </div>
        )}
      </div>

      {/* 업로드 중 오버레이 */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-900">파일 업로드 중...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentEditor

