import type { CurriculumModule, Lesson } from '../core/api/curriculum';

export interface CurriculumItem {
  id: string;
  title: string;
  completed: number;
  total: number;
  expanded: boolean;
  lessons: {
    id: string;
    title: string;
    completed: boolean;
    date?: string;
    isLastViewed?: boolean;
  }[];
}

/**
 * API 응답을 CourseDetail 형식으로 변환
 */
export const transformApiToDetailFormat = (modules: CurriculumModule[]): CurriculumItem[] => {
  return modules.map((module, index) => {
    const lessons = (module.lessons || []).map((lesson, lessonIndex) => ({
      id: `${module.id}-${lesson.id}`,
      title: lesson.title,
      completed: false, // 임시: 실제로는 사용자 진행 데이터 필요
      date: undefined,
      isLastViewed: false,
    }));

    return {
      id: String(module.id),
      title: module.title,
      completed: 0, // 임시: 실제로는 사용자 진행 데이터 필요
      total: lessons.length,
      expanded: false,
      lessons,
    };
  });
};

/**
 * EditCurriculum 페이지용 인터페이스
 */
export interface EditCurriculumItem {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    type: 'folder' | 'file';
    completed?: number;
    total?: number;
    children?: any[];
    isNew?: boolean;
    isSelected?: boolean;
    studyDate?: string;
  }[];
}

/**
 * API 응답을 EditCurriculum 형식으로 변환
 */
export const transformApiToEditFormat = (modules: CurriculumModule[]): EditCurriculumItem[] => {
  return modules.map((module) => ({
    id: `curriculum-${module.id}`, // DB id를 문자열로 변환
    title: module.title,
    lessons: (module.lessons || []).map((lesson) => ({
      id: `lesson-${lesson.id}`, // DB id를 문자열로 변환
      title: lesson.title,
      type: 'file' as const,
      description: lesson.description,
      order: lesson.order,
    })),
  }));
};

