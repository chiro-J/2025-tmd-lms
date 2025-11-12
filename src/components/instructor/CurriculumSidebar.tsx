import { ChevronDown, ChevronRight, FileText, Edit, X, Plus } from 'lucide-react'
import type { Curriculum, Lesson } from '../../types/curriculum'

interface CurriculumSidebarProps {
  curriculums: Curriculum[]
  expandedCurriculums: string[]
  selectedLesson: Lesson | null
  isEditMode: boolean
  editingCurriculumId: string | null
  editingCurriculumTitle: string
  editingLessonId: string | null
  editingLessonTitle: string
  addingLessonToCurriculum: string | null
  newLessonTitle: string
  draggedCurriculumId: string | null
  dragOverCurriculumId: string | null
  onToggleCurriculum: (curriculumId: string) => void
  onLessonClick: (lesson: Lesson, curriculumId: string) => Promise<void>
  onStartEditCurriculum: (curriculumId: string, currentTitle: string) => void
  onSaveCurriculumTitle: (curriculumId: string) => Promise<void>
  onCancelEditCurriculum: () => void
  onDeleteCurriculum: (curriculumId: string) => Promise<void>
  onStartEditLesson: (lessonId: string, currentTitle: string) => void
  onSaveLessonTitle: (lessonId: string) => Promise<void>
  onCancelEditLesson: () => void
  onAddLesson: (curriculumId: string) => Promise<void>
  onSetAddingLessonToCurriculum: (curriculumId: string | null) => void
  onSetNewLessonTitle: (title: string) => void
  onDragStart: (e: React.DragEvent, curriculumId: string) => void
  onDragOver: (e: React.DragEvent, curriculumId: string) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, targetCurriculumId: string) => void
  onDragEnd: () => void
  onSetSelectedLesson: (lesson: Lesson | null) => void
  onSetIsEditMode: (isEditMode: boolean) => void
  courseId: number
}

export default function CurriculumSidebar({
  curriculums,
  expandedCurriculums,
  isEditMode,
  editingCurriculumId,
  editingCurriculumTitle,
  editingLessonId,
  editingLessonTitle,
  addingLessonToCurriculum,
  newLessonTitle,
  draggedCurriculumId,
  dragOverCurriculumId,
  onToggleCurriculum,
  onLessonClick,
  onStartEditCurriculum,
  onSaveCurriculumTitle,
  onCancelEditCurriculum,
  onDeleteCurriculum,
  onStartEditLesson,
  onSaveLessonTitle,
  onCancelEditLesson,
  onAddLesson,
  onSetAddingLessonToCurriculum,
  onSetNewLessonTitle,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onSetIsEditMode,
}: CurriculumSidebarProps) {
  const renderLesson = (lesson: Lesson, curriculumId: string) => {
    const isEditing = editingLessonId === lesson.id

    const handleLessonClick = async () => {
      if (isEditing) return
      await onLessonClick(lesson, curriculumId)
    }

    return (
      <div
        key={lesson.id}
        className={`group p-3 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-b-0 ${
          lesson.isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        } ${isEditing ? 'bg-yellow-50' : ''} ${!isEditMode ? 'hover:bg-gray-100' : ''}`}
        onClick={handleLessonClick}
        onDoubleClick={(e) => {
          if (!isEditing) {
            e.stopPropagation()
            if (!isEditMode) {
              onSetIsEditMode(true)
              onStartEditLesson(lesson.id, lesson.title)
            } else {
              onStartEditLesson(lesson.id, lesson.title)
            }
          }
        }}
        title={!isEditMode && !isEditing ? '더블클릭하여 편집 모드 활성화 및 제목 수정' : isEditMode && !isEditing ? '더블클릭하여 제목 수정' : ''}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editingLessonTitle}
                  onChange={(e) => {
                    const title = e.target.value
                    // parent에서 setEditingLessonTitle을 받아야 함
                    onSetNewLessonTitle(title)
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onSaveLessonTitle(lesson.id)
                    } else if (e.key === 'Escape') {
                      onCancelEditLesson()
                    }
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSaveLessonTitle(lesson.id)
                    }}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    저장
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onCancelEditLesson()
                    }}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-900 truncate">{lesson.title}</span>
            )}
          </div>
          {isEditMode && !isEditing && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onStartEditLesson(lesson.id, lesson.title)
                }}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="제목 수정"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white rounded-xl shadow-md border-2 border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">강의 구성</h2>
        {isEditMode && (
          <button
            onClick={() => {
              // parent에서 setShowAddCurriculumForm을 받아야 함
            }}
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="목차 추가"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
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
                onDragStart={(e) => onDragStart(e, curriculum.id)}
                onDragOver={(e) => onDragOver(e, curriculum.id)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, curriculum.id)}
                onDragEnd={onDragEnd}
                className={`border-b border-gray-200 last:border-b-0 ${
                  isDragged ? 'opacity-50' : ''
                } ${isDragOver ? 'border-t-2 border-t-blue-500' : ''}`}
              >
                <div
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => !isEditing && onToggleCurriculum(curriculum.id)}
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
                            onChange={(e) => {
                              // parent에서 setEditingCurriculumTitle을 받아야 함
                              onSetNewLessonTitle(e.target.value)
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                onSaveCurriculumTitle(curriculum.id)
                              } else if (e.key === 'Escape') {
                                onCancelEditCurriculum()
                              }
                            }}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onSaveCurriculumTitle(curriculum.id)
                              }}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              저장
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onCancelEditCurriculum()
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
                            onStartEditCurriculum(curriculum.id, curriculum.title)
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="제목 수정"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteCurriculum(curriculum.id)
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

                {isExpanded && (
                  <div className="bg-gray-50">
                    {curriculum.lessons.map(lesson => renderLesson(lesson, curriculum.id))}

                    {isEditMode && (
                      <>
                        {addingLessonToCurriculum === curriculum.id ? (
                          <div className="p-3 bg-gray-100 border-t border-gray-200">
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={newLessonTitle}
                                onChange={(e) => onSetNewLessonTitle(e.target.value)}
                                placeholder="강의 제목을 입력하세요"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    onAddLesson(curriculum.id)
                                  } else if (e.key === 'Escape') {
                                    onSetAddingLessonToCurriculum(null)
                                    onSetNewLessonTitle('')
                                  }
                                }}
                                autoFocus
                              />
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => onAddLesson(curriculum.id)}
                                  disabled={!newLessonTitle.trim()}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  추가
                                </button>
                                <button
                                  onClick={() => {
                                    onSetAddingLessonToCurriculum(null)
                                    onSetNewLessonTitle('')
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
                            onClick={() => onSetAddingLessonToCurriculum(curriculum.id)}
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
  )
}




