import { useState, useEffect, useRef, useMemo } from 'react'
import { ChevronDown, ChevronRight, FileText, Edit, Save, Upload, X } from 'lucide-react'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import TinyEditor from '../../components/editor/TinyEditor'
import MarkdownEditor from '../../components/editor/MarkdownEditor'
import Button from '../../components/ui/Button'
import { Document, Page, pdfjs } from 'react-pdf'
import { marked } from 'marked'
import { getCurriculumForEdit } from '../../data/curriculum'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

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
  const [expandedCurriculums, setExpandedCurriculums] = useState<string[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageInput, setPageInput] = useState<string>('1')
  const [pdfContainerWidth, setPdfContainerWidth] = useState<number>(0)
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState<string>('')
  const [editorType, setEditorType] = useState<'text' | 'markdown'>('text')
  const [savedEditorType, setSavedEditorType] = useState<'text' | 'markdown'>('text')
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
    // TODO: DB에 저장 로직 구현 필요
    setSavedEditorType(editorType)
    setIsEditMode(false)
  }

  useEffect(() => {
    const updateWidth = () => {
      if (pdfContainerRef.current) {
        const width = pdfContainerRef.current.clientWidth - 32 // padding 제거
        setPdfContainerWidth(width)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [selectedLesson]) // selectedLesson이 변경될 때마다 다시 계산

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
      setPageNumber(1)
      setPageInput('1')
    }
  }

  const handleRemovePdf = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
    }
    setPdfUrl(null)
    setPageNumber(1)
    setPageInput('1')
  }

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1
      setPageNumber(newPage)
      setPageInput(newPage.toString())
    }
  }

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      const newPage = pageNumber + 1
      setPageNumber(newPage)
      setPageInput(newPage.toString())
    }
  }

  // curriculum.ts에서 공통 데이터 가져오기
  const initialCurriculums = useMemo(() => {
    const data = getCurriculumForEdit()
    // 일부 강의 완료 처리 (임시)
    if (data.length > 0) {
      data[0].lessons[0].completed = 1
    }
    if (data.length > 1) {
      data[1].lessons.forEach(lesson => {
        lesson.completed = 1
      })
      data[1].lessons[0].studyDate = '25. 10. 13.'
    }
    if (data.length > 2) {
      data[2].lessons.forEach(lesson => {
        lesson.completed = 1
      })
    }
    if (data.length > 3) {
      data[3].lessons[0].completed = 1
      data[3].lessons[0].studyDate = '25. 10. 13.'
    }
    return data
  }, [])

  const [curriculums, setCurriculums] = useState<Curriculum[]>(initialCurriculums)

  const handleAddCurriculum = () => {
    if (newCurriculumTitle.trim()) {
      const newCurriculum: Curriculum = {
        id: `curriculum-${Date.now()}`,
        title: newCurriculumTitle.trim(),
        lessons: []
      }
      setCurriculums(prev => [...prev, newCurriculum])
      setNewCurriculumTitle('')
      setShowAddCurriculumForm(false)
      // 새로 추가된 커리큘럼을 자동으로 펼침
      setExpandedCurriculums(prev => [...prev, newCurriculum.id])
    }
  }

  const handleDeleteCurriculum = (curriculumId: string) => {
    setCurriculums(prev => prev.filter(c => c.id !== curriculumId))
    setExpandedCurriculums(prev => prev.filter(id => id !== curriculumId))
    // 삭제된 커리큘럼의 강의가 선택되어 있었다면 선택 해제
    const deletedCurriculum = curriculums.find(c => c.id === curriculumId)
    if (deletedCurriculum && selectedLesson && deletedCurriculum.lessons.some(l => l.id === selectedLesson.id)) {
      setSelectedLesson(null)
    }
  }

  const handleStartEditCurriculum = (curriculumId: string, currentTitle: string) => {
    setEditingCurriculumId(curriculumId)
    setEditingCurriculumTitle(currentTitle)
  }

  const handleSaveCurriculumTitle = (curriculumId: string) => {
    if (editingCurriculumTitle.trim()) {
      setCurriculums(prev =>
        prev.map(c =>
          c.id === curriculumId ? { ...c, title: editingCurriculumTitle.trim() } : c
        )
      )
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

  const handleSaveLessonTitle = (lessonId: string) => {
    if (editingLessonTitle.trim()) {
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
    }
    setEditingLessonId(null)
    setEditingLessonTitle('')
  }

  const handleCancelEditLesson = () => {
    setEditingLessonId(null)
    setEditingLessonTitle('')
  }

  const handleAddLesson = (curriculumId: string) => {
    if (newLessonTitle.trim()) {
      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        title: newLessonTitle.trim(),
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
        className={`group p-3 cursor-pointer hover:bg-white transition-colors border-b border-gray-200 last:border-b-0 ${
          lesson.isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        } ${isEditing ? 'bg-yellow-50' : ''} ${!isEditMode ? 'hover:bg-blue-50' : ''}`}
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
          <div className="flex items-center space-x-3 ml-4 flex-1 min-w-0">
            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            {isEditing ? (
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <input
                  type="text"
                  value={editingLessonTitle}
                  onChange={(e) => setEditingLessonTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
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
                <span className="text-sm text-gray-700">{lesson.title}</span>
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
              <FileText className="h-4 w-4 text-blue-500" aria-hidden="true" />
            )}
            {!isEditMode && !isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditMode(true)
                  handleStartEditLesson(lesson.id, lesson.title)
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="제목 편집"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {isEditMode && !isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartEditLesson(lesson.id, lesson.title)
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                title="제목 편집"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {isEditMode && (
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
          <div className="bg-white rounded-xl shadow-md flex flex-col">
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
              <div className="mt-3">
                <button
                  onClick={() => {
                    if (expandedCurriculums.length === curriculums.length) {
                      setExpandedCurriculums([])
                    } else {
                      setExpandedCurriculums(curriculums.map(c => c.id))
                    }
                  }}
                  className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
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
                      className={`group p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        editingCurriculumId === curriculum.id ? 'bg-yellow-50' : ''
                      } ${isEditMode && editingCurriculumId !== curriculum.id ? 'cursor-move' : ''} ${!isEditMode ? 'hover:bg-blue-50' : ''}`}
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
                          <span className="text-blue-500 font-medium text-sm flex-shrink-0">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          {editingCurriculumId === curriculum.id ? (
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <input
                                type="text"
                                value={editingCurriculumTitle}
                                onChange={(e) => setEditingCurriculumTitle(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded flex-shrink-0"
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
                            <h4 className="font-medium text-gray-900 text-sm truncate">{curriculum.title}</h4>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {!isEditMode && (
                            <>
                              <span className="text-xs text-gray-600">
                                {completed}/{total}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setIsEditMode(true)
                                  handleStartEditCurriculum(curriculum.id, curriculum.title)
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                title="제목 편집"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {isEditMode && editingCurriculumId !== curriculum.id && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleStartEditCurriculum(curriculum.id, curriculum.title)
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded"
                                title="제목 편집"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm(`${curriculum.title}을(를) 삭제하시겠습니까?`)) {
                                    handleDeleteCurriculum(curriculum.id)
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                title="과정 삭제"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {editingCurriculumId !== curriculum.id && (
                            <>
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
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

                        {/* 강의 추가 폼 */}
                        {isEditMode && (
                          <>
                            {addingLessonToCurriculum === curriculum.id ? (
                              <div className="p-3 bg-blue-50 border-b border-gray-200">
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                    placeholder="강의 제목을 입력하세요"
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                className="w-full p-3 text-left hover:bg-gray-100 transition-colors border-t border-gray-200 flex items-center space-x-2 text-blue-600"
                              >
                                <span className="text-lg">+</span>
                                <span className="text-sm font-medium">강의 추가</span>
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
        <div className="flex-1 bg-white rounded-xl shadow-md overflow-auto">
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

                {/* PDF 영역 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mt-8">
                  {isEditMode && !pdfUrl && (
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-700">PDF가 없습니다</span>
                      </div>
                      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span>PDF 업로드</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handlePdfUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* PDF 제어 헤더 */}
                  {pdfUrl && (
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                      {isEditMode && (
                        <button
                          onClick={handleRemovePdf}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                          title="PDF 삭제"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}

                      <div className="flex items-center space-x-3 flex-1 justify-center">
                        <button
                          onClick={goToPrevPage}
                          disabled={pageNumber <= 1}
                          className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-30 border border-gray-300"
                        >
                          <span className="text-sm">이전</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="1"
                            max={numPages}
                            value={pageInput}
                            onChange={(e) => setPageInput(e.target.value)}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value)
                              if (!value || value < 1) {
                                setPageInput('1')
                                setPageNumber(1)
                              } else if (value > numPages) {
                                setPageInput(numPages.toString())
                                setPageNumber(numPages)
                              } else {
                                setPageInput(value.toString())
                                setPageNumber(value)
                              }
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur()
                              }
                            }}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                          />
                          <span className="text-sm text-gray-600">/ {numPages}</span>
                        </div>
                        <button
                          onClick={goToNextPage}
                          disabled={pageNumber >= numPages}
                          className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-30 border border-gray-300"
                        >
                          <span className="text-sm">다음</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PDF 표시 영역 */}
                  <div ref={pdfContainerRef} className="bg-white overflow-auto p-4" style={{ minHeight: '600px' }}>
                    {pdfUrl ? (
                      <div className="flex justify-center items-start h-full">
                        <Document
                          file={pdfUrl}
                          onLoadSuccess={({ numPages }) => {
                            setNumPages(numPages)
                            setPageNumber(1)
                            setPageInput('1')
                          }}
                          loading={
                            <div className="flex items-center justify-center h-full">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                          }
                        >
                          <Page
                            pageNumber={pageNumber}
                            width={pdfContainerWidth || 800}
                            className="shadow-lg"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </Document>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 font-medium">
                            {isEditMode ? 'PDF를 업로드하세요' : 'PDF가 없습니다'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 에디터 내용 */}
                {isEditMode ? (
                  <div className="space-y-4">
                    {/* 에디터 타입 선택 버튼 */}
                    <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                      <button
                        onClick={() => handleEditorTypeChange('text')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          editorType === 'text'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Text 편집기
                      </button>
                      <button
                        onClick={() => handleEditorTypeChange('markdown')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          editorType === 'markdown'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Markdown 편집기
                      </button>
                      <span className="text-xs text-gray-500 ml-2">입력기 변경 시 입력한 내용이 전부 사라집니다.</span>
                    </div>

                    {/* 선택된 에디터 렌더링 */}
                    {editorType === 'text' ? (
                      <TinyEditor
                        initialValue={content}
                        onChange={handleContentChange}
                        height={400}
                      />
                    ) : (
                      <MarkdownEditor
                        initialValue={content}
                        onChange={handleContentChange}
                        height={400}
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[400px]">
                    {savedEditorType === 'markdown' ? (
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: content ? marked(content) : '이 곳에 강의 내용이 표시됩니다.' }}
                      />
                    ) : (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || '이 곳에 강의 내용이 표시됩니다.' }} />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
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

