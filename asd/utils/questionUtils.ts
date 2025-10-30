import type { QuestionType, QuestionStatus } from '../types/question'

export const getQuestionTypeLabel = (type: QuestionType): string => {
  switch (type) {
    case 'multiple-choice':
      return '객관식'
    case 'true-false':
      return '참/거짓'
    case 'short-answer':
      return '주관식'
    default:
      return '문제'
  }
}

export const getStatusColor = (status: QuestionStatus): string => {
  switch (status) {
    case 'draft':
      return 'bg-warning/10 text-warning'
    case 'review':
      return 'bg-orange-500/10 text-orange-600'
    case 'completed':
      return 'bg-success/10 text-success'
    default:
      return 'bg-base-300 text-base-content/70'
  }
}

export const getStatusLabel = (status: QuestionStatus): string => {
  switch (status) {
    case 'draft':
      return '작성중'
    case 'review':
      return '검토 필요'
    case 'completed':
      return '완료'
    default:
      return ''
  }
}
