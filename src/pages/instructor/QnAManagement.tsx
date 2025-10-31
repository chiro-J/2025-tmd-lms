import { useState } from 'react'
import { MessageSquare, CheckCircle, Clock, Search } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

interface QnAItem {
  id: number
  studentName: string
  studentId: string
  question: string
  answer?: string
  status: 'pending' | 'answered'
  createdAt: string
  answeredAt?: string
}

export default function QnAManagement() {
  const [qnaList, setQnaList] = useState<QnAItem[]>([
    {
      id: 1,
      studentName: '김수강',
      studentId: 'student1',
      question: 'TypeScript 관련 질문이 있습니다.',
      status: 'pending',
      createdAt: '2025-01-15 14:30'
    },
    {
      id: 2,
      studentName: '이학습',
      studentId: 'student2',
      question: 'React 컴포넌트 재사용에 대해 궁금합니다.',
      answer: '좋은 질문이네요! 컴포넌트를 재사용하기 위해서는...',
      status: 'answered',
      createdAt: '2025-01-14 10:20',
      answeredAt: '2025-01-14 15:30'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedQnA, setSelectedQnA] = useState<QnAItem | null>(null)
  const [answerText, setAnswerText] = useState('')

  const filteredQnA = qnaList.filter(qna =>
    qna.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qna.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAnswerSubmit = () => {
    if (!selectedQnA) return
    // TODO: API 호출
    setAnswerText('')
    setSelectedQnA(null)
  }

  const rightActions = (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
        <Input
          type="text"
          placeholder="질문 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>
    </>
  )

  return (
    <CoursePageLayout
      currentPageTitle="Q&A 관리"
      rightActions={rightActions}
    >
      {/* Info Message */}
      <div className="mb-4">
        <p className="text-sm text-base-content/70">
          학생들의 질문을 확인하고 답변할 수 있습니다. 빠른 답변으로 학생들의 학습을 도와주세요.
        </p>
      </div>

      {/* QnA List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQnA.map((qna) => (
          <Card
            key={qna.id}
            className="p-4 cursor-pointer hover:bg-base-200 transition-colors"
            onClick={() => {
              setSelectedQnA(qna)
              setAnswerText(qna.answer || '')
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className={`text-xs px-2 py-1 rounded ${
                    qna.status === 'pending'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-success/10 text-success'
                  }`}>
                    {qna.status === 'pending' ? '미답변' : '답변 완료'}
                  </span>
                </div>
                <h3 className="font-medium text-base-content mb-1">{qna.question}</h3>
                <p className="text-sm text-base-content/70">
                  {qna.studentName} • {qna.createdAt}
                </p>
                {qna.answer && (
                  <div className="mt-3 p-3 bg-base-200 rounded-lg">
                    <p className="text-sm text-base-content/80">{qna.answer}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {qna.status === 'pending' && (
                  <Clock className="h-5 w-5 text-warning" />
                )}
                {qna.status === 'answered' && (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Answer Modal */}
      {selectedQnA && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6">
            <h3 className="text-lg font-semibold text-base-content mb-4">
              {selectedQnA.studentName}님의 질문
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-base-200 rounded-lg">
                <p className="text-base-content">{selectedQnA.question}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  답변 작성
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={6}
                  placeholder="답변을 입력하세요..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedQnA(null)
                    setAnswerText('')
                  }}
                  className="rounded-xl"
                >
                  취소
                </Button>
                <Button
                  onClick={handleAnswerSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
                >
                  답변 등록
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </CoursePageLayout>
  )
}
