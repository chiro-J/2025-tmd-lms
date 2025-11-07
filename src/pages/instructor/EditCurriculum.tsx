import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, FileText, Edit, Save, X, Plus } from 'lucide-react'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import Button from '../../components/ui/Button'
import { pdfjs } from 'react-pdf'
// curriculum API는 동적 import로 로드
import { transformApiToEditFormat } from '../../utils/curriculumTransform'
import type { ContentBlock, ContentBlockType, Curriculum, Lesson } from '../../types/curriculum'
import LessonContentEditor from '../../components/instructor/LessonContentEditor'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function EditCurriculum() {
  const { id } = useParams()
  const courseId = Number(id) || 1
  const [curriculums, setCurriculums] = useState<Curriculum[]>([])
  const [expandedCurriculums, setExpandedCurriculums] = useState<string[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [content, setContent] = useState<string>('')
  const [savedEditorType, setSavedEditorType] = useState<'text' | 'markdown'>('markdown')
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [pdfPages, setPdfPages] = useState<Record<string, number>>({})
  const [pdfPageNumbers, setPdfPageNumbers] = useState<Record<string, number>>({})
  const [showAddCurriculumForm, setShowAddCurriculumForm] = useState(false)
  const [newCurriculumTitle, setNewCurriculumTitle] = useState('')
  const [editingCurriculumId, setEditingCurriculumId] = useState<string | null>(null)
  const [editingCurriculumTitle, setEditingCurriculumTitle] = useState('')
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [editingLessonTitle, setEditingLessonTitle] = useState('')
  const [addingLessonToCurriculum, setAddingLessonToCurriculum] = useState<string | null>(null)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [draggedCurriculumId, setDraggedCurriculumId] = useState<string | null>(null)
  const [dragOverCurriculumId, setDragOverCurriculumId] = useState<string | null>(null)

  // 레슨 내용 불러오기
  const loadLessonContent = async (lesson: Lesson, curriculumId: string): Promise<boolean> => {
    try {
      const lessonDbId = parseInt(lesson.id.replace('lesson-', ''))
      const curriculum = curriculums.find(c => c.id === curriculumId)
      if (curriculum && !isNaN(lessonDbId)) {
        const curriculumDbId = parseInt(curriculumId.replace('curriculum-', ''))
        if (!isNaN(curriculumDbId)) {
          const { getLesson } = await import('../../core/api/curriculum')
          const lessonData = await getLesson(courseId, curriculumDbId, lessonDbId)

          if (lessonData.description) {
            try {
              const parsed = JSON.parse(lessonData.description)
              if (Array.isArray(parsed) && parsed.length > 0) {
                const restoredBlocks: ContentBlock[] = parsed
                  .filter((block: Partial<ContentBlock>) => block.type !== 'text')
                  .map((block: Partial<ContentBlock>, index: number) => ({
                    id: block.id || `block-${lesson.id}-${index}-${Date.now()}`,
                    type: (block.type as ContentBlockType) || 'markdown',
                    content: block.content || ''
                  }))
                setContentBlocks(restoredBlocks)

                const textContent = restoredBlocks
                  .filter(b => b.type === 'markdown')
                  .map(b => b.content)
                  .join('\n\n')
                setContent(textContent)
                return true
              }
            } catch {
              // JSON이 아닌 경우: 기존 텍스트 형식
            }

            // 기존 텍스트 형식인 경우: 하나의 마크다운 블록으로 변환
            const newBlock: ContentBlock = {
              id: `block-${lesson.id}-${Date.now()}`,
              type: 'markdown',
              content: lessonData.description
            }
            setContent(lessonData.description)
            setContentBlocks([newBlock])
            return true
          } else {
            setContent('')
            setContentBlocks([])
            return false
          }
        }
      }
    } catch (error) {
      console.error('레슨 내용 불러오기 실패:', error)
      setContentBlocks([])
      setContent('')
    }
    return false
  }

  const handleSave = async () => {
    if (!selectedLesson) {
    setSavedEditorType('markdown')
    setIsEditMode(false)
    return
    }

    // 선택된 레슨의 강의 내용을 DB에 저장
    try {
      const lessonDbId = parseInt(selectedLesson.id.replace('lesson-', ''))
      const curriculum = curriculums.find(c => c.lessons.some(l => l.id === selectedLesson.id))
      if (curriculum && !isNaN(lessonDbId)) {
        const curriculumDbId = parseInt(curriculum.id.replace('curriculum-', ''))
        if (!isNaN(curriculumDbId)) {
          const contentBlocksJson = JSON.stringify(contentBlocks)
          const textContent = contentBlocks
            .filter(b => b.type === 'markdown')
            .map(b => b.content)
            .join('\n\n')

          const { updateLesson } = await import('../../core/api/curriculum')
          await updateLesson(courseId, curriculumDbId, lessonDbId, {
            description: contentBlocksJson || undefined
          })

          // content는 LessonContentEditor에서 표시용으로만 사용되므로 업데이트
          setContent(textContent)
          alert('강의 내용이 저장되었습니다.')
        }
      }
    } catch (error) {
      console.error('강의 내용 저장 실패:', error)
      alert('강의 내용 저장에 실패했습니다.')
    }

    setSavedEditorType('markdown')
    setIsEditMode(false)
  }

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

  // PDF 파일 업로드 (블록용)
  const handlePdfUploadForBlock = (blockId: string, file: File) => {
    if (!file.type.includes('pdf')) {
      alert('PDF 파일만 업로드 가능합니다.')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      updateBlockContent(blockId, reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // PDF 페이지 수 로드 (블록용)
  const onDocumentLoadSuccessForBlock = (blockId: string, { numPages }: { numPages: number }) => {
    setPdfPages(prev => ({ ...prev, [blockId]: numPages }))
    setPdfPageNumbers(prev => ({ ...prev, [blockId]: 1 }))
  }

  // 이미지 파일 업로드 (블록용)
  const handleImageUploadForBlock = (blockId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      updateBlockContent(blockId, reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // YouTube 비디오 ID 추출
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // DB에서 커리큘럼 데이터 로드
  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        const { getCurriculum } = await import('../../core/api/curriculum')
        const apiModules = await getCurriculum(courseId)
        const transformed = transformApiToEditFormat(apiModules)
        setCurriculums(transformed)
      } catch (error) {
        console.error('커리큘럼 로드 실패:', error)
      }
    }
    loadCurriculum()
  }, [courseId])

  const handleAddCurriculum = async () => {
    if (newCurriculumTitle.trim()) {
      try {
        const { createCurriculum } = await import('../../core/api/curriculum')
        const result = await createCurriculum(courseId, { title: newCurriculumTitle.trim() })

        const newCurriculum: Curriculum = {
          id: `curriculum-${result.id}`,
          title: result.title,
          lessons: []
        }
        setCurriculums(prev => [...prev, newCurriculum])
        setNewCurriculumTitle('')
        setShowAddCurriculumForm(false)
        setExpandedCurriculums(prev => [...prev, newCurriculum.id])
      } catch (error) {
        console.error('커리큘럼 추가 실패:', error)
        alert(`추가에 실패했습니다: ${error}`)
      }
    }
  }

  const handleDeleteCurriculum = async (curriculumId: string) => {
    const curriculum = curriculums.find(c => c.id === curriculumId)
    if (curriculum) {
      const dbId = parseInt(curriculumId.replace('curriculum-', ''))
      if (!isNaN(dbId)) {
        if (confirm('정말 삭제하시겠습니까?')) {
          try {
            const { deleteCurriculum } = await import('../../core/api/curriculum')
            await deleteCurriculum(courseId, dbId)
            setCurriculums(prev => prev.filter(c => c.id !== curriculumId))
            setExpandedCurriculums(prev => prev.filter(id => id !== curriculumId))
            if (selectedLesson && curriculum.lessons.some(l => l.id === selectedLesson.id)) {
              setSelectedLesson(null)
            }
          } catch (error) {
            console.error('커리큘럼 삭제 실패:', error)
            alert(`삭제에 실패했습니다: ${error}`)
          }
        }
      } else {
        alert('삭제에 실패했습니다: ID 오류')
      }
    }
  }

  const handleStartEditCurriculum = (curriculumId: string, currentTitle: string) => {
    setEditingCurriculumId(curriculumId)
    setEditingCurriculumTitle(currentTitle)
  }

  const handleSaveCurriculumTitle = async (curriculumId: string) => {
    if (editingCurriculumTitle.trim()) {
      const curriculum = curriculums.find(c => c.id === curriculumId)
      if (curriculum) {
        const dbId = parseInt(curriculumId.replace('curriculum-', ''))
        if (!isNaN(dbId)) {
          try {
            const { updateCurriculum } = await import('../../core/api/curriculum')
            await updateCurriculum(courseId, dbId, { title: editingCurriculumTitle.trim() })
            setCurriculums(prev =>
              prev.map(c =>
                c.id === curriculumId ? { ...c, title: editingCurriculumTitle.trim() } : c
              )
            )
          } catch (error) {
            console.error('커리큘럼 제목 저장 실패:', error)
            alert(`저장에 실패했습니다: ${error}`)
          }
        } else {
          console.error('유효하지 않은 ID:', curriculumId)
          alert('저장에 실패했습니다: ID 오류')
        }
      }
    }
    setEditingCurriculumId(null)
    setEditingCurriculumTitle('')
  }

  const handleCancelEditCurriculum = () => {
    setEditingCurriculumId(null)
    setEditingCurriculumTitle('')
  }

  const handleStartEditLesson = (lessonId: string, currentTitle: string) => {
    setEditingLessonId(lessonId)
    setEditingLessonTitle(currentTitle)
  }

  const handleSaveLessonTitle = async (lessonId: string) => {
    if (editingLessonTitle.trim()) {
      const curriculum = curriculums.find(c => c.lessons.some(l => l.id === lessonId))
      if (curriculum) {
        const lessonDbId = parseInt(lessonId.replace('lesson-', ''))
        const curriculumDbId = parseInt(curriculum.id.replace('curriculum-', ''))
        if (!isNaN(lessonDbId) && !isNaN(curriculumDbId)) {
          try {
            const { updateLesson } = await import('../../core/api/curriculum')
            await updateLesson(courseId, curriculumDbId, lessonDbId, { title: editingLessonTitle.trim() })
            setCurriculums(prev =>
              prev.map(curriculum => ({
                ...curriculum,
                lessons: curriculum.lessons.map(lesson =>
                  lesson.id === lessonId ? { ...lesson, title: editingLessonTitle.trim() } : lesson
                )
              }))
            )
            if (selectedLesson && selectedLesson.id === lessonId) {
              setSelectedLesson(prev => prev ? { ...prev, title: editingLessonTitle.trim() } : null)
            }
          } catch (error) {
            console.error('레슨 제목 저장 실패:', error)
            alert(`저장에 실패했습니다: ${error}`)
          }
        } else {
          console.error('유효하지 않은 ID:', { lessonId, lessonDbId, curriculumId: curriculum.id, curriculumDbId })
          alert('저장에 실패했습니다: ID 오류')
        }
      }
    }
    setEditingLessonId(null)
    setEditingLessonTitle('')
  }

  const handleCancelEditLesson = () => {
    setEditingLessonId(null)
    setEditingLessonTitle('')
  }

  const handleAddLesson = async (curriculumId: string) => {
    if (newLessonTitle.trim()) {
      const curriculum = curriculums.find(c => c.id === curriculumId)
      if (curriculum) {
        const curriculumDbId = parseInt(curriculumId.replace('curriculum-', ''))
        if (!isNaN(curriculumDbId)) {
          try {
            const { createLesson } = await import('../../core/api/curriculum')
            const result = await createLesson(courseId, curriculumDbId, { title: newLessonTitle.trim() })

            const newLesson: Lesson = {
              id: `lesson-${result.id}`,
              title: result.title,
              type: 'file',
              isNew: true
            }
            setCurriculums(prev =>
              prev.map(curriculum =>
                curriculum.id === curriculumId
                  ? { ...curriculum, lessons: [...curriculum.lessons, newLesson] }
                  : curriculum
              )
            )
            setNewLessonTitle('')
            setAddingLessonToCurriculum(null)
            if (!expandedCurriculums.includes(curriculumId)) {
              setExpandedCurriculums(prev => [...prev, curriculumId])
            }
          } catch (error) {
            console.error('레슨 추가 실패:', error)
            alert(`추가에 실패했습니다: ${error}`)
          }
        } else {
          console.error('유효하지 않은 커리큘럼 ID:', curriculumId)
          alert('추가에 실패했습니다: 커리큘럼 ID 오류')
        }
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, curriculumId: string) => {
    if (!isEditMode) return
    setDraggedCurriculumId(curriculumId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', curriculumId)
  }

  const handleDragOver = (e: React.DragEvent, curriculumId: string) => {
    if (!isEditMode || !draggedCurriculumId || draggedCurriculumId === curriculumId) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCurriculumId(curriculumId)
  }

  const handleDragLeave = () => {
    setDragOverCurriculumId(null)
  }

  const handleDrop = (e: React.DragEvent, targetCurriculumId: string) => {
    e.preventDefault()
    if (!draggedCurriculumId || draggedCurriculumId === targetCurriculumId) {
      setDraggedCurriculumId(null)
      setDragOverCurriculumId(null)
      return
    }

    const draggedIndex = curriculums.findIndex(c => c.id === draggedCurriculumId)
    const targetIndex = curriculums.findIndex(c => c.id === targetCurriculumId)

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedCurriculumId(null)
      setDragOverCurriculumId(null)
      return
    }

    const newCurriculums = [...curriculums]
    const [removed] = newCurriculums.splice(draggedIndex, 1)
    newCurriculums.splice(targetIndex, 0, removed)

    setCurriculums(newCurriculums)
    setDraggedCurriculumId(null)
    setDragOverCurriculumId(null)
  }

  const handleDragEnd = () => {
    setDraggedCurriculumId(null)
    setDragOverCurriculumId(null)
  }

  const toggleCurriculum = (curriculumId: string) => {
    setExpandedCurriculums(prev =>
      prev.includes(curriculumId)
        ? prev.filter(id => id !== curriculumId)
        : [...prev, curriculumId]
    )
  }

  const renderLesson = (lesson: Lesson, curriculumId: string) => {
    const isEditing = editingLessonId === lesson.id

    const handleLessonClick = async () => {
      if (isEditing) return

      setSelectedLesson(lesson)
      await loadLessonContent(lesson, curriculumId)
    }

    return (
      <div
        key={lesson.id}
        className={`group p-3 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 ${
          lesson.isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        } ${isEditing ? 'bg-yellow-50' : ''} ${!isEditMode ? 'hover:bg-gray-100' : ''}`}
        onClick={handleLessonClick}
        onDoubleClick={async (e) => {
          if (!isEditing) {
            e.stopPropagation()
            if (!isEditMode) {
              await handleLessonClick()
              setIsEditMode(true)
              handleStartEditLesson(lesson.id, lesson.title)
            } else {
              handleStartEditLesson(lesson.id, lesson.title)
            }
          }
        }}
        title={!isEditMode && !isEditing ? '더블클릭하여 편집 모드 활성화 및 제목 수정' : isEditMode && !isEditing ? '더블클릭하여 제목 수정' : ''}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {isEditMode && !isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartEditLesson(lesson.id, lesson.title)
                }}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1 rounded flex-shrink-0"
                title="제목 수정"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {!isEditMode && !isEditing && (
              <button
                onClick={async (e) => {
                  e.stopPropagation()
                  await handleLessonClick()
                  setIsEditMode(true)
                  handleStartEditLesson(lesson.id, lesson.title)
                }}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                title="제목 편집"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {isEditing ? (
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <input
                  type="text"
                  value={editingLessonTitle}
                  onChange={(e) => setEditingLessonTitle(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveLessonTitle(lesson.id)
                    } else if (e.key === 'Escape') {
                      handleCancelEditLesson()
                    }
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveLessonTitle(lesson.id)
                  }}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  저장
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelEditLesson()
                  }}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                >
                  취소
                </button>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-900 truncate">{lesson.title}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <CoursePageLayout
      currentPageTitle="교육과정"
      rightActions={
        !isEditMode ? (
          <Button
            onClick={async () => {
              if (selectedLesson) {
                const curriculum = curriculums.find(c => c.lessons.some(l => l.id === selectedLesson.id))
                if (curriculum) {
                  await loadLessonContent(selectedLesson, curriculum.id)
                }
              }
              setIsEditMode(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>편집하기</span>
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>변경내용 저장하기</span>
          </Button>
        )
      }
    >
      <div className="flex gap-6 h-full">
        {/* 왼쪽 사이드바 - 커리큘럼 목록 */}
        <div className="w-80 bg-white rounded-xl shadow-md border-2 border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">강의 구성</h2>
            {isEditMode && (
              <button
                onClick={() => setShowAddCurriculumForm(!showAddCurriculumForm)}
                className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="목차 추가"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {showAddCurriculumForm && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCurriculumTitle}
                    onChange={(e) => setNewCurriculumTitle(e.target.value)}
                    placeholder="목차 제목을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCurriculum()
                      } else if (e.key === 'Escape') {
                        setShowAddCurriculumForm(false)
                        setNewCurriculumTitle('')
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleAddCurriculum}
                      disabled={!newCurriculumTitle.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      추가
                    </button>
                    <button
                      onClick={() => {
                        setShowAddCurriculumForm(false)
                        setNewCurriculumTitle('')
                      }}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 강의 목록 */}
            <div className="overflow-y-auto">
              {curriculums.map((curriculum) => {
                const isExpanded = expandedCurriculums.includes(curriculum.id)
                const isEditing = editingCurriculumId === curriculum.id
                const isDragged = draggedCurriculumId === curriculum.id
                const isDragOver = dragOverCurriculumId === curriculum.id

                return (
                  <div
                    key={curriculum.id}
                    draggable={isEditMode}
                    onDragStart={(e) => handleDragStart(e, curriculum.id)}
                    onDragOver={(e) => handleDragOver(e, curriculum.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, curriculum.id)}
                    onDragEnd={handleDragEnd}
                    className={`border-b border-gray-200 last:border-b-0 ${
                      isDragged ? 'opacity-50' : ''
                    } ${isDragOver ? 'border-t-2 border-t-blue-500' : ''}`}
                  >
                    <div
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => !isEditing && toggleCurriculum(curriculum.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          {isEditing ? (
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={editingCurriculumTitle}
                                onChange={(e) => setEditingCurriculumTitle(e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveCurriculumTitle(curriculum.id)
                                  } else if (e.key === 'Escape') {
                                    handleCancelEditCurriculum()
                                  }
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSaveCurriculumTitle(curriculum.id)
                                  }}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                >
                                  저장
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCancelEditCurriculum()
                                  }}
                                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900 truncate">{curriculum.title}</span>
                          )}
                        </div>
                        {isEditMode && !isEditing && (
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartEditCurriculum(curriculum.id, curriculum.title)
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="제목 수정"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteCurriculum(curriculum.id)
                              }}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="삭제"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 하위 강의 목록 */}
                    {isExpanded && (
                      <div className="bg-gray-50">
                        {curriculum.lessons.map(lesson => renderLesson(lesson, curriculum.id))}

                        {/* 강의 추가 버튼 */}
                        {isEditMode && (
                          <>
                            {addingLessonToCurriculum === curriculum.id ? (
                              <div className="p-3 bg-gray-100 border-t border-gray-200">
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                    placeholder="강의 제목을 입력하세요"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddLesson(curriculum.id)
                                      } else if (e.key === 'Escape') {
                                        setAddingLessonToCurriculum(null)
                                        setNewLessonTitle('')
                                      }
                                    }}
                                    autoFocus
                                  />
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleAddLesson(curriculum.id)}
                                      disabled={!newLessonTitle.trim()}
                                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      추가
                                    </button>
                                    <button
                                      onClick={() => {
                                        setAddingLessonToCurriculum(null)
                                        setNewLessonTitle('')
                                      }}
                                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm"
                                    >
                                      취소
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setAddingLessonToCurriculum(curriculum.id)}
                                className="w-full p-2.5 text-left hover:bg-gray-200 transition-colors border-t border-gray-200 flex items-center justify-center space-x-2 text-gray-700 font-medium bg-gray-100"
                              >
                                <Plus className="h-4 w-4" />
                                <span className="text-sm">강의 추가</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 편집 에디터 영역 */}
        <div className="flex-1 bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-auto">
          {/* 상태 메시지 */}
          {isEditMode && (
            <div className="p-4 bg-orange-50 border-b border-orange-200 sticky top-0 z-10">
              <p className="text-sm text-orange-600 flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>편집 모드 - 왼쪽 강의 구성도 추가/제거 가능합니다</span>
              </p>
            </div>
          )}

          {/* 내용 영역 */}
          <div className="p-6">
            {selectedLesson ? (
              <LessonContentEditor
                lesson={selectedLesson}
                isEditMode={isEditMode}
                savedEditorType={savedEditorType}
                contentBlocks={contentBlocks}
                content={content}
                pdfPages={pdfPages}
                pdfPageNumbers={pdfPageNumbers}
                onAddBlock={addContentBlock}
                onUpdateBlockContent={updateBlockContent}
                onRemoveBlock={removeContentBlock}
                onMoveBlock={moveBlock}
                onPdfUpload={handlePdfUploadForBlock}
                onImageUpload={handleImageUploadForBlock}
                onPdfPageChange={(blockId: string, page: number) => setPdfPageNumbers(prev => ({ ...prev, [blockId]: page }))}
                onDocumentLoadSuccess={(blockId: string, numPages: number) => onDocumentLoadSuccessForBlock(blockId, { numPages })}
                getYouTubeVideoId={getYouTubeVideoId}
              />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[600px]">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">강의를 선택하세요</h3>
                  <p className="text-sm text-gray-500">
                    왼쪽에서 편집할 강의를 선택하면 이곳에 내용이 표시됩니다
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CoursePageLayout>
  )
}
