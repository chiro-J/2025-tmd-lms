export type SortField = 'title' | 'type' | 'status' | 'startDate' | 'endDate' | 'author' | 'group'
export type SortOrder = 'asc' | 'desc'
export type ExamType = '시험' | '과제'
export type ExamStatus = '예정' | '진행중' | '완료'

export interface Exam {
  id: number
  title: string
  type: ExamType
  status: ExamStatus
  startDate: string
  endDate: string
  participants: number
  totalQuestions: number
  author: string
  group: string
}

export interface ExamFormData {
  title: string
  type: 'exam' | 'assignment'
  startDate: string
  endDate: string
  hasTimeLimit: boolean
  timeLimit: string
  showResultsDuring: 'private' | 'public'
  showResultsAfter: 'private' | 'public'
  hideCode: boolean
  hideScore: boolean
  useGroups: boolean
  problemSelection: 'manual' | 'conditional'
  selectedQuestions: string[]
}






