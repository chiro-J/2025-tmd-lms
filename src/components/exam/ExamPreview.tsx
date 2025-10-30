import { Eye, Calendar, Clock } from 'lucide-react'
import type { ExamFormData } from '../../types/exam'
import { getQuestionTypeLabel } from '../../utils/questionUtils'

interface AvailableQuestion {
  id: string
  type: string
  question: string
  points: number
  status: string
}

interface ExamPreviewProps {
  formData: ExamFormData
  availableQuestions?: AvailableQuestion[]
}

export default function ExamPreview({ formData, availableQuestions = [] }: ExamPreviewProps) {
  const selectedQuestionsData = availableQuestions.filter(q =>
    formData.selectedQuestions.includes(q.id)
  )
  const totalPoints = selectedQuestionsData.reduce((sum, q) => sum + q.points, 0)
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      {/* Exam/Assignment Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            formData.type === 'exam'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {formData.type === 'exam' ? '시험' : '과제'}
          </span>
          {formData.hasTimeLimit && formData.timeLimit && (
            <span className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {formData.timeLimit}분
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.title || '제목을 입력하세요'}
        </h3>
      </div>

      {/* Date Information */}
      {(formData.startDate || formData.endDate) && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">일정</h4>
          <div className="space-y-2">
            {formData.startDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600 mr-2">시작:</span>
                <span className="text-gray-900">
                  {new Date(formData.startDate).toLocaleString('ko-KR')}
                </span>
              </div>
            )}
            {formData.endDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600 mr-2">종료:</span>
                <span className="text-gray-900">
                  {new Date(formData.endDate).toLocaleString('ko-KR')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Summary */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">설정</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">시험 응시 시간 제한</span>
            <span className="text-gray-900 font-medium">
              {formData.hasTimeLimit ? `${formData.timeLimit || 0}분` : '사용 안함'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">그룹 설정</span>
            <span className="text-gray-900 font-medium">
              {formData.useGroups ? '사용' : '사용 안함'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">문제 선택 방식</span>
            <span className="text-gray-900 font-medium">
              {formData.problemSelection === 'manual' ? '직접 선택' : '조건별 선택'}
            </span>
          </div>
        </div>
      </div>

      {/* Results Visibility */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">채점 결과 공개</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">시험 중</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              formData.showResultsDuring === 'public'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {formData.showResultsDuring === 'public' ? '공개' : '비공개'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">시험 종료 후</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              formData.showResultsAfter === 'public'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {formData.showResultsAfter === 'public' ? '공개' : '비공개'}
            </span>
          </div>
        </div>
      </div>

      {/* Hidden Items */}
      {(formData.hideCode || formData.hideScore) && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">제출 현황에서 숨길 항목</h4>
          <div className="space-y-1 text-sm">
            {formData.hideCode && (
              <div className="flex items-center text-gray-600">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                제출한 코드
              </div>
            )}
            {formData.hideScore && (
              <div className="flex items-center text-gray-600">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                점수
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Questions */}
      {formData.selectedQuestions.length > 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-700">선택된 문제</h4>
            <span className="text-xs text-gray-600">
              {formData.selectedQuestions.length}개 / {totalPoints}점
            </span>
          </div>
          <div className="space-y-2">
            {selectedQuestionsData.map((question, index) => (
              <div key={question.id} className="flex items-start space-x-2 text-sm">
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs text-gray-500">
                      {getQuestionTypeLabel(question.type as any)}
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {question.points}점
                    </span>
                  </div>
                  <p className="text-gray-900 line-clamp-1">
                    {question.question}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
