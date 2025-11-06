import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, FileText, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { getAssignment, getAssignments } from '../../core/api/assignments'
import type { Assignment } from '../../types/assignment'

type ContentBlockType = 'text' | 'markdown'

interface ContentBlock {
  id: string
  type: ContentBlockType
  content: string
}


export default function AssignmentSubmit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const assignmentId = Number(id) || 0

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [fileErrors, setFileErrors] = useState<Record<number, string>>({})

  // DB에서 과제 정보 로드
  useEffect(() => {
    const loadAssignment = async () => {
      if (!assignmentId) return

      try {
        setLoading(true)
        // 과제 ID만으로는 courseId를 알 수 없으므로, 가능한 모든 강좌에서 검색
        // 실제 운영 환경에서는 URL에 courseId를 포함하거나, 백엔드에 assignment ID만으로 조회하는 엔드포인트 추가 권장
        const courses = [1, 2, 3, 4] // 가능한 courseId 목록
        let foundAssignment: Assignment | null = null

        for (const courseId of courses) {
          try {
            const assignments = await getAssignments(courseId)
            const found = assignments.find(a => a.id === assignmentId)
            if (found) {
              // 상세 정보 조회
              foundAssignment = await getAssignment(courseId, assignmentId)
              break
            }
          } catch (e) {
            // 해당 courseId에 과제가 없거나 오류 발생 시 다음 courseId 시도
            continue
          }
        }

        if (foundAssignment) {
          setAssignment(foundAssignment)
        } else {
          console.error('과제를 찾을 수 없습니다.')
        }
      } catch (error) {
        console.error('과제 정보 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAssignment()
  }, [assignmentId])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newErrors: Record<number, string> = {}

    files.forEach((file, index) => {
      const currentIndex = selectedFiles.length + index

      // 파일 크기 검증
      if (assignment && assignment.maxFileSize) {
        const maxSizeBytes = assignment.maxFileSize * 1024 * 1024 // MB to bytes
        if (file.size > maxSizeBytes) {
          newErrors[currentIndex] = `파일 크기가 ${assignment.maxFileSize}MB를 초과합니다. (${formatFileSize(file.size)})`
        }
      }

      // 파일 형식 검증
      if (assignment && assignment.allowedFileTypes && assignment.allowedFileTypes.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        if (!assignment.allowedFileTypes.includes(fileExtension)) {
          newErrors[currentIndex] = `허용되지 않은 파일 형식입니다. (${fileExtension})`
        }
      }
    })

    setFileErrors(newErrors)
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setFileErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[index]
      // 인덱스 재조정
      const updatedErrors: Record<number, string> = {}
      Object.keys(newErrors).forEach(key => {
        const keyNum = Number(key)
        if (keyNum > index) {
          updatedErrors[keyNum - 1] = newErrors[keyNum]
        } else if (keyNum < index) {
          updatedErrors[keyNum] = newErrors[keyNum]
        }
      })
      return updatedErrors
    })
  }

  const handleSubmit = async () => {
    // 파일 검증
    if (selectedFiles.length === 0) {
      alert('제출할 파일을 선택해주세요.')
      return
    }

    // 파일 오류 확인
    if (Object.keys(fileErrors).length > 0) {
      alert('파일 오류를 수정한 후 제출해주세요.')
      return
    }

    // 제출 확인
    if (!confirm('과제를 제출하시겠습니까?\n제출 후에는 수정할 수 없을 수 있습니다.')) {
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: 실제 API 연동
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmissionSuccess(true)
      setSelectedFiles([])
      setFileErrors({})
    } catch (error) {
      console.error('과제 제출 실패:', error)
      alert('과제 제출에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isOverdue = assignment ? new Date(assignment.dueDate) < new Date() : false
  const timeLeft = assignment ? new Date(assignment.dueDate).getTime() - new Date().getTime() : 0
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

  // contentBlocks 렌더링 (텍스트만)
  const renderContentBlocks = (blocks: ContentBlock[] | undefined) => {
    if (!blocks || blocks.length === 0) return null

    // 텍스트 블록만 찾아서 렌더링
    const textBlocks = blocks.filter(b => b.type === 'text' || b.type === 'markdown')
    if (textBlocks.length === 0) return null

    return (
      <div className="space-y-2">
        {textBlocks.map((block) => (
          <div key={block.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-sm whitespace-pre-wrap text-gray-700 leading-relaxed">
              {block.content}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-page py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">과제 정보를 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-page py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-600 mb-4">과제를 찾을 수 없습니다.</p>
            <Button onClick={() => navigate(-1)} variant="outline">
              뒤로 가기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로 가기
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>마감: {new Date(assignment.dueDate).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
              {isOverdue ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>마감됨</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{daysLeft}일 남음</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Assignment Description */}
            <Card>
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">과제 설명</h2>
                {assignment.description ? (
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{assignment.description}</div>
                ) : (
                  <p className="text-sm text-gray-500 italic">과제 설명이 없습니다.</p>
                )}
              </div>
            </Card>

            {/* 과제 내용 (Content Blocks) */}
            <Card>
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">과제 내용</h2>
                {assignment.contentBlocks && Array.isArray(assignment.contentBlocks) && assignment.contentBlocks.length > 0 ? (
                  renderContentBlocks(assignment.contentBlocks as ContentBlock[])
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">과제 내용이 없습니다.</p>
                  </div>
                )}
              </div>
            </Card>

            {/* File Upload */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">파일 제출</h2>

                {/* 제출 가능한 파일 형식 안내 */}
                {(assignment?.allowedFileTypes && assignment.allowedFileTypes.length > 0) && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                    <div className="flex items-start mb-3">
                      <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900 mb-3">📎 제출 가능한 파일 형식</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {assignment.allowedFileTypes.map((fileType, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg border-2 border-blue-700 shadow-sm"
                            >
                              {fileType.replace('.', '').toUpperCase()}
                            </span>
                          ))}
                        </div>
                        {assignment.maxFileSize && (
                          <div className="text-xs text-blue-800 space-y-1.5 bg-white/50 p-2 rounded border border-blue-200">
                            <p className="font-semibold text-blue-900">📦 파일 크기 제한</p>
                            <p className="text-blue-700">
                              • 최대 파일 크기: <span className="font-bold">{assignment.maxFileSize}MB</span>
                            </p>
                            <p className="text-blue-700">
                              • 여러 파일을 제출할 경우 각 파일이 {assignment.maxFileSize}MB 이하여야 합니다
                            </p>
                            <p className="text-blue-700">
                              • 파일이 큰 경우 ZIP으로 압축하여 제출할 수 있습니다
                            </p>
                            <p className="text-blue-700">
                              • 파일 형식이 올바르지 않으면 제출이 거부될 수 있습니다
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드하세요</p>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF, Word, 한글, PowerPoint, Excel 등 다양한 형식의 파일을 제출할 수 있습니다
                  </p>
                  <input
                    type="file"
                    multiple
                    accept={(assignment?.allowedFileTypes ?? []).join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    파일 선택
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      선택된 파일 ({selectedFiles.length}개)
                    </h3>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => {
                        const hasError = fileErrors[index]
                        return (
                          <div
                            key={index}
                            className={`flex items-start justify-between p-3 rounded-lg ${
                              hasError ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start flex-1">
                              <FileText className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${hasError ? 'text-red-500' : 'text-gray-400'}`} />
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm ${hasError ? 'text-red-900 font-medium' : 'text-gray-900'}`}>
                                  {file.name}
                                </span>
                                <span className={`text-xs ml-2 ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
                                  ({formatFileSize(file.size)})
                                </span>
                                {hasError && (
                                  <p className="text-xs text-red-600 mt-1">{fileErrors[index]}</p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileRemove(index)}
                              className="text-red-600 hover:text-red-800 text-sm ml-2 flex-shrink-0"
                            >
                              제거
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    {Object.keys(fileErrors).length > 0 && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        ⚠️ 오류가 있는 파일을 수정한 후 제출해주세요.
                      </div>
                    )}
                  </div>
                )}

                {/* 제출 전 안내 */}
                {selectedFiles.length > 0 && Object.keys(fileErrors).length === 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium mb-1">⚠️ 제출 전 확인사항</p>
                    <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                      <li>제출한 파일은 수정하거나 삭제할 수 없을 수 있습니다.</li>
                      <li>파일명을 확인하여 올바른 파일을 제출했는지 확인해주세요.</li>
                      <li>마감 시간 이후 제출은 지연 처리될 수 있습니다.</li>
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    onClick={() => {
                      setSelectedFiles([])
                      setFileErrors({})
                    }}
                    variant="outline"
                    disabled={selectedFiles.length === 0 || isSubmitting}
                    className="min-w-[100px]"
                  >
                    초기화
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      selectedFiles.length === 0 ||
                      isSubmitting ||
                      isOverdue ||
                      Object.keys(fileErrors).length > 0
                    }
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? '제출 중...' : '과제 제출'}
                  </Button>
                </div>

                {/* Success Message */}
                {submissionSuccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">과제가 성공적으로 제출되었습니다!</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment Info */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">과제 정보</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">마감일</p>
                    <p className="text-sm text-gray-900">
                      {new Date(assignment.dueDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">최대 점수</p>
                    <p className="text-sm text-gray-900">{assignment.maxScore ?? 100}점</p>
                  </div>
                  {assignment.maxFileSize && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">파일 크기 제한</p>
                      <p className="text-sm text-gray-900">{assignment.maxFileSize}MB</p>
                    </div>
                  )}
                  {assignment.allowedFileTypes && assignment.allowedFileTypes.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">제출 가능한 파일 형식</p>
                      <div className="flex flex-wrap gap-2">
                        {assignment.allowedFileTypes.map((fileType, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg border-2 border-blue-700"
                          >
                            {fileType.replace('.', '').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 과제 제출 안내 */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 제출 안내</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p>파일은 여러 개를 동시에 제출할 수 있습니다.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p>파일 크기와 형식을 확인한 후 제출해주세요.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p>제출 후에는 파일을 수정하거나 삭제할 수 없습니다.</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p>마감 시간 이후 제출 시 지연 처리됩니다.</p>
                  </div>
                  {assignment && !isOverdue && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs text-blue-800 font-medium">
                        ⏰ 남은 시간: {daysLeft}일
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}











