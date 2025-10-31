export type Assignment = {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  dueDate: string; // ISO date
  maxScore?: number;
  instructions?: string[];
  allowedFileTypes?: string[];
  maxFileSize?: number; // MB
  submissions: number;
  total: number;
  status: "진행 중" | "마감";
};

export type AssignmentSubmission = {
  id: number;
  assignmentId: number;
  studentName: string;
  submittedAt: string; // ISO datetime
  status: "제출" | "지각";
  score?: number;
  files?: { name: string; size: number; url: string }[];
  feedback?: string;
};






