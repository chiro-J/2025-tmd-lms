import { useState } from 'react'
import { Plus, X as RemoveIcon } from 'lucide-react'
import ModalBase from './ModalBase'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import MarkdownEditor from '../../components/editor/MarkdownEditor'

interface AskQuestionModalProps {
  courseTitle: string
  onClose: () => void
}

export default function AskQuestionModal({ courseTitle, onClose }: AskQuestionModalProps) {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      handleAddTag()
    }
  }

  const handleSubmit = async () => {
    if (question.length < 10) return

    setIsSubmitting(true)
    try {
      // TODO: 실제 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('질문 제출:', { question, tags, courseTitle })
      onClose()
    } catch (error) {
      console.error('질문 제출 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalBase
      open={true}
      onClose={onClose}
      title="질문하기"
    >
      <div className="space-y-6">
        <div className="text-sm text-gray-500 mb-4">{courseTitle}</div>

        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            질문 내용 *
          </label>
          <MarkdownEditor initialValue={question} onChange={setQuestion} height={300} />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>최소 10자 이상 작성해주세요</span>
            <span>{question.length}/1000</span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태그 (선택사항)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <RemoveIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="태그를 입력하고 Enter를 누르세요"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              variant="outline"
              className="px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">질문 작성 가이드라인</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 구체적이고 명확한 질문을 작성해주세요.</li>
            <li>• 코드나 오류 메시지가 있다면 함께 첨부해주세요.</li>
            <li>• 이미 시도해본 방법이 있다면 설명해주세요.</li>
            <li>• 예의 바른 언어를 사용해주세요.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
