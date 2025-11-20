import { Plus, Trash2, ChevronDown } from 'lucide-react'
import Button from '../ui/Button'
import type { QuestionData, QuestionType } from '../../types/question'
import { getQuestionTypeLabel, getStatusColor, getStatusLabel } from '../../utils/questionUtils'

interface QuestionEditorProps {
  formData: QuestionData
  selectedQuestionId: string | null
  lastSaved: string
  examsInfo: Record<string, { id: string; title: string; type: string }>
  onInputChange: (field: string | number | symbol, value: any) => void
  onTypeChange: (type: QuestionType) => void
  onOptionChange: (index: number, value: string) => void
  onAddOption: () => void
  onRemoveOption: (index: number) => void
}

export default function QuestionEditor({
  formData,
  selectedQuestionId,
  lastSaved,
  examsInfo,
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
          <div className="relative">
            <select
              value={formData.type}
              onChange={(e) => onTypeChange(e.target.value as 'multiple-choice' | 'true-false' | 'short-answer')}
              className="w-full px-4 py-3 pr-10 text-sm border-2 border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-base-100 appearance-none"
            >
              <option value="multiple-choice">객관식</option>
              <option value="true-false">참/거짓</option>
              <option value="short-answer">주관식</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40 pointer-events-none" />
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
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    formData.correctAnswer === index
                      ? 'border-success bg-success/10 shadow-md'
                      : 'border-base-300 bg-base-100 hover:border-base-400'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => onOptionChange(index, e.target.value)}
                        placeholder={`선택지 ${index + 1}`}
                        className={`w-full px-4 py-3 text-sm border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${
                          formData.correctAnswer === index
                            ? 'border-success/50'
                            : 'border-base-300'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => onInputChange('correctAnswer', index)}
                        className={`min-w-[100px] px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          formData.correctAnswer === index
                            ? 'bg-success text-white hover:bg-success/90 shadow-md'
                            : 'bg-base-200 text-base-content hover:bg-base-300 border-2 border-base-300'
                        }`}
                        title="정답으로 설정"
                      >
                        {formData.correctAnswer === index ? '✓ 정답' : '정답 지정'}
                      </Button>
                      {formData.options.length > 2 && (
                        <button
                          onClick={() => onRemoveOption(index)}
                          className="px-3 py-2 text-xs text-error hover:bg-error/10 rounded-lg transition-colors border border-error/30 hover:border-error/50"
                          title="선택지 삭제"
                        >
                          <Trash2 className="h-4 w-4 mx-auto" />
                        </button>
                      )}
                    </div>
                  </div>
                  {formData.correctAnswer === index && (
                    <div className="mt-3 pt-3 border-t-2 border-success/30">
                      <span className="text-xs font-semibold text-success flex items-center">
                        <span className="w-2 h-2 bg-success rounded-full mr-2"></span>
                        이 선택지가 정답으로 설정되었습니다
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-base-content/60 mt-3 p-3 bg-info/10 border border-info/30 rounded-lg">
              💡 각 선택지의 <strong>"정답 지정"</strong> 버튼을 클릭하여 정답을 선택하세요
            </p>
          </div>
        )}

        {/* Correct Answer for True/False */}
        {formData.type === 'true-false' && (
          <div>
            <label className="block text-sm font-semibold text-base-content mb-3">
              정답
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onInputChange('correctAnswer', true)}
                className={`py-4 text-base font-medium rounded-lg transition-all border-2 ${
                  formData.correctAnswer === true
                    ? 'bg-success text-white border-success shadow-md'
                    : 'bg-base-100 text-base-content border-base-300 hover:border-base-400'
                }`}
              >
                {formData.correctAnswer === true && '✓ '}참
              </Button>
              <Button
                onClick={() => onInputChange('correctAnswer', false)}
                className={`py-4 text-base font-medium rounded-lg transition-all border-2 ${
                  formData.correctAnswer === false
                    ? 'bg-success text-white border-success shadow-md'
                    : 'bg-base-100 text-base-content border-base-300 hover:border-base-400'
                }`}
              >
                {formData.correctAnswer === false && '✓ '}거짓
              </Button>
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
                const exam = examsInfo[examId]
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
