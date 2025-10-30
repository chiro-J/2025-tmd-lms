import type { QuestionData } from '../types/question'

// Available questions for exam selection (simplified version)
export const availableQuestions = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'JavaScript에서 변수를 선언하는 키워드가 아닌 것은?',
    points: 10,
    status: 'completed'
  },
  {
    id: '2',
    type: 'true-false',
    question: 'React는 Meta(Facebook)에서 개발한 라이브러리이다.',
    points: 5,
    status: 'completed'
  },
  {
    id: '3',
    type: 'short-answer',
    question: 'HTTP 상태 코드 404는 무엇을 의미하는가?',
    points: 15,
    status: 'completed'
  }
]

export const mockQuestions: QuestionData[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'JavaScript에서 변수를 선언하는 키워드가 아닌 것은?',
    options: ['var', 'let', 'const', 'int'],
    correctAnswer: 3,
    points: 10,
    explanation: 'JavaScript에는 int 키워드가 없습니다.',
    status: 'completed',
    createdAt: '2025-10-20',
    updatedAt: '2025-10-23',
    usedInExams: ['1', '2']
  },
  {
    id: '2',
    type: 'true-false',
    question: 'React는 Meta(Facebook)에서 개발한 라이브러리이다.',
    options: [],
    correctAnswer: true,
    points: 5,
    explanation: 'React는 2013년 Facebook에서 오픈소스로 공개했습니다.',
    status: 'completed',
    createdAt: '2025-10-21',
    updatedAt: '2025-10-22',
    usedInExams: ['1']
  },
  {
    id: '3',
    type: 'short-answer',
    question: 'HTTP 상태 코드 404는 무엇을 의미하는가?',
    options: [],
    correctAnswer: '요청한 페이지를 찾을 수 없음',
    points: 15,
    explanation: '404 Not Found는 서버가 요청한 리소스를 찾을 수 없을 때 반환됩니다.',
    status: 'completed',
    createdAt: '2025-10-19',
    updatedAt: '2025-10-23',
    usedInExams: ['3']
  },
  {
    id: '4',
    type: 'multiple-choice',
    question: 'CSS에서 flexbox의 주축을 변경하는 속성은?',
    options: ['flex-direction', 'flex-wrap', 'justify-content', 'align-items'],
    correctAnswer: 0,
    points: 10,
    explanation: '',
    status: 'draft',
    createdAt: '2025-10-24',
    updatedAt: '2025-10-24'
  },
  {
    id: '5',
    type: 'short-answer',
    question: 'REST API의 핵심 원칙 3가지를 설명하시오.',
    options: [],
    correctAnswer: '',
    points: 20,
    explanation: '',
    status: 'review',
    createdAt: '2025-10-23',
    updatedAt: '2025-10-24'
  }
]






