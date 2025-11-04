// Enhanced types from com/lms-test
import type {
  User,
  Course,
  Lecture,
  Notice,
  CalendarEvent,
  GradeItem,
  Quiz,
  Resource,
  QnAItem,
  FAQItem,
  Notification
} from './types'

export const mockNotices: Notice[] = [
  { id: 1, title: "시스템 점검 안내 #1", date: "2025-10-10", content: "점검 #1 내용..." },
  { id: 2, title: "시스템 점검 안내 #2", date: "2025-10-11", content: "점검 #2 내용..." },
  { id: 3, title: "시스템 점검 안내 #3", date: "2025-10-12", content: "점검 #3 내용..." },
  { id: 4, title: "시스템 점검 안내 #4", date: "2025-10-13", content: "점검 #4 내용..." },
  { id: 5, title: "시스템 점검 안내 #5", date: "2025-10-14", content: "점검 #5 내용..." },
  { id: 6, title: "시스템 점검 안내 #6", date: "2025-10-15", content: "점검 #6 내용..." },
]

export const mockUser: User = {
  id: 1,
  username: "alexkim",
  name: "Alex Kim",
  email: "alex@example.com",
  password: "password123",
  role: "student",
  avatar: null
}

export const mockUserStats = {
  totalCourses: 12,
  inProgress: 4,
  avgProgress: 56
}

export const mockLearningNow = [
  { courseId: 1, title: "Course 1", lastLesson: "Lesson 3", progress: 48 },
  { courseId: 2, title: "Course 2", lastLesson: "Lesson 1", progress: 12 },
  { courseId: 3, title: "Course 3", lastLesson: "Lesson 5", progress: 67 },
]

export const mockRecent = [
  { id: 1, title: "Course 1", instructor: "김강사", lastLesson: "Lesson 3", progress: 48 },
  { id: 3, title: "Course 3", instructor: "김강사", lastLesson: "Lesson 5", progress: 67 },
  { id: 4, title: "Course 4", instructor: "김강사", lastLesson: "Lesson 2", progress: 34 },
]

export const mockCourses = [
  { id: 1, title: "Course 1", instructor: "김강사", progress: 48 },
  { id: 2, title: "Course 2", instructor: "김강사", progress: 12 },
  { id: 3, title: "Course 3", instructor: "김강사", progress: 67 },
  { id: 4, title: "Course 4", instructor: "김강사", progress: 34 },
  { id: 5, title: "Course 5", instructor: "김강사", progress: 82 },
  { id: 6, title: "Course 6", instructor: "김강사", progress: 5 },
]

export const mockLessons = [
  { id: 1, title: 'Introduction to React', duration: '15m', done: true },
  { id: 2, title: 'Components and Props', duration: '22m', done: true },
  { id: 3, title: 'State and Lifecycle', duration: '18m', done: false },
  { id: 4, title: 'Event Handling', duration: '12m', done: false },
  { id: 5, title: 'Conditional Rendering', duration: '8m', done: false },
  { id: 6, title: 'Lists and Keys', duration: '14m', done: false },
  { id: 7, title: 'Forms', duration: '20m', done: false },
  { id: 8, title: 'Lifting State Up', duration: '16m', done: false },
  { id: 9, title: 'Composition vs Inheritance', duration: '10m', done: false },
  { id: 10, title: 'Thinking in React', duration: '25m', done: false },
]

export const mockAssessments = [
  { id: 1, courseId: 1, title: "퀴즈 1",   due: "2025-10-20", status: "Upcoming" as const },
  { id: 2, courseId: 1, title: "중간고사",  due: "2025-10-25", status: "Upcoming" as const },
  { id: 3, courseId: 1, title: "과제 1",    due: "2025-10-27", status: "Upcoming" as const },
  { id: 4, courseId: 2, title: "퀴즈 1",   due: "2025-10-22", status: "Done" as const },
  { id: 5, courseId: 3, title: "기말고사",  due: "2025-11-01", status: "Upcoming" as const },
]

export const mockStudents = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', progress: 85, lastAccess: '2025-01-14' },
  { id: '2', name: 'Bob Wilson', email: 'bob@example.com', progress: 42, lastAccess: '2025-01-13' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', progress: 78, lastAccess: '2025-01-14' },
  { id: '4', name: 'David Brown', email: 'david@example.com', progress: 15, lastAccess: '2025-01-10' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', progress: 93, lastAccess: '2025-01-14' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', progress: 67, lastAccess: '2025-01-12' },
  { id: '7', name: 'Grace Taylor', email: 'grace@example.com', progress: 29, lastAccess: '2025-01-11' },
  { id: '8', name: 'Henry Chen', email: 'henry@example.com', progress: 56, lastAccess: '2025-01-13' },
]

export const mockTests = [
  { id: '1', title: 'React Basics Quiz', questionCount: 15, status: 'Published' as const },
  { id: '2', title: 'Component Lifecycle Test', questionCount: 20, status: 'Draft' as const },
  { id: '3', title: 'State Management Exam', questionCount: 25, status: 'Published' as const },
  { id: '4', title: 'Hooks Assessment', questionCount: 18, status: 'Draft' as const },
  { id: '5', title: 'Final Project Review', questionCount: 30, status: 'Published' as const },
]

export const mockCoInstructors = [
  { id: '1', name: 'Sarah Kim', role: 'Teaching Assistant' },
  { id: '2', name: 'Mike Johnson', role: 'Course Moderator' },
  { id: '3', name: 'Lisa Wang', role: 'Content Reviewer' },
]

// Helper functions
export const authenticateUser = (email: string, password: string): User | null => {
  // Mock authentication - 실제로는 API 호출
  const mockUsers = [
    { id: '1', username: 'instructor1', password: 'pass1234', email: 'instructor@example.com', role: 'instructor' as const, name: '김강사' },
    { id: '2', username: 'student1', password: 'pass1234', email: 'student@example.com', role: 'student' as const, name: '이수강' },
    { id: '3', username: 'admin', password: 'admin1234', email: 'admin@example.com', role: 'admin' as const, name: '관리자' },
    { id: '4', username: 'subadmin', password: 'sub123', email: 'subadmin@example.com', role: 'sub-admin' as const, name: '서브관리자' }
  ];

  const user = mockUsers.find(
    u => u.email === email && u.password === password
  );
  return user || null;
};

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id.toString() === id);
};

export const getLecturesByCourseId = (courseId: string): Lecture[] => {
  return mockLessons.map(lesson => ({
    id: lesson.id.toString(),
    courseId,
    title: lesson.title,
    description: '',
    duration: lesson.duration,
    order: lesson.id,
    completed: lesson.done
  }));
};

// ========================================
// 학생 페이지용 Mock 데이터
// ========================================

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: '중간고사',
    type: 'exam',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    startDate: '2024-11-15T09:00:00',
    endDate: '2024-11-15T11:00:00',
    description: '풀스택 과정 중간고사',
    isCompleted: false
  },
  {
    id: '2',
    title: '과제 1 제출',
    type: 'assignment',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    startDate: '2024-11-20T23:59:00',
    description: 'React 프로젝트 제출',
    isCompleted: true
  },
  {
    id: '3',
    title: '강의 공지',
    type: 'notice',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    startDate: '2024-11-10T10:00:00',
    description: '다음 주 강의 일정 변경 안내'
  }
]

export const mockGrades: GradeItem[] = [
  {
    id: '1',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    assignmentName: '과제 1',
    type: 'assignment',
    score: 85,
    maxScore: 100,
    percentage: 85,
    submittedAt: '2024-11-15T14:30:00',
    gradedAt: '2024-11-16T09:15:00',
    feedback: '잘 작성되었습니다. 코드 구조를 더 개선해보세요.'
  },
  {
    id: '2',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    assignmentName: '퀴즈 1',
    type: 'quiz',
    score: 18,
    maxScore: 20,
    percentage: 90,
    submittedAt: '2024-11-12T16:45:00',
    gradedAt: '2024-11-12T17:00:00'
  }
]

export const mockQuiz: Quiz = {
  id: '1',
  title: 'React 기초 퀴즈',
  courseId: '1',
  courseTitle: '(1회차) 풀스택 과정',
  questions: [
    {
      id: 'q1',
      question: 'React에서 컴포넌트를 정의하는 방법은?',
      type: 'multiple-choice',
      options: ['function Component()', 'class Component', 'const Component = () =>', '모두 맞음'],
      correctAnswer: 3,
      points: 5
    },
    {
      id: 'q2',
      question: 'useState는 클래스 컴포넌트에서만 사용할 수 있다.',
      type: 'true-false',
      correctAnswer: false,
      points: 3
    }
  ],
  timeLimit: 30,
  totalPoints: 8,
  dueDate: '2024-11-25T23:59:00'
}

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'React 공식 문서',
    type: 'link',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    url: 'https://react.dev',
    uploadedAt: '2024-11-01T10:00:00',
    description: 'React 공식 문서 링크'
  },
  {
    id: '2',
    title: '강의 슬라이드 1',
    type: 'slide',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    url: '/resources/slide1.pdf',
    fileSize: 2048000,
    uploadedAt: '2024-11-01T10:00:00',
    description: 'React 기초 강의 슬라이드'
  }
]

export const mockQnA: QnAItem[] = [
  {
    id: '1',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    question: 'useEffect의 의존성 배열에 대해 설명해주세요.',
    author: '김학생',
    authorId: 'student1',
    createdAt: '2024-11-15T14:30:00',
    answers: [
      {
        id: 'a1',
        content: 'useEffect의 의존성 배열은 두 번째 인자로 전달되며, 배열 안의 값들이 변경될 때만 effect가 실행됩니다.',
        author: '김강사',
        authorId: 'instructor1',
        createdAt: '2024-11-15T15:00:00'
      }
    ],
    tags: ['react', 'hooks']
  },
  {
    id: '2',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    question: 'React에서 state와 props의 차이점은 무엇인가요?',
    author: '이학생',
    authorId: 'student2',
    createdAt: '2024-11-16T10:20:00',
    answers: [
      {
        id: 'a2',
        content: 'state는 컴포넌트 내부에서 관리되는 데이터이고, props는 부모 컴포넌트에서 자식 컴포넌트로 전달되는 데이터입니다.',
        author: '김강사',
        authorId: 'instructor1',
        createdAt: '2024-11-16T11:00:00'
      }
    ],
    tags: ['react', 'state', 'props']
  },
  {
    id: '3',
    courseId: '1',
    courseTitle: '(1회차) 풀스택 과정',
    question: 'TypeScript에서 타입 정의는 어떻게 하나요?',
    author: '박학생',
    authorId: 'student3',
    createdAt: '2024-11-17T14:15:00',
    answers: [],
    tags: ['typescript', 'types']
  }
]

export const mockFAQ: FAQItem[] = [
  {
    id: '1',
    question: '강의를 다시 시청할 수 있나요?',
    answer: '네, 수강 기간 내에는 언제든지 다시 시청할 수 있습니다.',
    category: '강의'
  },
  {
    id: '2',
    question: '과제 제출은 어떻게 하나요?',
    answer: '과제 페이지에서 파일을 업로드하고 제출 버튼을 클릭하시면 됩니다.',
    category: '과제'
  }
]

// 알림 Mock 데이터

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'assignment',
    title: '새로운 과제가 등록되었습니다',
    message: '[파이썬 기초] 과제 1이 등록되었습니다. 제출 기한: 2025-11-05',
    createdAt: '2025-11-01T10:30:00',
    read: false,
    link: '/student/assignment/1',
    courseId: 1,
    courseTitle: '파이썬 기초'
  },
  {
    id: 2,
    type: 'exam',
    title: '시험이 등록되었습니다',
    message: '[자바스크립트 실전] 중간고사가 등록되었습니다. 응시 기한: 2025-11-10',
    createdAt: '2025-10-31T14:20:00',
    read: false,
    link: '/student/quiz/1',
    courseId: 2,
    courseTitle: '자바스크립트 실전'
  },
  {
    id: 3,
    type: 'question',
    title: '질문에 답변이 등록되었습니다',
    message: '[React 고급] 강의에 대한 질문에 강의자가 답변을 남겼습니다.',
    createdAt: '2025-10-31T09:45:00',
    read: false,
    link: '/student/course/3',
    courseId: 3,
    courseTitle: 'React 고급'
  },
  {
    id: 4,
    type: 'notice',
    title: '새로운 공지사항이 있습니다',
    message: '시스템 점검 안내가 등록되었습니다.',
    createdAt: '2025-10-30T09:00:00',
    read: false,
    link: '/student/notice'
  },
  {
    id: 5,
    type: 'assignment',
    title: '과제 제출 기한이 임박했습니다',
    message: '[데이터베이스 설계] 과제 2 제출 기한이 2일 남았습니다.',
    createdAt: '2025-10-30T15:20:00',
    read: false,
    link: '/student/assignment/2',
    courseId: 4,
    courseTitle: '데이터베이스 설계'
  },
  {
    id: 6,
    type: 'exam',
    title: '퀴즈 결과가 공개되었습니다',
    message: '[알고리즘 기초] 퀴즈 3의 결과를 확인하세요.',
    createdAt: '2025-10-29T16:30:00',
    read: false,
    link: '/student/quiz/3',
    courseId: 5,
    courseTitle: '알고리즘 기초'
  },
  {
    id: 7,
    type: 'announcement',
    title: '강의 일정이 변경되었습니다',
    message: '[웹 개발 입문] 다음 주 화요일 강의가 목요일로 변경되었습니다.',
    createdAt: '2025-10-29T11:00:00',
    read: false,
    link: '/student/course/6',
    courseId: 6,
    courseTitle: '웹 개발 입문'
  },
  {
    id: 8,
    type: 'assignment',
    title: '과제가 채점되었습니다',
    message: '[파이썬 기초] 과제 1이 채점되었습니다. 점수: 95/100',
    createdAt: '2025-10-28T14:15:00',
    read: false,
    link: '/student/assignment/1',
    courseId: 1,
    courseTitle: '파이썬 기초'
  },
  {
    id: 9,
    type: 'question',
    title: '새로운 질문이 등록되었습니다',
    message: '[React 고급] 강의 QnA에 새로운 질문이 등록되었습니다.',
    createdAt: '2025-10-28T10:45:00',
    read: false,
    link: '/student/course/3',
    courseId: 3,
    courseTitle: 'React 고급'
  },
  {
    id: 10,
    type: 'notice',
    title: '새로운 학습 자료가 추가되었습니다',
    message: '[자바스크립트 실전] 강의 자료실에 추가 자료가 업로드되었습니다.',
    createdAt: '2025-10-27T13:20:00',
    read: false,
    link: '/student/course/2',
    courseId: 2,
    courseTitle: '자바스크립트 실전'
  },
  {
    id: 11,
    type: 'exam',
    title: '기말고사 일정 안내',
    message: '[데이터베이스 설계] 기말고사가 11월 20일에 진행됩니다.',
    createdAt: '2025-10-27T09:30:00',
    read: false,
    link: '/student/course/4',
    courseId: 4,
    courseTitle: '데이터베이스 설계'
  },
  {
    id: 12,
    type: 'assignment',
    title: '새로운 과제가 등록되었습니다',
    message: '[알고리즘 기초] 과제 4가 등록되었습니다. 제출 기한: 2025-11-12',
    createdAt: '2025-10-26T16:00:00',
    read: false,
    link: '/student/assignment/4',
    courseId: 5,
    courseTitle: '알고리즘 기초'
  },
  {
    id: 13,
    type: 'announcement',
    title: '수강 인증서 발급 안내',
    message: '[웹 개발 입문] 강의 수료 후 인증서를 발급받을 수 있습니다.',
    createdAt: '2025-10-26T11:00:00',
    read: false,
    link: '/student/course/6',
    courseId: 6,
    courseTitle: '웹 개발 입문'
  },
  {
    id: 14,
    type: 'question',
    title: '질문에 답변이 등록되었습니다',
    message: '[파이썬 기초] 강의에 대한 질문에 강의자가 답변을 남겼습니다.',
    createdAt: '2025-10-25T15:30:00',
    read: false,
    link: '/student/course/1',
    courseId: 1,
    courseTitle: '파이썬 기초'
  },
  {
    id: 15,
    type: 'exam',
    title: '중간고사 결과가 공개되었습니다',
    message: '[자바스크립트 실전] 중간고사 결과를 확인하세요.',
    createdAt: '2025-10-25T10:00:00',
    read: false,
    link: '/student/quiz/1',
    courseId: 2,
    courseTitle: '자바스크립트 실전'
  },
  {
    id: 16,
    type: 'notice',
    title: '강의실 변경 안내',
    message: '[React 고급] 다음 주부터 강의실이 변경됩니다.',
    createdAt: '2025-10-24T14:20:00',
    read: false,
    link: '/student/course/3',
    courseId: 3,
    courseTitle: 'React 고급'
  },
  {
    id: 17,
    type: 'assignment',
    title: '과제 제출이 완료되었습니다',
    message: '[데이터베이스 설계] 과제 1이 성공적으로 제출되었습니다.',
    createdAt: '2025-10-24T09:15:00',
    read: false,
    link: '/student/assignment/1',
    courseId: 4,
    courseTitle: '데이터베이스 설계'
  },
  {
    id: 18,
    type: 'announcement',
    title: '새로운 강의가 개설되었습니다',
    message: '머신러닝 입문 강의가 새롭게 개설되었습니다. 지금 신청하세요!',
    createdAt: '2025-10-23T16:00:00',
    read: false,
    link: '/student/dashboard',
  },
  {
    id: 19,
    type: 'exam',
    title: '모의고사 일정 안내',
    message: '[알고리즘 기초] 모의고사가 11월 8일에 진행됩니다.',
    createdAt: '2025-10-23T11:30:00',
    read: false,
    link: '/student/course/5',
    courseId: 5,
    courseTitle: '알고리즘 기초'
  },
  {
    id: 20,
    type: 'question',
    title: '강의자가 답변을 남겼습니다',
    message: '[웹 개발 입문] 질문에 대한 답변이 등록되었습니다.',
    createdAt: '2025-10-22T15:45:00',
    read: false,
    link: '/student/course/6',
    courseId: 6,
    courseTitle: '웹 개발 입문'
  },
  {
    id: 21,
    type: 'assignment',
    title: '과제 재제출 안내',
    message: '[파이썬 기초] 과제 1에 대한 재제출이 가능합니다. 기한: 2025-11-15',
    createdAt: '2025-10-22T10:00:00',
    read: false,
    link: '/student/assignment/1',
    courseId: 1,
    courseTitle: '파이썬 기초'
  },
  {
    id: 22,
    type: 'notice',
    title: '휴강 안내',
    message: '[자바스크립트 실전] 11월 5일 강의는 휴강입니다.',
    createdAt: '2025-10-21T14:30:00',
    read: false,
    link: '/student/course/2',
    courseId: 2,
    courseTitle: '자바스크립트 실전'
  },
  {
    id: 23,
    type: 'exam',
    title: '추가 퀴즈가 등록되었습니다',
    message: '[React 고급] 보너스 퀴즈가 등록되었습니다. 응시 기한: 2025-11-07',
    createdAt: '2025-10-21T09:20:00',
    read: false,
    link: '/student/quiz/5',
    courseId: 3,
    courseTitle: 'React 고급'
  },
  {
    id: 24,
    type: 'announcement',
    title: '수강생 설문조사 안내',
    message: '강의 만족도 조사에 참여해주세요. 소정의 포인트를 드립니다.',
    createdAt: '2025-10-20T16:00:00',
    read: false,
    link: '/student/dashboard',
  },
  {
    id: 25,
    type: 'assignment',
    title: '팀 프로젝트 팀원 매칭 완료',
    message: '[데이터베이스 설계] 팀 프로젝트 팀원이 배정되었습니다.',
    createdAt: '2025-10-20T11:15:00',
    read: false,
    link: '/student/course/4',
    courseId: 4,
    courseTitle: '데이터베이스 설계'
  }
]

// 강의자용 알림 Mock 데이터
export const mockInstructorNotifications: Notification[] = [
  {
    id: 1,
    type: 'question',
    title: '새로운 질문이 등록되었습니다',
    message: '[파이썬 기초] 수강생이 새로운 질문을 등록했습니다.',
    createdAt: '2025-11-01T15:20:00',
    read: false,
    link: '/instructor/course/1/qna',
    courseId: 1,
    courseTitle: '파이썬 기초'
  },
  {
    id: 2,
    type: 'review',
    title: '강의 후기가 등록되었습니다',
    message: '[React 고급] 새로운 후기가 등록되었습니다. 평점: 4.5/5',
    createdAt: '2025-10-31T10:30:00',
    read: false,
    link: '/instructor/course/3/reviews',
    courseId: 3,
    courseTitle: 'React 고급'
  },
  {
    id: 3,
    type: 'assignment',
    title: '과제 제출이 있습니다',
    message: '[자바스크립트 실전] 과제 1에 5명의 수강생이 제출했습니다.',
    createdAt: '2025-10-31T14:00:00',
    read: false,
    link: '/instructor/course/2/assignments',
    courseId: 2,
    courseTitle: '자바스크립트 실전'
  },
  {
    id: 4,
    type: 'announcement',
    title: '시스템 공지사항',
    message: '새로운 기능이 추가되었습니다. 확인해주세요.',
    createdAt: '2025-10-30T09:00:00',
    read: false,
    link: '/student/notice'
  },
  {
    id: 5,
    type: 'question',
    title: '질문 답변 요청',
    message: '[데이터베이스 설계] 3개의 답변 대기 중인 질문이 있습니다.',
    createdAt: '2025-10-30T16:45:00',
    read: false,
    link: '/instructor/course/4/qna',
    courseId: 4,
    courseTitle: '데이터베이스 설계'
  },
  {
    id: 6,
    type: 'assignment',
    title: '과제 채점 요청',
    message: '[알고리즘 기초] 과제 2에 12명의 제출이 채점 대기 중입니다.',
    createdAt: '2025-10-29T11:20:00',
    read: false,
    link: '/instructor/course/5/assignments',
    courseId: 5,
    courseTitle: '알고리즘 기초'
  },
  {
    id: 7,
    type: 'review',
    title: '새로운 후기가 등록되었습니다',
    message: '[웹 개발 입문] 수강생이 후기를 남겼습니다. 평점: 5/5',
    createdAt: '2025-10-29T09:15:00',
    read: false,
    link: '/instructor/course/6/reviews',
    courseId: 6,
    courseTitle: '웹 개발 입문'
  },
  {
    id: 8,
    type: 'exam',
    title: '시험 응시 현황 알림',
    message: '[파이썬 기초] 중간고사에 25명 중 20명이 응시했습니다.',
    createdAt: '2025-10-28T16:30:00',
    read: false,
    link: '/instructor/course/1/exams',
    courseId: 1,
    courseTitle: '파이썬 기초'
  },
  {
    id: 9,
    type: 'question',
    title: '수강생이 질문을 남겼습니다',
    message: '[React 고급] "useState와 useReducer의 차이점" 질문이 등록되었습니다.',
    createdAt: '2025-10-28T14:50:00',
    read: false,
    link: '/instructor/course/3/qna',
    courseId: 3,
    courseTitle: 'React 고급'
  },
  {
    id: 10,
    type: 'assignment',
    title: '과제 제출 마감 임박',
    message: '[자바스크립트 실전] 과제 2 마감까지 1일 남았습니다. 미제출: 8명',
    createdAt: '2025-10-27T10:00:00',
    read: false,
    link: '/instructor/course/2/assignments',
    courseId: 2,
    courseTitle: '자바스크립트 실전'
  },
  {
    id: 11,
    type: 'announcement',
    title: '강의 업데이트 안내',
    message: '강의 콘텐츠 업로드 기능이 개선되었습니다.',
    createdAt: '2025-10-27T09:30:00',
    read: false,
    link: '/instructor/dashboard'
  },
  {
    id: 12,
    type: 'review',
    title: '부정적인 후기가 등록되었습니다',
    message: '[데이터베이스 설계] 평점 2점 후기가 등록되었습니다. 확인이 필요합니다.',
    createdAt: '2025-10-26T15:40:00',
    read: false,
    link: '/instructor/course/4/reviews',
    courseId: 4,
    courseTitle: '데이터베이스 설계'
  },
  {
    id: 13,
    type: 'question',
    title: '긴급 질문이 등록되었습니다',
    message: '[알고리즘 기초] 과제 관련 긴급 질문이 등록되었습니다.',
    createdAt: '2025-10-26T13:25:00',
    read: false,
    link: '/instructor/course/5/qna',
    courseId: 5,
    courseTitle: '알고리즘 기초'
  },
  {
    id: 14,
    type: 'assignment',
    title: '과제 재채점 요청',
    message: '[웹 개발 입문] 수강생이 과제 1에 대한 재채점을 요청했습니다.',
    createdAt: '2025-10-25T16:10:00',
    read: false,
    link: '/instructor/course/6/assignments',
    courseId: 6,
    courseTitle: '웹 개발 입문'
  },
  {
    id: 15,
    type: 'exam',
    title: '시험 일정 확인 요청',
    message: '[파이썬 기초] 기말고사 일정을 확정해주세요.',
    createdAt: '2025-10-25T11:00:00',
    read: false,
    link: '/instructor/course/1/exams',
    courseId: 1,
    courseTitle: '파이썬 기초'
  },
  {
    id: 16,
    type: 'review',
    title: '강의 평점이 업데이트되었습니다',
    message: '[React 고급] 현재 평균 평점: 4.7/5 (총 23개 후기)',
    createdAt: '2025-10-24T14:30:00',
    read: false,
    link: '/instructor/course/3/reviews',
    courseId: 3,
    courseTitle: 'React 고급'
  },
  {
    id: 17,
    type: 'question',
    title: '답변이 채택되었습니다',
    message: '[자바스크립트 실전] 수강생이 답변을 채택하고 감사 메시지를 남겼습니다.',
    createdAt: '2025-10-24T10:20:00',
    read: false,
    link: '/instructor/course/2/qna',
    courseId: 2,
    courseTitle: '자바스크립트 실전'
  },
  {
    id: 18,
    type: 'announcement',
    title: '새로운 수강생이 등록되었습니다',
    message: '[데이터베이스 설계] 5명의 새로운 수강생이 강의에 등록했습니다.',
    createdAt: '2025-10-23T15:50:00',
    read: false,
    link: '/instructor/course/4/students',
    courseId: 4,
    courseTitle: '데이터베이스 설계'
  },
  {
    id: 19,
    type: 'assignment',
    title: '과제 표절 의심 알림',
    message: '[알고리즘 기초] 과제 3에서 유사도 높은 제출물이 감지되었습니다.',
    createdAt: '2025-10-23T13:15:00',
    read: false,
    link: '/instructor/course/5/assignments',
    courseId: 5,
    courseTitle: '알고리즘 기초'
  },
  {
    id: 20,
    type: 'exam',
    title: '시험 결과 분석 완료',
    message: '[웹 개발 입문] 퀴즈 1 결과 분석이 완료되었습니다. 평균: 78점',
    createdAt: '2025-10-22T16:40:00',
    read: false,
    link: '/instructor/course/6/results',
    courseId: 6,
    courseTitle: '웹 개발 입문'
  },
  {
    id: 21,
    type: 'question',
    title: '질문 활동이 증가했습니다',
    message: '[파이썬 기초] 이번 주 질문 수가 지난 주 대비 50% 증가했습니다.',
    createdAt: '2025-10-22T11:30:00',
    read: false,
    link: '/instructor/course/1/qna',
    courseId: 1,
    courseTitle: '파이썬 기초'
  },
  {
    id: 22,
    type: 'review',
    title: '후기 답변 요청',
    message: '[React 고급] 3개의 후기가 강의자 답변을 기다리고 있습니다.',
    createdAt: '2025-10-21T14:20:00',
    read: false,
    link: '/instructor/course/3/reviews',
    courseId: 3,
    courseTitle: 'React 고급'
  },
  {
    id: 23,
    type: 'assignment',
    title: '우수 과제 발견',
    message: '[자바스크립트 실전] 과제 1에서 만점 과제가 3개 제출되었습니다.',
    createdAt: '2025-10-21T09:45:00',
    read: false,
    link: '/instructor/course/2/assignments',
    courseId: 2,
    courseTitle: '자바스크립트 실전'
  },
  {
    id: 24,
    type: 'announcement',
    title: '수료 기준 설정 요청',
    message: '[데이터베이스 설계] 강의 수료 기준을 설정해주세요.',
    createdAt: '2025-10-20T16:00:00',
    read: false,
    link: '/instructor/course/4/info',
    courseId: 4,
    courseTitle: '데이터베이스 설계'
  },
  {
    id: 25,
    type: 'exam',
    title: '시험 문제 피드백',
    message: '[알고리즘 기초] 퀴즈 2에 대한 수강생 피드백이 도착했습니다.',
    createdAt: '2025-10-20T12:30:00',
    read: false,
    link: '/instructor/course/5/exams',
    courseId: 5,
    courseTitle: '알고리즘 기초'
  }
]
