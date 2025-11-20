export type Assignment = {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  dueDate: string; // ISO date
  maxScore?: number;
  instructions?: string[];
  contentBlocks?: any[]; // 이미지, PDF, 동영상 등 콘텐츠 블록
  submissions: number;
  total: number;
  status: "진행 중" | "마감";
};

export type AssignmentSubmission = {
  id: number;
  assignmentId: number;
  studentName: string;
  submittedAt: string; // ISO datetime
  status: "제출" | "지연" | "미제출";
  score?: number;
  files?: { name: string; size: number; url: string }[];
  feedback?: string;
};






