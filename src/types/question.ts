export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer'
export type QuestionStatus = 'draft' | 'review' | 'completed'

export interface QuestionData {
  id: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: any
  points: number
  explanation: string
  status: QuestionStatus
  createdAt: string
  updatedAt: string
  usedInExams?: string[]
}





