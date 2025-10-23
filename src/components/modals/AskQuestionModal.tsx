import { useState } from 'react'
import { X, Plus, X as RemoveIcon } from 'lucide-react'
import ModalBase from './ModalBase'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

interface AskQuestionModalProps {
  courseId: string
  courseTitle: string
  onClose: () => void
}

export default function AskQuestionModal({ courseId, courseTitle, onClose }: AskQuestionModalProps) {
  const [question, setQuestion] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!question.trim()) return
    
    setIsSubmitting(true)
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      handleAddTag()
    }
  }

  return (
    <ModalBase onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">질문하기</h2>
              <p className="text-sm text-gray-500">{courseTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                질문 내용 *
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="질문을 자세히 작성해주세요. 구체적인 내용일수록 좋은 답변을 받을 수 있습니다."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                최소 10자 이상 작성해주세요. ({question.length}/10)
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                태그 (선택사항)
              </label>
              <div className="flex space-x-2 mb-2">
                <Input
                  type="text"
                  placeholder="태그 입력 (예: react, javascript)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || tags.includes(newTag.trim())}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <RemoveIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                관련 키워드를 태그로 추가하면 더 쉽게 찾을 수 있습니다.
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">질문 작성 가이드라인</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 구체적이고 명확한 질문을 작성해주세요.</li>
                <li>• 코드나 오류 메시지가 있다면 함께 첨부해주세요.</li>
                <li>• 이미 시도해본 방법이 있다면 설명해주세요.</li>
                <li>• 예의 바른 언어를 사용해주세요.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={question.length < 10 || isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? '등록 중...' : '질문 등록'}
          </Button>
        </div>
      </div>
    </ModalBase>
  )
}








