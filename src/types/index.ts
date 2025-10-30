// ========================================
// LMS 프로젝트 통합 타입 정의
// ========================================

// ========================================
// 기본 사용자 및 인증 관련 타입
// ========================================

export interface User {
  id: string
  username: string
  password: string
  email: string
  role: 'instructor' | 'student' | 'admin' | 'sub-admin'
  name: string
  phone?: string
  avatar?: string | null
}

export interface UserStats {
  totalCourses: number
  inProgress: number
  avgProgress: number
}

// ========================================
// 강의 및 교육 관련 타입
// ========================================

export interface Course {
  id: string | number
  title: string
  instructor: string
  instructorId?: string
  instructorEmail?: string
  thumbnail?: string
  image?: string
  description?: string
  progress?: number
  totalLectures?: number
  completedLectures?: number
  lastAccessed?: string
  // 강사용 필드
  status?: '초안' | '비공개' | '공개'
  students?: number
  rating?: number
  lastEdited?: string
  myRole?: string // 공동 제작 강좌의 경우
}

export interface Lecture {
  id: string | number
  courseId: string | number
  title: string
  description: string
  videoUrl?: string
  duration: string
  order: number
  completed: boolean
}

export interface Assessment {
  id: string | number
  courseId: string | number
  title: string
  description?: string
  dueDate?: string
  due?: string
  points?: number
  status: 'Upcoming' | 'Done' | 'completed' | 'pending'
}

// ========================================
// 공지사항 관련 타입
// ========================================

export interface Notice {
  id: number
  title: string
  date: string
  content: string
}

// ========================================
// 관리자 관련 타입
// ========================================

export interface SubAdmin {
  id: number
  name: string
  email: string
  role: string
  createdDate: string
  status: 'active' | 'inactive'
}

export interface PendingInstructor {
  id: number
  name: string
  email: string
  specialization: string
  appliedDate: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface ApprovedInstructor {
  id: number
  name: string
  email: string
  specialization: string
  approvedDate: string
  status: 'active' | 'inactive'
}

export interface Student {
  id: number
  name: string
  email: string
  course: string
  enrolledDate: string
  progress: number
}

// ========================================
// UI 컴포넌트 관련 타입
// ========================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export interface SectionProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  label?: string
}


// ========================================
// 테이블 관련 타입
// ========================================

export interface Column<T> {
  key: keyof T | 'actions'
  label: string
  render?: (value: unknown, item: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
}

// ========================================
// 모달 관련 타입
// ========================================

export interface ModalBaseProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
}


// ========================================
// 비디오 사이드바 관련 타입
// ========================================
// VideoSideNavProps는 VideoSideNav.tsx에서 직접 정의됨

// ========================================
// 폼 관련 타입
// ========================================

export interface FormData {
  name: string
  email: string
  password: string
  confirmPassword?: string
  phone?: string
  job?: string
  language?: string
}

// ========================================
// 활동 및 통계 관련 타입
// ========================================

export interface Activity {
  id: number
  type: string
  message: string
  time: string
  status: 'completed' | 'pending'
}

export interface Stats {
  totalSubAdmins?: number
  totalInstructors: number
  pendingApprovals: number
  totalCourses: number
  totalStudents: number
  systemHealth?: number
  contentUploads?: number
}

// ========================================
// 테스트 및 평가 관련 타입
// ========================================

export interface Test {
  id: string
  title: string
  questionCount: number
  status: 'Published' | 'Draft'
}

export interface CoInstructor {
  id: number
  name: string
  email: string
  role: 'Teaching Assistant' | 'Course Moderator' | 'Content Reviewer' | 'Guest Lecturer'
}

// ========================================
// 유틸리티 타입
// ========================================

export type UserRole = 'instructor' | 'student' | 'admin' | 'sub-admin'
export type CourseStatus = 'active' | 'inactive' | 'pending'
export type AssessmentStatus = 'Upcoming' | 'Done' | 'completed' | 'pending'
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

// ========================================
// 컴포넌트별 Props 타입
// ========================================

export interface UserInfoCardProps {
  user: User
}


// ========================================
// 강의 콘텐츠 편집 관련 타입
// ========================================

export interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'video' | 'pdf' | 'code' | 'markdown'
  content: string
  metadata?: {
    fileName?: string
    fileSize?: number
    duration?: number
    dimensions?: { width: number; height: number }
    language?: string
  }
  order: number
}

export interface LectureContent {
  id: string
  title: string
  description?: string
  blocks: ContentBlock[]
  completionCriteria?: {
    enabled: boolean
    type: 'time' | 'interaction' | 'quiz'
    value?: number
  }
  allowDownload: boolean
  order: number
}

export interface CurriculumModule {
  id: string
  title: string
  lectures: LectureContent[]
  order: number
  isExpanded: boolean
}


// ========================================
// 학생 페이지 관련 타입
// ========================================

export interface CalendarEvent {
  id: string
  title: string
  type: 'exam' | 'assignment' | 'notice'
  courseId: string
  courseTitle: string
  startDate: string
  endDate?: string
  description?: string
  isCompleted?: boolean
}

export interface GradeItem {
  id: string
  courseId: string
  courseTitle: string
  assignmentName: string
  type: 'exam' | 'assignment' | 'quiz'
  score: number
  maxScore: number
  percentage: number
  submittedAt: string
  gradedAt: string
  feedback?: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options?: string[]
  correctAnswer: string | number
  points: number
  timeLimit?: number // in seconds
  explanation?: string
}

export interface Quiz {
  id: string
  title: string
  courseId: string
  courseTitle: string
  questions: QuizQuestion[]
  timeLimit: number // total time in minutes
  totalPoints: number
  dueDate: string
  isCompleted?: boolean
  score?: number
}

export interface Resource {
  id: string
  title: string
  type: 'pdf' | 'slide' | 'code' | 'link'
  courseId: string
  courseTitle: string
  url: string
  fileSize?: number
  uploadedAt: string
  description?: string
}

export interface QnAItem {
  id: string
  courseId: string
  courseTitle: string
  question: string
  author: string
  authorId: string
  createdAt: string
  answers: QnAAnswer[]
  tags?: string[]
}

export interface QnAAnswer {
  id: string
  content: string
  author: string
  authorId: string
  createdAt: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  isExpanded?: boolean
}
