import { Eye } from 'lucide-react'
import type { QuestionData } from '../../types/question'
import { getQuestionTypeLabel } from '../../utils/questionUtils'

interface QuestionPreviewProps {
  formData: QuestionData
}

export default function QuestionPreview({ formData }: QuestionPreviewProps) {
  return (
    <div className="p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-base-content">미리보기</h2>
        <Eye className="h-5 w-5 text-base-content/50" />
      </div>

      <div className="border-2 border-dashed border-base-300 rounded-lg p-6 bg-base-50">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {getQuestionTypeLabel(formData.type)}
            </span>
            <span className="text-sm text-base-content/70">
              {formData.points}점
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">
            {formData.question || '문제 내용을 입력하세요...'}
          </h3>

          {/* Answer Options Preview */}
          <div className="space-y-3">
            {formData.type === 'multiple-choice' && formData.options.length > 0 && (
              formData.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg ${
                    formData.correctAnswer === index
                      ? 'border-success bg-success/5'
                      : 'border-base-300 bg-base-100'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full border-2 mr-3 ${
                    formData.correctAnswer === index
                      ? 'border-success bg-success'
                      : 'border-base-300'
                  }`}></div>
                  <span className="text-base-content">
                    {option || `선택지 ${index + 1}`}
                  </span>
                  {formData.correctAnswer === index && (
                    <span className="ml-auto text-xs text-success font-medium">정답</span>
                  )}
                </div>
              ))
            )}

            {formData.type === 'true-false' && (
              <div className="space-y-3">
                <div className={`flex items-center p-4 border-2 rounded-lg ${
                  formData.correctAnswer === true
                    ? 'border-success bg-success/5'
                    : 'border-base-300 bg-base-100'
                }`}>
                  <div className={`h-4 w-4 rounded-full border-2 mr-3 ${
                    formData.correctAnswer === true
                      ? 'border-success bg-success'
                      : 'border-base-300'
                  }`}></div>
                  <span className="text-base-content">참</span>
                  {formData.correctAnswer === true && (
                    <span className="ml-auto text-xs text-success font-medium">정답</span>
                  )}
                </div>
                <div className={`flex items-center p-4 border-2 rounded-lg ${
                  formData.correctAnswer === false
                    ? 'border-success bg-success/5'
                    : 'border-base-300 bg-base-100'
                }`}>
                  <div className={`h-4 w-4 rounded-full border-2 mr-3 ${
                    formData.correctAnswer === false
                      ? 'border-success bg-success'
                      : 'border-base-300'
                  }`}></div>
                  <span className="text-base-content">거짓</span>
                  {formData.correctAnswer === false && (
                    <span className="ml-auto text-xs text-success font-medium">정답</span>
                  )}
                </div>
              </div>
            )}

            {formData.type === 'short-answer' && (
              <div className="p-4 border-2 border-base-300 rounded-lg bg-base-100">
                <p className="text-sm text-base-content/60 italic">
                  학생이 답안을 입력할 텍스트 영역
                </p>
                {formData.correctAnswer && (
                  <div className="mt-4 pt-4 border-t border-base-300">
                    <p className="text-xs font-medium text-success mb-2">모범 답안:</p>
                    <p className="text-sm text-base-content">{formData.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Explanation Preview */}
        {formData.explanation && (
          <div className="mt-6 pt-6 border-t border-base-300">
            <h4 className="text-sm font-semibold text-base-content mb-2">해설</h4>
            <p className="text-sm text-base-content/80">{formData.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}






