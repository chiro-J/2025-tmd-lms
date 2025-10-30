import type { ExamStatus } from '../types/exam'

export const getStatusColor = (status: ExamStatus): string => {
  switch (status) {
    case '진행중':
      return 'bg-success/10 text-success'
    case '예정':
      return 'bg-warning/10 text-warning'
    case '완료':
      return 'bg-base-300 text-base-content/70'
    default:
      return 'bg-base-300 text-base-content/70'
  }
}





