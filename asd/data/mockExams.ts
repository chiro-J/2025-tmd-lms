import type { Exam } from '../types/exam'

export const mockExams: Exam[] = [
  {
    id: 1,
    title: '중간고사',
    type: '시험',
    status: '진행중',
    startDate: '2025-10-24',
    endDate: '2025-10-27',
    participants: 25,
    totalQuestions: 50,
    author: '김강사',
    group: '전체'
  },
  {
    id: 2,
    title: '최종 프로젝트 과제',
    type: '과제',
    status: '예정',
    startDate: '2025-10-24',
    endDate: '2025-11-10',
    participants: 25,
    totalQuestions: 5,
    author: '김강사',
    group: '전체'
  },
  {
    id: 3,
    title: '1차 퀴즈',
    type: '시험',
    status: '완료',
    startDate: '2025-10-10',
    endDate: '2025-10-12',
    participants: 25,
    totalQuestions: 20,
    author: '김강사',
    group: '전체'
  },
  {
    id: 4,
    title: '알고리즘 과제',
    type: '과제',
    status: '진행중',
    startDate: '2025-10-20',
    endDate: '2025-10-30',
    participants: 25,
    totalQuestions: 3,
    author: '이강사',
    group: 'A그룹'
  },
  {
    id: 5,
    title: '기말고사',
    type: '시험',
    status: '예정',
    startDate: '2025-11-15',
    endDate: '2025-11-18',
    participants: 25,
    totalQuestions: 80,
    author: '김강사',
    group: '전체'
  }
]

export const mockExamsInfo: Record<string, { id: string; title: string; type: string }> = {
  '1': { id: '1', title: '중간고사', type: 'exam' },
  '2': { id: '2', title: '1주차 퀴즈', type: 'exam' },
  '3': { id: '3', title: '프로젝트 과제', type: 'assignment' }
}
