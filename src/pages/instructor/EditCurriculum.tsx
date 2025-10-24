import React, { useState, useCallback } from 'react'
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  BookOpen,
  Play,
  Plus,
  X
} from 'lucide-react'
import type { CurriculumModule, LectureContent, ContentBlock } from '../../types'
import ContentEditor from '../../components/editor/ContentEditor'
import ContentAddModal from '../../components/editor/ContentAddModal'

const EditCurriculum: React.FC = () => {
  const [modules, setModules] = useState<CurriculumModule[]>([
    {
      id: 'module_1',
      title: '오리엔테이션',
      lectures: [
        {
          id: 'lecture_1',
          title: '오리엔테이션',
          description: '풀스택 과정 소개 및 학습 계획',
          blocks: [
            {
              id: 'block_1',
              type: 'text',
              content: '<h2>대상</h2><p>풀스택 개발자 취업을 준비하는 예비 개발자</p><h2>핵심 정보</h2><ul><li>프론트엔드, 백엔드, 클라우드, AI 기술을 포괄하는 실무 풀스택 개발자 양성</li><li>현장에 즉시 투입 가능한 전문가로 성장할 수 있도록 설계</li></ul>',
              order: 0
            }
          ],
          allowDownload: true,
          order: 0
        }
      ],
      order: 0,
      isExpanded: true
    },
    {
      id: 'module_2',
      title: '환경 설정/기본 문법/조건문/반복문',
      lectures: [],
      order: 1,
      isExpanded: false
    },
    {
      id: 'module_3',
      title: '함수/배열/객체 (코드)',
      lectures: [],
      order: 2,
      isExpanded: false
    }
  ])

  const [currentView, setCurrentView] = useState<'curriculum' | 'content'>('curriculum')
  const [editingLecture, setEditingLecture] = useState<LectureContent | null>(null)
  const [previewLecture, setPreviewLecture] = useState<LectureContent | null>(null)
  const [showContentModal, setShowContentModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const handleEditLecture = useCallback((lecture: LectureContent) => {
    setEditingLecture(lecture)
    setCurrentView('content')
  }, [])

  const handlePreviewLecture = useCallback((lecture: LectureContent) => {
    setPreviewLecture(lecture)
    setCurrentView('content')
  }, [])

  const handleUpdateLecture = useCallback((updatedLecture: LectureContent) => {
    if (!editingLecture) return

    setModules(prevModules =>
      prevModules.map(module => ({
        ...module,
        lectures: module.lectures.map(lecture =>
          lecture.id === updatedLecture.id ? updatedLecture : lecture
        )
      }))
    )
    setEditingLecture(updatedLecture)
  }, [editingLecture])

  const handleSaveLecture = useCallback(() => {
    setEditingLecture(null)
    setCurrentView('curriculum')
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingLecture(null)
    setCurrentView('curriculum')
  }, [])

  const handleClosePreview = useCallback(() => {
    setPreviewLecture(null)
    setCurrentView('curriculum')
  }, [])

  const handleAddContent = useCallback((contentType: ContentBlock['type']) => {
    if (!selectedModule) return

    // 선택된 모듈에 새 강의 추가
    const module = modules.find(m => m.id === selectedModule)
    if (!module) return

    const newLecture: LectureContent = {
      id: `lecture_${Date.now()}`,
      title: `새 ${getContentTypeLabel(contentType)}`,
      description: '',
      blocks: [{
        id: `block_${Date.now()}`,
        type: contentType,
        content: '',
        order: 0
      }],
      allowDownload: false,
      order: module.lectures.length
    }

    setModules(prevModules =>
      prevModules.map(m =>
        m.id === selectedModule
          ? { ...m, lectures: [...m.lectures, newLecture] }
          : m
      )
    )

    // 새로 추가된 강의를 편집 모드로 열기
    setEditingLecture(newLecture)
    setCurrentView('content')
  }, [selectedModule, modules])

  const getContentTypeLabel = (type: ContentBlock['type']): string => {
    const labels = {
      text: '텍스트',
      image: '이미지',
      video: '동영상',
      pdf: 'PDF',
      code: '코드',
      markdown: '마크다운'
    }
    return labels[type] || '콘텐츠'
  }

  const renderContentBlocks = (blocks: ContentBlock[]) => {
    return blocks.map((block) => {
      switch (block.type) {
        case 'text':
          return (
            <div key={block.id} className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: block.content }} />
            </div>
          )
        case 'image':
          return (
            <div key={block.id} className="my-4">
              <img
                src={block.content}
                alt="강의 이미지"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )
        case 'video':
          return (
            <div key={block.id} className="my-4">
              <video
                src={block.content}
                controls
                className="max-w-full h-auto rounded-lg shadow-md"
              >
                브라우저가 동영상을 지원하지 않습니다.
              </video>
            </div>
          )
        case 'pdf':
          return (
            <div key={block.id} className="my-4">
              <iframe
                src={block.content}
                className="w-full h-96 border rounded-lg shadow-md"
                title="PDF 문서"
              />
            </div>
          )
        case 'code':
          return (
            <div key={block.id} className="my-4">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className={`language-${block.metadata?.language || 'javascript'}`}>
                  {block.content}
                </code>
              </pre>
            </div>
          )
        case 'markdown':
          return (
            <div key={block.id} className="my-4">
              <div className="prose prose-lg max-w-none">
                <pre className="whitespace-pre-wrap">{block.content}</pre>
              </div>
            </div>
          )
        default:
          return null
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('curriculum')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                뒤로
              </button>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    (1회차) 풀스택 과정
                  </h1>
                  <p className="text-sm text-gray-500">교육과정 편집</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                미리보기
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                돌아가기
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                저장
              </button>
              <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                저장하고 편집 완료
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full">
          {currentView === 'curriculum' && (
            <div className="space-y-6">
              {/* 통합된 강의 구성 섹션 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">강의 구성</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      총 {modules.reduce((acc, module) => acc + module.lectures.length, 0)}개 강의
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        const newModule: CurriculumModule = {
                          id: `module_${Date.now()}`,
                          title: `새 모듈 ${modules.length + 1}`,
                          lectures: [],
                          order: modules.length,
                          isExpanded: false
                        }
                        setModules([...modules, newModule])
                      }}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      모듈 추가
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-5 h-5 text-blue-500" />
                          <div>
                            <h3 className="font-medium text-gray-900">{module.title}</h3>
                            <p className="text-sm text-gray-500">{module.lectures.length}개 강의</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedModule(module.id)
                              setShowContentModal(true)
                            }}
                            className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            강의 추가
                          </button>
                          <button
                            onClick={() => {
                              const newTitle = prompt('모듈 이름을 입력하세요:', module.title)
                              if (newTitle && newTitle.trim()) {
                                setModules(modules.map(m =>
                                  m.id === module.id ? { ...m, title: newTitle.trim() } : m
                                ))
                              }
                            }}
                            className="p-1 text-blue-400 hover:text-blue-600"
                            title="모듈 이름 변경"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('모듈을 삭제하시겠습니까? 포함된 모든 강의도 함께 삭제됩니다.')) {
                                setModules(modules.filter(m => m.id !== module.id))
                              }
                            }}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="모듈 삭제"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {module.lectures.length > 0 && (
                        <div className="space-y-2">
                          {module.lectures.map((lecture) => (
                            <div key={lecture.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <Play className="w-4 h-4 text-green-500" />
                                <div>
                                  <span className="text-sm font-medium text-gray-900">{lecture.title}</span>
                                  {lecture.description && (
                                    <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                      {lecture.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1">
                                  {lecture.blocks.length > 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      {lecture.blocks.length}개 블록
                                    </span>
                                  )}
                                  {lecture.allowDownload && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                      다운로드 가능
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handlePreviewLecture(lecture)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="미리보기"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditLecture(lecture)}
                                  className="p-1 text-blue-400 hover:text-blue-600"
                                  title="편집"
                                >
                                  <Settings className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'content' && editingLecture && (
            <ContentEditor
              content={editingLecture}
              onUpdate={handleUpdateLecture}
              onSave={handleSaveLecture}
              onCancel={handleCancelEdit}
            />
          )}

          {currentView === 'content' && previewLecture && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-base-content">{previewLecture.title}</h2>
                <button
                  onClick={handleClosePreview}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
              </div>

              {previewLecture.description && (
                <p className="text-gray-600 mb-6">{previewLecture.description}</p>
              )}

              <div className="space-y-6">
                {renderContentBlocks(previewLecture.blocks)}
              </div>

              {previewLecture.allowDownload && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    이 강의의 자료는 다운로드가 가능합니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠 추가 모달 */}
      <ContentAddModal
        isOpen={showContentModal}
        onClose={() => {
          setShowContentModal(false)
          setSelectedModule(null)
        }}
        onAddContent={handleAddContent}
        selectedModule={selectedModule ? modules.find(m => m.id === selectedModule)?.title : undefined}
      />
    </div>
  )
}

export default EditCurriculum
