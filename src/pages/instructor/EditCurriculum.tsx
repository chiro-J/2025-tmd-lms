import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, FileText, Edit, Save, Upload, X, Plus, GripVertical, Trash2, MoveUp, MoveDown, Image, Video } from 'lucide-react'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import TinyEditor from '../../components/editor/TinyEditor'
import MarkdownEditor from '../../components/editor/MarkdownEditor'
import Button from '../../components/ui/Button'
import { Document, Page, pdfjs } from 'react-pdf'
import { marked } from 'marked'
import { getCurriculum, createCurriculum, updateCurriculum, deleteCurriculum, createLesson, updateLesson, deleteLesson } from '../../core/api/curriculum'
import { transformApiToEditFormat } from '../../utils/curriculumTransform'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type ContentBlockType = 'text' | 'markdown' | 'pdf' | 'video' | 'image'

interface ContentBlock {
  id: string
  type: ContentBlockType
  content: string
}

interface Lesson {
  id: string
  title: string
  type: 'folder' | 'file'
  completed?: number
  total?: number
  children?: Lesson[]
  isNew?: boolean
  isSelected?: boolean
  studyDate?: string
}

interface Curriculum {
  id: string
  title: string
  lessons: Lesson[]
}

export default function EditCurriculum() {
  const { id } = useParams()
  const courseId = Number(id) || 1
  const [curriculums, setCurriculums] = useState<Curriculum[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCurriculums, setExpandedCurriculums] = useState<string[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [content, setContent] = useState<string>('')
  const [editorType, setEditorType] = useState<'text' | 'markdown'>('text')
  const [savedEditorType, setSavedEditorType] = useState<'text' | 'markdown'>('text')
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

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleEditorTypeChange = (type: 'text' | 'markdown') => {
    setEditorType(type)
    setContent('') // 에디터 변경 시 내용 초기화
  }

  const handleSave = () => {
    setSavedEditorType(editorType)
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

      [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]]
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

  // PDF 페이지 수 로드 (블록용)
  const onDocumentLoadSuccessForBlock = (blockId: string, { numPages }: { numPages: number }) => {
    setPdfPages(prev => ({ ...prev, [blockId]: numPages }))
    setPdfPageNumbers(prev => ({ ...prev, [blockId]: 1 }))
  }

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }


  // DB에서 커리큘럼 데이터 로드
  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        setLoading(true)
        // 커리큘럼 데이터 로드
        const apiModules = await getCurriculum(courseId)
        const transformed = transformApiToEditFormat(apiModules)
        setCurriculums(transformed)
      } catch (error) {
        console.error('커리큘럼 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCurriculum()
  }, [courseId])

  const handleAddCurriculum = async () => {
    if (newCurriculumTitle.trim()) {
      try {
        const result = await createCurriculum(courseId, { title: newCurriculumTitle.trim() })

        const newCurriculum: Curriculum = {
          id: `curriculum-${result.id}`, // DB에서 생성된 실제 ID 사용
          title: result.title,
          lessons: []
        }
        setCurriculums(prev => [...prev, newCurriculum])
        setNewCurriculumTitle('')
        setShowAddCurriculumForm(false)
        // 새로 추가된 커리큘럼을 자동으로 펼침
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
            await deleteCurriculum(courseId, dbId)
            setCurriculums(prev => prev.filter(c => c.id !== curriculumId))
            setExpandedCurriculums(prev => prev.filter(id => id !== curriculumId))
            // 삭제된 커리큘럼의 강의가 선택되어 있었다면 선택 해제
            if (selectedLesson && curriculum.lessons.some(l => l.id === selectedLesson.id)) {
              setSelectedLesson(null)
            }
            // 삭제 성공 (자동으로 상태 업데이트됨)
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
        // DB에 실제 숫자 ID 추출 (curriculum-1 -> 1)
        const dbId = parseInt(curriculumId.replace('curriculum-', ''))
        if (!isNaN(dbId)) {
          try {
            await updateCurriculum(courseId, dbId, { title: editingCurriculumTitle.trim() })
            setCurriculums(prev =>
              prev.map(c =>
                c.id === curriculumId ? { ...c, title: editingCurriculumTitle.trim() } : c
              )
            )
            // 저장 성공 (자동으로 상태 업데이트됨)
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
      // 레슨이 속한 커리큘럼 찾기
      const curriculum = curriculums.find(c => c.lessons.some(l => l.id === lessonId))
      if (curriculum) {
        // DB에 실제 숫자 ID 추출 (lesson-1 -> 1, curriculum-1 -> 1)
        const lessonDbId = parseInt(lessonId.replace('lesson-', ''))
        const curriculumDbId = parseInt(curriculum.id.replace('curriculum-', ''))
        if (!isNaN(lessonDbId) && !isNaN(curriculumDbId)) {
          try {
            await updateLesson(courseId, curriculumDbId, lessonDbId, { title: editingLessonTitle.trim() })
            setCurriculums(prev =>
              prev.map(curriculum => ({
                ...curriculum,
                lessons: curriculum.lessons.map(lesson =>
                  lesson.id === lessonId ? { ...lesson, title: editingLessonTitle.trim() } : lesson
                )
              }))
            )
            // 선택된 강의의 제목도 업데이트
            if (selectedLesson && selectedLesson.id === lessonId) {
              setSelectedLesson(prev => prev ? { ...prev, title: editingLessonTitle.trim() } : null)
            }
            // 저장 성공 (자동으로 상태 업데이트됨)
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
            const result = await createLesson(courseId, curriculumDbId, { title: newLessonTitle.trim() })

            const newLesson: Lesson = {
              id: `lesson-${result.id}`, // DB에서 생성된 실제 ID 사용
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
            // 커리큘럼을 펼침 (강의가 추가되었으므로)
            if (!expandedCurriculums.includes(curriculumId)) {
              setExpandedCurriculums(prev => [...prev, curriculumId])
            }
            // 추가 성공 (자동으로 상태 업데이트됨)
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

    return (
    <div
      key={lesson.id}
        className={`group p-3 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 ${
        lesson.isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        } ${isEditing ? 'bg-yellow-50' : ''} ${!isEditMode ? 'hover:bg-gray-100' : ''}`}
        onClick={() => !isEditing && setSelectedLesson(lesson)}
        onDoubleClick={(e) => {
          if (!isEditing) {
            e.stopPropagation()
            if (!isEditMode) {
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
            {/* 편집 버튼을 좌측으로 이동 */}
            {isEditMode && !isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartEditLesson(lesson.id, lesson.title)
                }}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1 rounded flex-shrink-0"
                title="제목 편집"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {!isEditMode && !isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
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
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1 border border-blue-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveLessonTitle(lesson.id)
                    } else if (e.key === 'Escape') {
                      handleCancelEditLesson()
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveLessonTitle(lesson.id)
                  }}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1 rounded"
                  title="저장"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelEditLesson()
                  }}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 p-1 rounded"
                  title="취소"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
          <span className="text-sm font-medium text-gray-900">{lesson.title}</span>
          {lesson.isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">NEW</span>
                )}
              </>
          )}
        </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
          {lesson.studyDate && !isEditMode && (
            <span className="text-xs text-gray-500">수강일: {lesson.studyDate}</span>
          )}
          {lesson.completed && lesson.total && lesson.completed === lesson.total && !isEditMode && (
            <FileText className="h-4 w-4 text-green-600" aria-hidden="true" />
          )}
          {isEditMode && !isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                  if (confirm(`${lesson.title}을(를) 삭제하시겠습니까?`)) {
                    setCurriculums(prev =>
                      prev.map(curriculum =>
                        curriculum.id === curriculumId
                          ? { ...curriculum, lessons: curriculum.lessons.filter(l => l.id !== lesson.id) }
                          : curriculum
                      )
                    )
                    if (selectedLesson && selectedLesson.id === lesson.id) {
                      setSelectedLesson(null)
                    }
                  }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
              title="삭제"
            >
              <X className="h-4 w-4" />
            </button>
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
            onClick={() => setIsEditMode(true)}
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
      <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 300px)' }}>
        {/* 강의 구성 사이드바 */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 flex flex-col">
            {/* 헤더 */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">강의 구성</h3>
                {isEditMode && !showAddCurriculumForm && (
                  <button
                    onClick={() => setShowAddCurriculumForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center space-x-1"
                    title="새 강의 구성 추가"
                  >
                    <span>+</span>
                    <span>추가</span>
                  </button>
                )}
              </div>
              {isEditMode && (
                <>
                <p className="text-xs text-orange-600 mt-2">편집 모드: 강의 추가/삭제/이동 가능</p>
                  <p className="text-xs text-blue-600 mt-1">💡 커리큘럼 카드를 드래그하여 순서를 변경할 수 있습니다</p>
                  <p className="text-xs text-green-600 mt-1">✏️ 강의구성 제목을 더블클릭하거나 편집 버튼을 클릭하여 수정할 수 있습니다</p>
                </>
              )}
              {!isEditMode && (
                <p className="text-xs text-gray-600 mt-2">
                  💡 강의구성 제목을 더블클릭하거나 마우스를 올리면 편집 버튼이 나타납니다
                </p>
              )}

              {/* 강의 구성 추가 폼 */}
              {showAddCurriculumForm && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newCurriculumTitle}
                      onChange={(e) => setNewCurriculumTitle(e.target.value)}
                      placeholder="강의 구성 제목을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => {
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
              {/* 전체 열기/닫기 버튼 */}
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => {
                    if (expandedCurriculums.length === curriculums.length) {
                      setExpandedCurriculums([])
                    } else {
                      setExpandedCurriculums(curriculums.map(c => c.id))
                    }
                  }}
                  className="text-sm font-bold text-gray-700 hover:text-gray-900 px-4 py-2 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all shadow-sm"
                >
                  {expandedCurriculums.length === curriculums.length ? '전체목록 닫기' : '전체목록 열기'}
                </button>
              </div>
            </div>

            {/* 강의 목록 */}
            <div className="overflow-y-auto">
              {curriculums.map((curriculum, index) => {
                const isExpanded = expandedCurriculums.includes(curriculum.id)
                const completed = curriculum.lessons.filter(l => l.completed).length
                const total = curriculum.lessons.length

                return (
                  <div
                    key={curriculum.id}
                    className={`border-b border-gray-200 last:border-b-0 ${
                      draggedCurriculumId === curriculum.id ? 'opacity-50' : ''
                    } ${dragOverCurriculumId === curriculum.id ? 'border-t-2 border-t-blue-500' : ''}`}
                    draggable={isEditMode && editingCurriculumId !== curriculum.id}
                    onDragStart={(e) => handleDragStart(e, curriculum.id)}
                    onDragOver={(e) => handleDragOver(e, curriculum.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, curriculum.id)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* 과정 제목 */}
                    <div
                      className={`group p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200 ${
                        editingCurriculumId === curriculum.id ? 'bg-yellow-50' : ''
                      } ${isEditMode && editingCurriculumId !== curriculum.id ? 'cursor-move' : ''} ${!isEditMode ? 'hover:bg-gray-50' : ''}`}
                      onClick={() => editingCurriculumId !== curriculum.id && toggleCurriculum(curriculum.id)}
                      onDoubleClick={(e) => {
                        if (!isEditMode) {
                          e.stopPropagation()
                          setIsEditMode(true)
                          handleStartEditCurriculum(curriculum.id, curriculum.title)
                        } else if (editingCurriculumId !== curriculum.id) {
                          e.stopPropagation()
                          handleStartEditCurriculum(curriculum.id, curriculum.title)
                        }
                      }}
                      title={!isEditMode ? '더블클릭하여 편집 모드 활성화 및 제목 수정' : isEditMode && editingCurriculumId !== curriculum.id ? '더블클릭하여 제목 수정' : ''}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex items-center space-x-2 min-w-0">
                          <span className="text-gray-600 font-semibold text-sm flex-shrink-0">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          {/* 편집 버튼을 좌측으로 이동 */}
                          {isEditMode && editingCurriculumId !== curriculum.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartEditCurriculum(curriculum.id, curriculum.title)
                              }}
                              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1 rounded flex-shrink-0"
                              title="제목 편집"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {!isEditMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setIsEditMode(true)
                                handleStartEditCurriculum(curriculum.id, curriculum.title)
                              }}
                              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              title="제목 편집"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {editingCurriculumId === curriculum.id ? (
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <input
                                type="text"
                                value={editingCurriculumTitle}
                                onChange={(e) => setEditingCurriculumTitle(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 px-2 py-1 border border-blue-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveCurriculumTitle(curriculum.id)
                                  } else if (e.key === 'Escape') {
                                    handleCancelEditCurriculum()
                                  }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSaveCurriculumTitle(curriculum.id)
                                }}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1 rounded flex-shrink-0"
                                title="저장"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCancelEditCurriculum()
                                }}
                                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 p-1 rounded flex-shrink-0"
                                title="취소"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <h4 className="font-semibold text-gray-900 text-base truncate">{curriculum.title}</h4>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {editingCurriculumId !== curriculum.id && (
                            <>
                              {!isEditMode && (
                                <span className="text-xs text-gray-600 font-medium">
                                  {completed}/{total}
                                </span>
                              )}
                              {isEditMode && editingCurriculumId !== curriculum.id && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteCurriculum(curriculum.id)
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                  title="과정 삭제"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" aria-hidden="true" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 하위 강의 목록 */}
                    {isExpanded && (
                      <div className="bg-gray-50">
                        {curriculum.lessons.map(lesson => renderLesson(lesson, curriculum.id))}

                        {/* 강의 추가 버튼 - 목차 칸 내부로 이동 */}
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
                                    onKeyPress={(e) => {
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
              <div className="space-y-6">
                {/* 강의 제목 */}
                <div className="mb-8 pb-6 border-b-2 border-gray-300">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedLesson.title}</h2>
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
                            onClick={() => addContentBlock('text')}
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
                          <p className="text-sm text-gray-600 font-medium mb-2">버튼을 눌러 강의를 추가하세요</p>
                          <p className="text-xs text-gray-500">상단의 버튼을 클릭하여 Text 편집기, Markdown, PDF, 동영상, 이미지를 추가할 수 있습니다</p>
                        </div>
                      )}

                      {/* 블록 목록 */}
                      {contentBlocks.length > 0 && (
                        <div className="space-y-4">
                          {contentBlocks.map((block, index) => (
                            <div key={block.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              {/* 블록 헤더 */}
                              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
                                <div className="flex items-center space-x-2">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {block.type === 'text' && 'Text 편집기'}
                                    {block.type === 'markdown' && 'Markdown 편집기'}
                                    {block.type === 'pdf' && 'PDF'}
                                    {block.type === 'video' && '동영상'}
                                    {block.type === 'image' && '이미지'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => moveBlock(block.id, 'up')}
                                    disabled={index === 0}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="위로 이동"
                                  >
                                    <MoveUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => moveBlock(block.id, 'down')}
                                    disabled={index === contentBlocks.length - 1}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="아래로 이동"
                                  >
                                    <MoveDown className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => removeContentBlock(block.id)}
                                    className="p-1.5 text-red-400 hover:text-red-600"
                                    title="삭제"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* 블록 내용 */}
                              <div className="p-4">
                                {block.type === 'text' && (
                                  <TinyEditor
                                    initialValue={block.content}
                                    onChange={(html) => updateBlockContent(block.id, html)}
                                    height={400}
                                  />
                                )}
                                {block.type === 'markdown' && (
                                  <MarkdownEditor
                                    initialValue={block.content}
                                    onChange={(md) => updateBlockContent(block.id, md)}
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
                                            onClick={() => updateBlockContent(block.id, '')}
                                            className="text-sm text-red-500 hover:text-red-700"
                                          >
                                            제거
                                          </button>
                                        </div>
                                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                          <Document
                                            file={block.content}
                                            onLoadSuccess={(pdf) => onDocumentLoadSuccessForBlock(block.id, pdf)}
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
                                              onClick={() => setPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.max(1, (prev[block.id] || 1) - 1) }))}
                                              disabled={pdfPageNumbers[block.id] === 1}
                                              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-30"
                                            >
                                              이전
                                            </button>
                                            <span className="text-sm text-gray-600">
                                              {pdfPageNumbers[block.id] || 1} / {pdfPages[block.id]}
                                            </span>
                                            <button
                                              onClick={() => setPdfPageNumbers(prev => ({ ...prev, [block.id]: Math.min(pdfPages[block.id], (prev[block.id] || 1) + 1) }))}
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
                                          onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handlePdfUploadForBlock(block.id, file)
                                          }}
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
                                          value={block.content}
                                          onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                          placeholder="https://youtube.com/watch?v=..."
                                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                        <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm flex items-center">
                                          <Upload className="h-4 w-4 mr-1" />
                                          파일
                                          <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0]
                                              if (file) {
                                                const reader = new FileReader()
                                                reader.onloadend = () => {
                                                  updateBlockContent(block.id, reader.result as string)
                                                }
                                                reader.readAsDataURL(file)
                                              }
                                            }}
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
                                            onClick={() => updateBlockContent(block.id, '')}
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
                                          onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleImageUploadForBlock(block.id, file)
                                          }}
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
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                      {contentBlocks.length === 0 ? (
                        <div className="text-center">
                          {savedEditorType === 'markdown' ? (
                            <div
                              className="prose max-w-none"
                              dangerouslySetInnerHTML={{ __html: content ? marked(content) : '<p class="text-gray-500">이 곳에 강의 내용이 표시됩니다.</p>' }}
                            />
                          ) : (
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-500">이 곳에 강의 내용이 표시됩니다.</p>' }} />
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {contentBlocks.map((block) => (
                            <div key={block.id} className="bg-white p-4 rounded border border-gray-200">
                              {block.type === 'text' && (
                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.content || '내용 없음' }} />
                              )}
                              {block.type === 'markdown' && (
                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: block.content ? marked(block.content) : '내용 없음' }} />
                              )}
                              {block.type === 'pdf' && block.content && (
                                <div className="text-sm text-gray-500">PDF 파일 업로드됨</div>
                              )}
                              {block.type === 'video' && block.content && (
                                <div className="text-sm text-gray-500">동영상 콘텐츠</div>
                              )}
                              {block.type === 'image' && block.content && (
                                <img src={block.content} alt="Preview" className="max-w-full h-40 object-cover rounded" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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

