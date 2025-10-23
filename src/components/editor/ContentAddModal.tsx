import React, { useState } from 'react'
import { 
  X, 
  Type, 
  Image, 
  Video, 
  FileText, 
  Code, 
  File,
  Loader2
} from 'lucide-react'
import type { ContentBlock } from '../../types'

interface ContentAddModalProps {
  isOpen: boolean
  onClose: () => void
  onAddContent: (contentType: ContentBlock['type']) => void
  selectedModule?: string
}

const ContentAddModal: React.FC<ContentAddModalProps> = ({
  isOpen,
  onClose,
  onAddContent,
  selectedModule
}) => {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddContent = async (contentType: ContentBlock['type']) => {
    setIsAdding(true)
    try {
      await onAddContent(contentType)
      onClose()
    } catch (error) {
      console.error('콘텐츠 추가 실패:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const contentTypes = [
    {
      type: 'text' as const,
      label: '텍스트/HTML',
      description: '리치 텍스트 에디터로 텍스트 작성',
      icon: Type,
      color: 'blue'
    },
    {
      type: 'code' as const,
      label: '소스 코드',
      description: '프로그래밍 코드 블록 추가',
      icon: Code,
      color: 'purple'
    },
    {
      type: 'markdown' as const,
      label: '마크다운',
      description: '마크다운 형식으로 텍스트 작성',
      icon: File,
      color: 'gray'
    },
    {
      type: 'image' as const,
      label: '이미지',
      description: '이미지 파일 업로드',
      icon: Image,
      color: 'green'
    },
    {
      type: 'video' as const,
      label: '동영상',
      description: '동영상 파일 업로드',
      icon: Video,
      color: 'red'
    },
    {
      type: 'pdf' as const,
      label: 'PDF',
      description: 'PDF 문서 업로드',
      icon: FileText,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100 text-blue-700',
      purple: 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:bg-purple-100 text-purple-700',
      gray: 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 text-gray-700',
      green: 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 text-green-700',
      red: 'border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100 text-red-700',
      orange: 'border-orange-200 bg-orange-50 hover:border-orange-300 hover:bg-orange-100 text-orange-700'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">콘텐츠 추가</h2>
            {selectedModule && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedModule}에 콘텐츠를 추가합니다
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 콘텐츠 타입 선택 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentTypes.map((contentType) => {
              const Icon = contentType.icon
              return (
                <button
                  key={contentType.type}
                  onClick={() => handleAddContent(contentType.type)}
                  disabled={isAdding}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${getColorClasses(contentType.color)} ${
                    isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {isAdding ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-lg">{contentType.label}</h3>
                      <p className="text-sm opacity-80 mt-1">
                        {contentType.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContentAddModal









