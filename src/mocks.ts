// Enhanced types from com/lms-test
import type { 
  User, 
  Course, 
  Lecture, 
  Notice, 
  CalendarEvent, 
  GradeItem, 
  Quiz, 
  QuizQuestion, 
  Resource, 
  QnAItem, 
  QnAAnswer, 
  FAQItem 
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
export const authenticateUser = (username: string, password: string): User | null => {
  // Mock authentication - 실제로는 API 호출
  const mockUsers = [
    { id: '1', username: 'instructor1', password: 'pass1234', email: 'instructor@example.com', role: 'instructor' as const, name: '김강사' },
    { id: '2', username: 'student1', password: 'pass1234', email: 'student@example.com', role: 'student' as const, name: '이수강' },
    { id: '3', username: 'admin', password: 'admin1234', email: 'admin@example.com', role: 'admin' as const, name: '관리자' },
    { id: '4', username: 'subadmin', password: 'sub123', email: 'subadmin@example.com', role: 'sub-admin' as const, name: '서브관리자' }
  ];
  
  const user = mockUsers.find(
    u => u.username === username && u.password === password
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
    isSolved: true,
    answers: [
      {
        id: 'a1',
        content: 'useEffect의 의존성 배열은 두 번째 인자로 전달되며, 배열 안의 값들이 변경될 때만 effect가 실행됩니다.',
        author: '김강사',
        authorId: 'instructor1',
        createdAt: '2024-11-15T15:00:00',
        isAccepted: true,
        upvotes: 5
      }
    ],
    tags: ['react', 'hooks']
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