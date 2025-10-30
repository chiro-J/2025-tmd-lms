import { Plus, Trash2 } from 'lucide-react'
import Button from '../ui/Button'
import type { QuestionData, QuestionType } from '../../types/question'
import { getQuestionTypeLabel, getStatusColor, getStatusLabel } from '../../utils/questionUtils'

interface QuestionEditorProps {
  formData: QuestionData
  selectedQuestionId: string | null
  lastSaved: string
  mockExams: Record<string, { id: string; title: string; type: string }>
  onInputChange: (field: keyof QuestionData, value: any) => void
  onTypeChange: (type: QuestionType) => void
  onOptionChange: (index: number, value: string) => void
  onAddOption: () => void
  onRemoveOption: (index: number) => void
}

export default function QuestionEditor({
  formData,
  selectedQuestionId,
  lastSaved,
  mockExams,
  onInputChange,
  onTypeChange,
  onOptionChange,
  onAddOption,
  onRemoveOption
}: QuestionEditorProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-base-content mb-6">
        {selectedQuestionId ? '문제 편집' : '새 문제 작성'}
      </h2>

      <div className="space-y-6">
        {/* Question Type */}
        <div>
          <label className="block text-sm font-semibold text-base-content mb-3">
            문제 유형
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="questionType"
                value="multiple-choice"
                checked={formData.type === 'multiple-choice'}
                onChange={() => onTypeChange('multiple-choice')}
                className="h-4 w-4 text-primary focus:ring-primary border-base-300"
              />
              <span className="ml-2 text-sm text-base-content">객관식</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="questionType"
                value="true-false"
                checked={formData.type === 'true-false'}
                onChange={() => onTypeChange('true-false')}
                className="h-4 w-4 text-primary focus:ring-primary border-base-300"
              />
              <span className="ml-2 text-sm text-base-content">참/거짓</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="questionType"
                value="short-answer"
                checked={formData.type === 'short-answer'}
                onChange={() => onTypeChange('short-answer')}
                className="h-4 w-4 text-primary focus:ring-primary border-base-300"
              />
              <span className="ml-2 text-sm text-base-content">주관식</span>
            </label>
          </div>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-sm font-semibold text-base-content mb-3">
            문제 내용
          </label>
          <textarea
            value={formData.question}
            onChange={(e) => onInputChange('question', e.target.value)}
            placeholder="문제를 입력하세요..."
            className="w-full px-4 py-3 text-sm border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100"
            rows={4}
          />
        </div>

        {/* Points */}
        <div>
          <label className="block text-sm font-semibold text-base-content mb-3">
            점수
          </label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => onInputChange('points', parseInt(e.target.value) || 0)}
            min="0"
            className="w-full px-4 py-3 text-sm border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100"
          />
        </div>

        {/* Options for Multiple Choice */}
        {formData.type === 'multiple-choice' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-base-content">
                선택지
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddOption}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                선택지 추가
              </Button>
            </div>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === index}
                    onChange={() => onInputChange('correctAnswer', index)}
                    className="h-4 w-4 text-success focus:ring-success border-base-300 flex-shrink-0"
                    title="정답으로 설정"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => onOptionChange(index, e.target.value)}
                    placeholder={`선택지 ${index + 1}`}
                    className="flex-1 px-4 py-2 text-sm border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100"
                  />
                  {formData.options.length > 2 && (
                    <button
                      onClick={() => onRemoveOption(index)}
                      className="text-error hover:text-error/80 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-base-content/60 mt-2">
              라디오 버튼을 클릭하여 정답을 선택하세요
            </p>
          </div>
        )}

        {/* Correct Answer for True/False */}
        {formData.type === 'true-false' && (
          <div>
            <label className="block text-sm font-semibold text-base-content mb-3">
              정답
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tfAnswer"
                  checked={formData.correctAnswer === true}
                  onChange={() => onInputChange('correctAnswer', true)}
                  className="h-4 w-4 text-success focus:ring-success border-base-300"
                />
                <span className="ml-2 text-sm text-base-content">참</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tfAnswer"
                  checked={formData.correctAnswer === false}
                  onChange={() => onInputChange('correctAnswer', false)}
                  className="h-4 w-4 text-success focus:ring-success border-base-300"
                />
                <span className="ml-2 text-base-content">거짓</span>
              </label>
            </div>
          </div>
        )}

        {/* Correct Answer for Short Answer */}
        {formData.type === 'short-answer' && (
          <div>
            <label className="block text-sm font-semibold text-base-content mb-3">
              모범 답안
            </label>
            <textarea
              value={formData.correctAnswer || ''}
              onChange={(e) => onInputChange('correctAnswer', e.target.value)}
              placeholder="모범 답안을 입력하세요..."
              className="w-full px-4 py-3 text-sm border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100"
              rows={3}
            />
          </div>
        )}

        {/* Explanation */}
        <div>
          <label className="block text-sm font-semibold text-base-content mb-3">
            해설 (선택사항)
          </label>
          <textarea
            value={formData.explanation}
            onChange={(e) => onInputChange('explanation', e.target.value)}
            placeholder="문제 해설을 입력하세요..."
            className="w-full px-4 py-3 text-sm border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100"
            rows={4}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-base-content mb-3">
            상태
          </label>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(formData.status)}`}>
                {getStatusLabel(formData.status)}
              </span>
              {lastSaved && (
                <span className="text-xs text-base-content/60">
                  마지막 저장: {lastSaved}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-base-content/60 mt-2">
            작성중: 자동 저장 (5초마다) | 검토 필요: "임시 저장" 버튼 | 완료: "문제 저장" 버튼
          </p>
        </div>

        {/* Used in Exams */}
        {formData.usedInExams && formData.usedInExams.length > 0 && (
          <div className="p-4 border-2 border-info/30 bg-info/5 rounded-lg">
            <label className="block text-sm font-semibold text-base-content mb-3">
              사용 중인 시험/과제
            </label>
            <div className="space-y-2">
              {formData.usedInExams.map(examId => {
                const exam = mockExams[examId]
                return (
                  <div key={examId} className="flex items-center justify-between p-2 bg-white rounded">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        exam?.type === 'exam'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {exam?.type === 'exam' ? '시험' : '과제'}
                      </span>
                      <span className="text-sm text-base-content">{exam?.title || examId}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-base-content/60 mt-3">
              ⚠️ 이 문제는 현재 시험/과제에서 사용 중입니다. 수정 시 주의하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
