import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Upload, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  maxScore: number
  instructions: string[]
  allowedFileTypes: string[]
  maxFileSize: number // in MB
}

interface Submission {
  id: string
  submittedAt: string
  files: { name: string; size: number; url: string }[]
  status: 'submitted' | 'graded'
  score?: number
  feedback?: string
}

export default function AssignmentSubmit() {
  const { id } = useParams()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  // Mock assignment data
  const assignment: Assignment = {
    id: id || '1',
    title: 'React 컴포넌트 개발 과제',
    description: 'React를 사용하여 재사용 가능한 컴포넌트를 개발하고, 이를 활용한 간단한 애플리케이션을 구현하세요.',
    dueDate: '2024-11-25T23:59:00',
    maxScore: 100,
    instructions: [
      '최소 3개의 재사용 가능한 컴포넌트를 만들어야 합니다.',
      '각 컴포넌트는 props를 통해 다양한 설정을 받을 수 있어야 합니다.',
      'TypeScript를 사용하여 타입 안전성을 보장해야 합니다.',
      '코드에 주석을 적절히 작성해야 합니다.',
      'README.md 파일에 프로젝트 설명과 실행 방법을 작성해야 합니다.'
    ],
    allowedFileTypes: ['.zip', '.rar', '.7z'],
    maxFileSize: 50
  }

  // Mock submission history
  const submissionHistory: Submission[] = [
    {
      id: '1',
      submittedAt: '2024-11-20T14:30:00',
      files: [
        { name: 'assignment_v1.zip', size: 2048000, url: '/submissions/assignment_v1.zip' }
      ],
      status: 'graded',
      score: 85,
      feedback: '잘 작성되었습니다. 컴포넌트 구조를 더 개선해보세요.'
    }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setSubmissionSuccess(true)
    setSelectedFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isOverdue = new Date(assignment.dueDate) < new Date()
  const timeLeft = new Date(assignment.dueDate).getTime() - new Date().getTime()
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Description */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">과제 설명</h2>
                <p className="text-gray-700 mb-4">{assignment.description}</p>
                
                <h3 className="text-md font-medium text-gray-900 mb-3">요구사항</h3>
                <ul className="space-y-2">
                  {assignment.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* File Upload */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">파일 제출</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드하세요</p>
                  <p className="text-sm text-gray-500 mb-4">
                    허용 형식: {assignment.allowedFileTypes.join(', ')} (최대 {assignment.maxFileSize}MB)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept={assignment.allowedFileTypes.join(',')}
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
                    <h3 className="text-sm font-medium text-gray-900 mb-2">선택된 파일</h3>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>
                          <button
                            onClick={() => handleFileRemove(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            제거
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedFiles.length === 0 || isSubmitting || isOverdue}
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
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">최대 점수</p>
                    <p className="text-sm text-gray-900">{assignment.maxScore}점</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">파일 크기 제한</p>
                    <p className="text-sm text-gray-900">{assignment.maxFileSize}MB</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Submission History */}
            {submissionHistory.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">제출 이력</h3>
                  <div className="space-y-3">
                    {submissionHistory.map(submission => (
                      <div key={submission.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(submission.submittedAt).toLocaleDateString('ko-KR')}
                          </span>
                          {submission.status === 'graded' && submission.score && (
                            <span className="text-sm font-bold text-blue-600">
                              {submission.score}점
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {submission.files.length}개 파일
                        </div>
                        {submission.feedback && (
                          <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            {submission.feedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}












