import { useState, useEffect } from 'react'
import ModalBase from '../modals/ModalBase'
import Button from '../ui/Button'
import type { ContentBlock } from '../../types/curriculum'

interface AssignmentCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: {
    title: string
    description?: string
    dueDate: string
    maxScore?: number
    instructions?: string[]
    allowedFileTypes?: string[]
    maxFileSize?: number
    contentBlocks?: ContentBlock[]
  }) => Promise<void>
  isCreating?: boolean
  initialData?: {
    title: string
    description?: string
    dueDate: string
    maxScore?: number
    instructions?: string[]
    allowedFileTypes?: string[]
    maxFileSize?: number
    contentBlocks?: ContentBlock[]
  }
  isEditMode?: boolean
}

export default function AssignmentCreateModal({
  isOpen,
  onClose,
  onCreate,
  isCreating = false,
  initialData,
  isEditMode = false
}: AssignmentCreateModalProps) {
  // 날짜 형식 변환 헬퍼 함수
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return ''
    if (dateString.includes('T')) {
      return dateString.split('T')[0]
    } else if (dateString.includes(' ')) {
      return dateString.split(' ')[0]
    }
    return dateString
  }

  const [title, setTitle] = useState(initialData?.title || '')
  const [dueDate, setDueDate] = useState(formatDateForInput(initialData?.dueDate))
  const [description, setDescription] = useState(initialData?.description || '')
  const [content, setContent] = useState('') // 과제 내용 텍스트
  const [maxScore, setMaxScore] = useState<number>(initialData?.maxScore || 100)
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(initialData?.allowedFileTypes || ['.pdf', '.doc', '.docx', '.hwp', '.ppt', '.pptx', '.xls', '.xlsx', '.zip'])
  const [maxFileSize, setMaxFileSize] = useState<number>(initialData?.maxFileSize || 50)

  const availableFileTypes = [
    { value: '.pdf', label: 'PDF' },
    { value: '.doc', label: 'Word (doc)' },
    { value: '.docx', label: 'Word (docx)' },
    { value: '.hwp', label: '한글 (hwp)' },
    { value: '.ppt', label: 'PowerPoint (ppt)' },
    { value: '.pptx', label: 'PowerPoint (pptx)' },
    { value: '.xls', label: 'Excel (xls)' },
    { value: '.xlsx', label: 'Excel (xlsx)' },
    { value: '.zip', label: 'ZIP' },
    { value: '.jpg', label: '이미지 (jpg)' },
    { value: '.png', label: '이미지 (png)' },
    { value: '.txt', label: '텍스트 (txt)' },
  ]

  const toggleFileType = (fileType: string) => {
    setAllowedFileTypes(prev =>
      prev.includes(fileType)
        ? prev.filter(t => t !== fileType)
        : [...prev, fileType]
    )
  }

  // initialData가 변경되면 폼 업데이트
  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title || '')
      setDueDate(formatDateForInput(initialData.dueDate))
      setDescription(initialData.description || '')
      setMaxScore(initialData.maxScore || 100)
      setAllowedFileTypes(initialData.allowedFileTypes || ['.pdf', '.doc', '.docx', '.hwp', '.ppt', '.pptx', '.xls', '.xlsx', '.zip'])
      setMaxFileSize(initialData.maxFileSize || 50)

      // contentBlocks에서 텍스트 내용 추출 (기존 데이터 호환성)
      if (initialData.contentBlocks && Array.isArray(initialData.contentBlocks) && initialData.contentBlocks.length > 0) {
        // text 또는 markdown 블록의 내용을 찾아서 content에 설정
        const textBlock = initialData.contentBlocks.find(b => b.type === 'text' || b.type === 'markdown')
        if (textBlock && textBlock.content) {
          setContent(textBlock.content)
        } else {
          setContent('')
        }
      } else {
        setContent('')
      }
    } else if (!initialData && isOpen) {
      // 초기화 모드
      setTitle('')
      setDueDate('')
      setDescription('')
      setContent('')
      setMaxScore(100)
      setAllowedFileTypes(['.pdf', '.doc', '.docx', '.hwp', '.ppt', '.pptx', '.xls', '.xlsx', '.zip'])
      setMaxFileSize(50)
    }
  }, [initialData, isOpen])

  // 폼 초기화
  const resetForm = () => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDueDate(formatDateForInput(initialData.dueDate))
      setDescription(initialData.description || '')
      setMaxScore(initialData.maxScore || 100)
      setAllowedFileTypes(initialData.allowedFileTypes || ['.pdf', '.doc', '.docx', '.hwp', '.ppt', '.pptx', '.xls', '.xlsx', '.zip'])
      setMaxFileSize(initialData.maxFileSize || 50)

      if (initialData.contentBlocks && Array.isArray(initialData.contentBlocks) && initialData.contentBlocks.length > 0) {
        const textBlock = initialData.contentBlocks.find(b => b.type === 'text' || b.type === 'markdown')
        if (textBlock && textBlock.content) {
          setContent(textBlock.content)
        } else {
          setContent('')
        }
      } else {
        setContent('')
      }
    } else {
      setTitle('')
      setDueDate('')
      setDescription('')
      setContent('')
      setMaxScore(100)
      setAllowedFileTypes(['.pdf', '.doc', '.docx', '.hwp', '.ppt', '.pptx', '.xls', '.xlsx', '.zip'])
      setMaxFileSize(50)
    }
  }

  // 모달 닫기
  const handleClose = () => {
    resetForm()
    onClose()
  }

  // 생성 핸들러
  const handleCreate = async () => {
    if (!title.trim()) {
      alert('과제 제목을 입력해주세요.')
      return
    }

    if (!dueDate) {
      alert('마감일을 선택해주세요.')
      return
    }

    try {
      // contentBlocks에 마크다운 블록으로 저장
      const contentBlocks: ContentBlock[] = content.trim() ? [{
        id: `block-${Date.now()}`,
        type: 'markdown',
        content: content.trim()
      }] : []

      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        maxScore,
        allowedFileTypes: allowedFileTypes.length > 0 ? allowedFileTypes : undefined,
        maxFileSize,
        contentBlocks: contentBlocks.length > 0 ? contentBlocks : undefined,
      })
      resetForm()
    } catch (error) {
      console.error('과제 생성 실패:', error)
    }
  }

  return (
    <ModalBase
      open={isOpen}
      onClose={handleClose}
      title={isEditMode ? "과제 수정" : "새 과제 만들기"}
      maxWidth="max-w-4xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose} disabled={isCreating}>
            취소
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (isEditMode ? '수정 중...' : '생성 중...') : (isEditMode ? '수정하기' : '생성하기')}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* 기본 정보 */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="과제 제목을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                마감일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                만점 (기본값: 100)
              </label>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                min="0"
                max="1000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              간단한 설명 (선택사항)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm h-24"
              placeholder="과제에 대한 간단한 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              과제 내용 <span className="text-gray-500 text-xs">(필수)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm h-48"
              placeholder="과제의 상세 내용을 입력하세요"
            />
            <p className="text-xs text-gray-500 mt-1">과제 내용은 텍스트로 입력됩니다.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제출 가능한 파일 형식
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {availableFileTypes.map((type) => {
                const isChecked = allowedFileTypes.includes(type.value)
                return (
                  <label
                    key={type.value}
                    className={`flex items-center space-x-2 p-2 border-2 rounded-lg cursor-pointer transition-all ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleFileType(type.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className={`text-sm font-medium ${isChecked ? 'text-blue-700' : 'text-gray-700'}`}>
                      {type.label}
                    </span>
                  </label>
                )
              })}
            </div>
            {allowedFileTypes.length === 0 && (
              <p className="text-xs text-red-600 mt-1">최소 1개 이상의 파일 형식을 선택해주세요.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 파일 크기 (MB)
            </label>
            <input
              type="number"
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              min="1"
              max="500"
            />
            <p className="text-xs text-gray-500 mt-1">기본값: 50MB</p>
          </div>
        </div>
      </div>
    </ModalBase>
  )
}
