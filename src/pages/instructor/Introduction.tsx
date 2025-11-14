import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Save, X, Plus, FileText } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ContentBlockEditor from '../../components/instructor/ContentBlockEditor'
import InstructorSidebar from '../../components/instructor/InstructorSidebar'
import type { ContentBlock, ContentBlockType } from '../../types/curriculum'
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function Introduction() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const userId = typeof user?.id === 'number' ? user.id : (typeof user?.id === 'string' ? parseInt(user.id, 10) : 1)
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [pdfPages, setPdfPages] = useState<Record<string, number>>({})
  const [pdfPageNumbers, setPdfPageNumbers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadIntroduction = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // DB에서 먼저 로드 시도
        const { getInstructorIntroduction } = await import('../../core/api/admin')
        const dbIntroduction = await getInstructorIntroduction(userId)

        if (dbIntroduction) {
          try {
            const parsed = JSON.parse(dbIntroduction)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setContentBlocks(parsed)
              setLoading(false)
              return
            }
          } catch (error) {
            console.error('DB 소개글 파싱 실패:', error)
          }
        }
      } catch (error) {
        console.error('DB에서 소개글 로드 실패:', error)
        // DB 실패 시 localStorage에서 로드
      }

      // localStorage에서 소개글 블록 로드 (하위 호환성)
      const savedBio = localStorage.getItem(`instructor_bio_blocks_${userId}`)
      if (savedBio) {
        try {
          const parsed = JSON.parse(savedBio)
          if (Array.isArray(parsed)) {
            setContentBlocks(parsed)
          }
        } catch (error) {
          console.error('소개글 블록 로드 실패:', error)
          // 기존 텍스트 형식이면 마이그레이션
          const oldBio = localStorage.getItem(`instructor_bio_${userId}`)
          if (oldBio) {
            const migratedBlock: ContentBlock = {
              id: `block-${Date.now()}`,
              type: 'markdown',
              content: oldBio
            }
            setContentBlocks([migratedBlock])
          }
        }
      }

      setLoading(false)
    }

    loadIntroduction()
  }, [user, userId])

  // 블록 추가
  const addContentBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: '',
    }
    setContentBlocks(prev => [...prev, newBlock])
  }

  // 블록 삭제
  const removeContentBlock = (blockId: string) => {
    setContentBlocks(prev => prev.filter(b => b.id !== blockId))
  }

  // 블록 내용 업데이트
  const updateBlockContent = (blockId: string, content: string) => {
    setContentBlocks(prev => prev.map(b => b.id === blockId ? { ...b, content } : b))
  }

  // 블록 순서 변경
  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    setContentBlocks(prev => {
      const blocks = [...prev]
      const index = blocks.findIndex(b => b.id === blockId)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= blocks.length) return prev

      const temp = blocks[index]
      blocks[index] = blocks[newIndex]
      blocks[newIndex] = temp
      return blocks
    })
  }

  // PDF 파일 업로드
  const handlePdfUpload = async (blockId: string, file: File) => {
    if (!file.type.includes('pdf')) {
      alert('PDF 파일만 업로드 가능합니다.')
      return
    }
    try {
      const { uploadFile } = await import('../../core/api/upload')
      const result = await uploadFile(file, 'pdf')
      updateBlockContent(blockId, result.url)
    } catch (error) {
      console.error('PDF 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // PDF 페이지 수 로드
  const onDocumentLoadSuccess = (blockId: string, numPages: number) => {
    setPdfPages(prev => ({ ...prev, [blockId]: numPages }))
    setPdfPageNumbers(prev => ({ ...prev, [blockId]: 1 }))
  }

  // 이미지 파일 업로드
  const handleImageUpload = async (blockId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }
    try {
      const { uploadFile } = await import('../../core/api/upload')
      const result = await uploadFile(file, 'image')
      updateBlockContent(blockId, result.url)
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // YouTube 비디오 ID 추출
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // DB에 저장
      const { updateInstructorIntroduction } = await import('../../core/api/admin')
      const introductionJson = contentBlocks.length > 0 ? JSON.stringify(contentBlocks) : ''
      await updateInstructorIntroduction(userId, introductionJson)

      // localStorage에도 저장 (하위 호환성)
      if (contentBlocks.length > 0) {
        localStorage.setItem(`instructor_bio_blocks_${userId}`, JSON.stringify(contentBlocks))
      } else {
        localStorage.removeItem(`instructor_bio_blocks_${userId}`)
      }

      alert('소개글이 저장되었습니다.')
      navigate('/instructor/dashboard')
    } catch (error) {
      console.error('소개글 저장 실패:', error)
      alert('소개글 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/instructor/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <InstructorSidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Link
                to="/instructor/dashboard"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">강의자 대시보드로 돌아가기</span>
              </Link>

              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">소개 편집</h1>
                  <p className="text-gray-600">강의자 소개글을 작성하고 편집하세요</p>
                </div>
              </div>
            </div>

            {/* Introduction Form */}
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-900">
                    소개글
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => addContentBlock('lexical')}
                      className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Text 편집기</span>
                    </button>
                    <button
                      onClick={() => addContentBlock('markdown')}
                      className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Markdown 편집기</span>
                    </button>
                    <button
                      onClick={() => addContentBlock('pdf')}
                      className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>PDF 추가</span>
                    </button>
                    <button
                      onClick={() => addContentBlock('video')}
                      className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>동영상 추가</span>
                    </button>
                    <button
                      onClick={() => addContentBlock('image')}
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
                    <p className="text-sm text-gray-600 font-medium mb-2">버튼을 눌러 소개글을 추가하세요</p>
                    <p className="text-xs text-gray-500">상단의 버튼을 클릭하여 Text, Markdown, PDF, 동영상, 이미지를 추가할 수 있습니다</p>
                  </div>
                )}

                {/* 블록 목록 */}
                {contentBlocks.length > 0 && (
                  <div className="space-y-4">
                    {contentBlocks.map((block, index) => (
                      <ContentBlockEditor
                        key={block.id}
                        block={block}
                        index={index}
                        totalBlocks={contentBlocks.length}
                        pdfPages={pdfPages}
                        pdfPageNumbers={pdfPageNumbers}
                        onUpdateContent={updateBlockContent}
                        onRemove={removeContentBlock}
                        onMove={moveBlock}
                        onPdfUpload={handlePdfUpload}
                        onImageUpload={handleImageUpload}
                        onPdfPageChange={(blockId: string, page: number) => setPdfPageNumbers(prev => ({ ...prev, [blockId]: page }))}
                        onDocumentLoadSuccess={onDocumentLoadSuccess}
                        getYouTubeVideoId={getYouTubeVideoId}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-xl"
                >
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? '저장 중...' : '저장'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

