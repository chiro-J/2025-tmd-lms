// 강좌 데이터 - 실제 API 연동 시 이 파일을 수정
import type { Course } from '../types'

// 내가 개설한 강좌 데이터
export const myCourses: Course[] = [
  {
    id: '1',
    title: '(1회차) 풀스택 과정',
    status: '초안',
    students: 0,
    rating: 0,
    lastEdited: '방금 전',
    instructor: '김강사',
    image: '/photo/ccc.jpg' // 나중에 강의자가 직접 올린 사진으로 교체 예정
  }
]

// 공동 제작 중인 강좌 데이터
export const jointCourses: Course[] = [
  {
    id: '2',
    title: '풀스택 과정',
    status: '초안',
    students: 0,
    rating: 0,
    lastEdited: '방금 전',
    instructor: '김강사',
    myRole: '공동 강의자',
    image: '/photo/ccc.jpg' // 나중에 강의자가 직접 올린 사진으로 교체 예정
  }
]

// 강좌 ID로 강좌 찾기
export const getCourseById = (id: string): Course | undefined => {
  const allCourses = [...myCourses, ...jointCourses]
  return allCourses.find(course => course.id === id)
}

// 강좌 상태별 필터링
export const getCoursesByStatus = (status: Course['status']) => {
  const allCourses = [...myCourses, ...jointCourses]
  return allCourses.filter(course => course.status === status)
}

// 강좌 검색
export const searchCourses = (query: string) => {
  const allCourses = [...myCourses, ...jointCourses]
  return allCourses.filter(course =>
    course.title.toLowerCase().includes(query.toLowerCase()) ||
    course.instructor.toLowerCase().includes(query.toLowerCase())
  )
}
