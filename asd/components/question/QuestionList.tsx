import { Search, FileText } from 'lucide-react'
import type { QuestionData, QuestionStatus } from '../../types/question'
import { getQuestionTypeLabel, getStatusColor, getStatusLabel } from '../../utils/questionUtils'

interface QuestionListProps {
  questions: QuestionData[]
  selectedQuestionId: string | null
  filterStatus: 'all' | QuestionStatus
  searchQuery: string
  onQuestionSelect: (questionId: string) => void
  onFilterStatusChange: (status: 'all' | QuestionStatus) => void
  onSearchQueryChange: (query: string) => void
  mockExams: Record<string, { id: string; title: string; type: string }>
}

export default function QuestionList({
  questions,
  selectedQuestionId,
  filterStatus,
  searchQuery,
  onQuestionSelect,
  onFilterStatusChange,
  onSearchQueryChange,
  mockExams
}: QuestionListProps) {
  const filteredQuestions = questions.filter(q => {
    if (filterStatus !== 'all' && q.status !== filterStatus) return false
    if (searchQuery && !q.question.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-base-content mb-3">문제 목록</h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/40" />
          <input
            type="text"
            placeholder="문제 검색..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-base-300 rounded-lg bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value as typeof filterStatus)}
          className="w-full px-3 py-2 text-sm border border-base-300 rounded-lg bg-base-100 focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">전체 ({questions.length})</option>
          <option value="draft">작성중 ({questions.filter(q => q.status === 'draft').length})</option>
          <option value="review">검토 필요 ({questions.filter(q => q.status === 'review').length})</option>
          <option value="completed">완료 ({questions.filter(q => q.status === 'completed').length})</option>
        </select>
      </div>

      {/* Question List */}
      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">문제가 없습니다</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => onQuestionSelect(question.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selectedQuestionId === question.id
                  ? 'border-primary bg-primary/5'
                  : 'border-base-300 hover:border-primary/50 hover:bg-base-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(question.status)}`}>
                  {getStatusLabel(question.status)}
                </span>
                <span className="text-xs text-base-content/60">{question.points}점</span>
              </div>
              <p className="text-sm font-medium text-base-content line-clamp-2 mb-1">
                {question.question || '제목 없음'}
              </p>
              <div className="flex items-center justify-between text-xs text-base-content/60 mb-1">
                <span>{getQuestionTypeLabel(question.type)}</span>
                <span>{question.updatedAt}</span>
              </div>
              {question.usedInExams && question.usedInExams.length > 0 && (
                <div className="mt-2 pt-2 border-t border-base-300">
                  <p className="text-xs text-base-content/50 mb-1">사용 중인 시험:</p>
                  <div className="flex flex-wrap gap-1">
                    {question.usedInExams.map(examId => (
                      <span key={examId} className="px-1.5 py-0.5 text-xs bg-info/10 text-info rounded">
                        {mockExams[examId]?.title || examId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
