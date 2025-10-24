import React, { useState, useCallback } from 'react'
import { 
  Upload, 
  File, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Loader2,
  Trash2,
  Eye
} from 'lucide-react'
import type { MediaUploadProps } from '../../types'

const MediaUpload: React.FC<MediaUploadProps> = ({
  type,
  onUpload,
  onRemove,
  existingFiles,
  maxFiles = 10,
  maxSize = 50 // 50MB
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    
    // 파일 개수 제한 확인
    if (existingFiles.length + fileArray.length > maxFiles) {
      alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
      return
    }

    // 파일 크기 및 타입 확인
    for (const file of fileArray) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`파일 크기는 ${maxSize}MB를 초과할 수 없습니다: ${file.name}`)
        return
      }

      const isValidType = validateFileType(file, type)
      if (!isValidType) {
        alert(`지원하지 않는 파일 형식입니다: ${file.name}`)
        return
      }
    }

    setIsUploading(true)
    try {
      for (const file of fileArray) {
        const url = await onUpload(file)
        console.log('파일 업로드 완료:', url)
      }
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, existingFiles.length, maxFiles, maxSize, type])

  const validateFileType = (file: File, expectedType: string): boolean => {
    const typeMap: Record<string, string[]> = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi'],
      pdf: ['application/pdf']
    }
    
    return typeMap[expectedType]?.includes(file.type) || false
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = getAcceptString(type)
    input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files)
    input.click()
  }, [type, handleFileSelect])

  const getAcceptString = (type: string): string => {
    const acceptMap: Record<string, string> = {
      image: 'image/*',
      video: 'video/*',
      pdf: '.pdf'
    }
    return acceptMap[type] || '*/*'
  }


  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'image': return '이미지'
      case 'video': return '동영상'
      case 'pdf': return 'PDF'
      default: return '파일'
    }
  }

  const typeLabel = getTypeLabel(type)

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">업로드 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {typeLabel} 파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-gray-500">
                최대 {maxFiles}개, {maxSize}MB 이하
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 업로드된 파일 목록 */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            업로드된 {typeLabel} 파일 ({existingFiles.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {existingFiles.map((fileUrl, index) => (
              <FileItem
                key={index}
                url={fileUrl}
                type={type}
                onRemove={() => onRemove(fileUrl)}
                onPreview={() => window.open(fileUrl, '_blank')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FileItemProps {
  url: string
  type: string
  onRemove: () => void
  onPreview: () => void
}

const FileItem: React.FC<FileItemProps> = ({ url, type, onRemove, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      case 'pdf': return FileText
      default: return File
    }
  }

  const FileIcon = getFileIcon(type)

  return (
    <div
      className="relative group border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {type === 'image' ? (
            <img
              src={url}
              alt="업로드된 이미지"
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
              <FileIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {url.split('/').pop()?.split('?')[0] || '파일'}
          </p>
          <p className="text-xs text-gray-500">
            {type === 'image' ? '이미지' : type === 'video' ? '동영상' : 'PDF'}
          </p>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className={`absolute top-2 right-2 flex space-x-1 transition-opacity ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={onPreview}
          className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 transition-colors"
          title="미리보기"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={onRemove}
          className="p-1 bg-white rounded shadow-sm hover:bg-red-50 transition-colors"
          title="삭제"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  )
}

export default MediaUpload












