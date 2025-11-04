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
    status: '마감'
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
    submissions: 11,
    total: 30,
    status: '마감'
  }
]

export const mockSubmissionsByAssignment: Record<number, AssignmentSubmission[]> = {
  1: [
    {
      id: 1001,
      assignmentId: 1,
      studentName: '홍길동',
      submittedAt: '2025-11-08T14:22:00',
      status: '제출',
      score: 92,
      files: [
        { name: '자기소개_홍길동.pdf', size: 245800, url: '/files/1001.pdf' }
      ],
      feedback: '자기소개가 상세하고 목표가 명확합니다. 잘 작성했습니다.'
    },
    {
      id: 1002,
      assignmentId: 1,
      studentName: '김영희',
      submittedAt: '2025-11-09T09:10:00',
      status: '제출',
      score: 88,
      files: [
        { name: '소개글_김영희.pdf', size: 198500, url: '/files/1002.pdf' }
      ],
      feedback: '좋은 내용이지만 목표 부분을 좀 더 구체적으로 작성하면 좋겠습니다.'
    },
    {
      id: 1003,
      assignmentId: 1,
      studentName: '이철수',
      submittedAt: '2025-11-10T23:59:00',
      status: '지각',
      score: 75,
      files: [
        { name: 'introduction_이철수.md', size: 12450, url: '/files/1003.md' }
      ],
      feedback: '지각 제출이며 분량이 다소 부족합니다.'
    },
    {
      id: 1004,
      assignmentId: 1,
      studentName: '박지민',
      submittedAt: '2025-11-09T16:45:00',
      status: '제출',
      score: 95,
      files: [
        { name: '과제1_박지민.pdf', size: 312000, url: '/files/1004.pdf' }
      ],
      feedback: '매우 훌륭합니다. 목표가 구체적이고 실현 가능해 보입니다.'
    },
    {
      id: 1005,
      assignmentId: 1,
      studentName: '정서연',
      submittedAt: '2025-11-08T11:30:00',
      status: '제출',
      score: 90,
      files: [
        { name: '자기소개_정서연.pdf', size: 267300, url: '/files/1005.pdf' }
      ]
    },
    {
      id: 1006,
      assignmentId: 1,
      studentName: '강민호',
      submittedAt: '2025-11-09T20:15:00',
      status: '제출',
      score: 85,
      files: [
        { name: 'intro_강민호.zip', size: 445000, url: '/files/1006.zip' }
      ]
    },
    {
      id: 1007,
      assignmentId: 1,
      studentName: '윤하은',
      submittedAt: '2025-11-11T02:30:00',
      status: '지각',
      score: 70,
      files: [
        { name: '소개_윤하은.md', size: 9800, url: '/files/1007.md' }
      ]
    },
    {
      id: 1008,
      assignmentId: 1,
      studentName: '조승우',
      submittedAt: '2025-11-08T19:00:00',
      status: '제출',
      score: 94,
      files: [
        { name: 'assignment1_조승우.pdf', size: 289000, url: '/files/1008.pdf' }
      ]
    }
  ],
  2: [
    {
      id: 2001,
      assignmentId: 2,
      studentName: '박민수',
      submittedAt: '2025-11-16T18:35:00',
      status: '제출',
      score: 80,
      files: [
        { name: '퀴즈해설_박민수.pdf', size: 156700, url: '/files/2001.pdf' }
      ]
    },
    {
      id: 2002,
      assignmentId: 2,
      studentName: '홍길동',
      submittedAt: '2025-11-16T14:20:00',
      status: '제출',
      score: 86,
      files: [
        { name: 'quiz_analysis_홍길동.md', size: 18900, url: '/files/2002.md' }
      ]
    },
    {
      id: 2003,
      assignmentId: 2,
      studentName: '김영희',
      submittedAt: '2025-11-17T01:10:00',
      status: '지각',
      score: 72,
      files: [
        { name: '과제2_김영희.pdf', size: 123400, url: '/files/2003.pdf' }
      ]
    }
  ],
  3: [
    {
      id: 3001,
      assignmentId: 3,
      studentName: '최수정',
      submittedAt: '2025-10-24T20:05:00',
      status: '제출',
      score: 96,
      files: [
        { name: '프로젝트기획서_최수정.pdf', size: 387200, url: '/files/3001.pdf' }
      ],
      feedback: '기획서가 매우 체계적이고 일정과 역할 분담이 명확합니다.'
    },
    {
      id: 3002,
      assignmentId: 3,
      studentName: '오지훈',
      submittedAt: '2025-10-25T01:02:00',
      status: '지각',
      score: 70,
      files: [
        { name: 'project_plan_오지훈.pdf', size: 201500, url: '/files/3002.pdf' }
      ]
    },
    {
      id: 3003,
      assignmentId: 3,
      studentName: '홍길동',
      submittedAt: '2025-10-24T15:30:00',
      status: '제출',
      score: 88,
      files: [
        { name: '기획서_홍길동.pdf', size: 298700, url: '/files/3003.pdf' }
      ]
    },
    {
      id: 3004,
      assignmentId: 3,
      studentName: '김영희',
      submittedAt: '2025-10-24T18:45:00',
      status: '제출',
      score: 92,
      files: [
        { name: 'proposal_김영희.pdf', size: 325400, url: '/files/3004.pdf' }
      ]
    },
    {
      id: 3005,
      assignmentId: 3,
      studentName: '이철수',
      submittedAt: '2025-10-24T22:10:00',
      status: '제출',
      score: 85,
      files: [
        { name: '팀프로젝트기획_이철수.pdf', size: 276100, url: '/files/3005.pdf' }
      ]
    },
    {
      id: 3006,
      assignmentId: 3,
      studentName: '박지민',
      submittedAt: '2025-10-24T19:20:00',
      status: '제출',
      score: 94,
      files: [
        { name: 'project_박지민.pdf', size: 341200, url: '/files/3006.pdf' }
      ]
    },
    {
      id: 3007,
      assignmentId: 3,
      studentName: '정서연',
      submittedAt: '2025-10-24T21:00:00',
      status: '제출',
      score: 90,
      files: [
        { name: '기획안_정서연.pdf', size: 312800, url: '/files/3007.pdf' }
      ]
    },
    {
      id: 3008,
      assignmentId: 3,
      studentName: '강민호',
      submittedAt: '2025-10-25T02:15:00',
      status: '지각',
      score: 68,
      files: [
        { name: 'plan_강민호.pdf', size: 189300, url: '/files/3008.pdf' }
      ]
    },
    {
      id: 3009,
      assignmentId: 3,
      studentName: '윤하은',
      submittedAt: '2025-10-24T17:30:00',
      status: '제출',
      score: 93,
      files: [
        { name: '프로젝트_윤하은.pdf', size: 356900, url: '/files/3009.pdf' }
      ]
    },
    {
      id: 3010,
      assignmentId: 3,
      studentName: '조승우',
      submittedAt: '2025-10-24T20:50:00',
      status: '제출',
      score: 89,
      files: [
        { name: 'proposal_조승우.pdf', size: 297400, url: '/files/3010.pdf' }
      ]
    },
    {
      id: 3011,
      assignmentId: 3,
      studentName: '박민수',
      submittedAt: '2025-10-24T16:40:00',
      status: '제출',
      score: 91,
      files: [
        { name: '기획서_박민수.pdf', size: 318600, url: '/files/3011.pdf' }
      ]
    }
  ]
}

export function getAssignmentById(id: number): Assignment | undefined {
  return mockAssignments.find(a => a.id === id)
}






