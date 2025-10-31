import type { Assignment, AssignmentSubmission } from '../types/assignment'

export const mockAssignments: Assignment[] = [
  {
    id: 1,
    courseId: 1,
    title: '과제 1: 소개 글 작성',
    description: '자기 소개와 본 과정에서의 목표를 300자 이상 작성하세요.',
    dueDate: '2025-11-10',
    maxScore: 100,
    instructions: ['PDF 또는 MD 파일 제출', '마감 시간 이후 제출은 지각 처리'],
    allowedFileTypes: ['.pdf', '.md', '.zip'],
    maxFileSize: 50,
    submissions: 8,
    total: 30,
    status: '진행 중'
  },
  {
    id: 2,
    courseId: 1,
    title: '과제 2: 1주차 퀴즈 해설',
    description: '틀린 문제를 3개 이상 선택해 해설 작성 후 제출하세요.',
    dueDate: '2025-11-17',
    maxScore: 50,
    instructions: ['문항 번호와 해설을 명확히 구분', '인용은 출처 표기'],
    allowedFileTypes: ['.pdf', '.md'],
    maxFileSize: 20,
    submissions: 3,
    total: 30,
    status: '진행 중'
  },
  {
    id: 3,
    courseId: 1,
    title: '과제 3: 프로젝트 기획서',
    description: '팀 프로젝트 주제와 범위를 정의하고 일정/역할을 포함하세요.',
    dueDate: '2025-10-25',
    maxScore: 100,
    instructions: ['템플릿 준수', 'PDF 제출'],
    allowedFileTypes: ['.pdf'],
    maxFileSize: 30,
    submissions: 29,
    total: 30,
    status: '마감'
  }
]

export const mockSubmissionsByAssignment: Record<number, AssignmentSubmission[]> = {
  1: [
    { id: 1001, assignmentId: 1, studentName: '홍길동', submittedAt: '2025-11-08T14:22:00', status: '제출', score: 92 },
    { id: 1002, assignmentId: 1, studentName: '김영희', submittedAt: '2025-11-09T09:10:00', status: '제출', score: 88 },
    { id: 1003, assignmentId: 1, studentName: '이철수', submittedAt: '2025-11-10T23:59:00', status: '지각' }
  ],
  2: [{ id: 2001, assignmentId: 2, studentName: '박민수', submittedAt: '2025-11-16T18:35:00', status: '제출', score: 80 }],
  3: [
    { id: 3001, assignmentId: 3, studentName: '최수정', submittedAt: '2025-10-24T20:05:00', status: '제출', score: 96 },
    { id: 3002, assignmentId: 3, studentName: '오지훈', submittedAt: '2025-10-25T01:02:00', status: '지각', score: 70 }
  ]
}

export function getAssignmentById(id: number): Assignment | undefined {
  return mockAssignments.find(a => a.id === id)
}




