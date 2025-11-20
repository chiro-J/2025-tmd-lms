import { useState } from 'react'
import ModalBase from '../modals/ModalBase'
import Button from '../ui/Button'
import { Download, FileText, Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react'
import type { AssignmentSubmission } from '../../types/assignment'

interface SubmissionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  submission: (AssignmentSubmission & { assignmentTitle: string }) | null
  onSaveScore: (submissionId: number, score: number, feedback: string) => void
}

export default function SubmissionDetailModal({
  isOpen,
  onClose,
  submission,
  onSaveScore
}: SubmissionDetailModalProps) {
  const [score, setScore] = useState<string>(
    submission?.score !== null && submission?.score !== undefined
      ? submission.score.toString()
      : ''
  )
  const [feedback, setFeedback] = useState<string>(submission?.feedback || '')

  if (!submission) return null

  const handleSave = () => {
    const scoreValue = parseInt(score)
    if (!isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 100) {
      onSaveScore(submission.id, scoreValue, feedback)
      onClose()
    }
  }

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-'
    const date = dateString instanceof Date ? dateString : new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = () => {
    switch (submission.status) {
      case '제출':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            정상 제출
          </span>
        )
      case '지연':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-4 w-4 mr-1" />
            지연 제출
          </span>
        )
      case '미제출':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-1" />
            미제출
          </span>
        )
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <ModalBase
      open={isOpen}
      onClose={onClose}
      title="제출물 상세"
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleSave}>
            점수 저장
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 학생 및 과제 정보 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700">학생 정보</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900">{submission.studentName}</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700">과제명</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900">{submission.assignmentTitle}</p>
          </div>
        </div>

        {/* 제출 정보 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">제출 일시</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{formatDate(submission.submittedAt)}</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">제출 상태</span>
              </div>
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* 제출 파일 */}
        {submission.files && submission.files.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">제출 파일</h3>
            <div className="space-y-2">
              {submission.files.map((file, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    다운로드
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 점수 입력 */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            점수 (0-100)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
              placeholder="점수 입력"
            />
            <span className="text-sm text-gray-500">/ 100점</span>
            {score && !isNaN(parseInt(score)) && (
              <span className={`text-sm font-medium ${
                parseInt(score) >= 90 ? 'text-green-600' :
                parseInt(score) >= 80 ? 'text-blue-600' :
                parseInt(score) >= 70 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {parseInt(score) >= 90 ? 'A' :
                 parseInt(score) >= 80 ? 'B' :
                 parseInt(score) >= 70 ? 'C' :
                 parseInt(score) >= 60 ? 'D' : 'F'}
              </span>
            )}
          </div>
        </div>

        {/* 피드백 */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            피드백
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={5}
            placeholder="학생에게 전달할 피드백을 작성하세요..."
          />
          <p className="mt-1 text-xs text-gray-500">
            피드백은 학생이 제출물을 확인할 때 함께 표시됩니다.
          </p>
        </div>
      </div>
    </ModalBase>
  )
}


