import type { CurriculumModule } from '../types'

// 공통 교육과정 데이터
export const curriculumData: CurriculumModule[] = [
  {
    id: 'module_1',
    title: '오리엔테이션',
    lectures: [
      {
        id: 'lecture_1',
        title: '강의 소개 및 환경 설정',
        description: '풀스택 과정 소개 및 학습 계획',
        blocks: [
          {
            id: 'block_1',
            type: 'text',
            content: '<h2>대상</h2><p>풀스택 개발자 취업을 준비하는 예비 개발자</p><h2>핵심 정보</h2><ul><li>프론트엔드, 백엔드, 클라우드, AI 기술을 포괄하는 실무 풀스택 개발자 양성</li><li>현장에 즉시 투입 가능한 전문가로 성장할 수 있도록 설계</li></ul>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 0
      }
    ],
    order: 0,
    isExpanded: true
  },
  {
    id: 'module_2',
    title: '권혁진_풀스택',
    lectures: [
      {
        id: 'lecture_2',
        title: '환경설정/기본문법/조건문/반복문',
        description: '환경설정 및 기본 문법 학습',
        blocks: [
          {
            id: 'block_2',
            type: 'text',
            content: '<h2>환경설정</h2><p>개발 환경 구성 및 기본 문법</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 0
      },
      {
        id: 'lecture_3',
        title: '(코드)함수/배열/객체',
        description: '함수, 배열, 객체 개념 및 실습',
        blocks: [
          {
            id: 'block_3',
            type: 'text',
            content: '<h2>함수, 배열, 객체</h2><p>코드 실습을 통한 이해</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 1
      },
      {
        id: 'lecture_4',
        title: '함수/배열/객체/DOM',
        description: 'DOM 조작과 실습',
        blocks: [
          {
            id: 'block_4',
            type: 'text',
            content: '<h2>DOM 조작</h2><p>문서 객체 모델 다루기</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 2
      },
      {
        id: 'lecture_5',
        title: '(코드)DOM',
        description: 'DOM 조작 코드 실습',
        blocks: [
          {
            id: 'block_5',
            type: 'text',
            content: '<h2>DOM 코드 실습</h2><p>실제 코드로 DOM 조작하기</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 3
      },
      {
        id: 'lecture_6',
        title: '이벤트 처리',
        description: '이벤트 처리 방법',
        blocks: [
          {
            id: 'block_6',
            type: 'text',
            content: '<h2>이벤트 처리</h2><p>사용자 이벤트 처리하기</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 4
      },
      {
        id: 'lecture_7',
        title: '웹 API',
        description: '웹 API 활용',
        blocks: [
          {
            id: 'block_7',
            type: 'text',
            content: '<h2>웹 API</h2><p>외부 API 연동하기</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 5
      },
      {
        id: 'lecture_8',
        title: 'HTML/CSS',
        description: 'HTML과 CSS 기초',
        blocks: [
          {
            id: 'block_8',
            type: 'text',
            content: '<h2>HTML/CSS 기초</h2><p>웹 페이지 구조와 스타일</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 6
      }
    ],
    order: 1,
    isExpanded: false
  },
  {
    id: 'module_3',
    title: '정보통신개론 및 IT 기본 실습',
    lectures: [
      {
        id: 'lecture_9',
        title: 'IT 산업 역사와 웹 개발 현황',
        description: 'IT 산업 개요',
        blocks: [
          {
            id: 'block_9',
            type: 'text',
            content: '<h2>IT 산업 역사</h2><p>IT 산업의 발전과 웹 개발의 현재</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 0
      },
      {
        id: 'lecture_10',
        title: '250926 영상강의',
        description: '영상 강의',
        blocks: [
          {
            id: 'block_10',
            type: 'text',
            content: '<h2>영상 강의</h2><p>추가 영상 강의 내용</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 1
      },
      {
        id: 'lecture_11',
        title: 'Github 대문꾸미기',
        description: 'Github 프로필 관리',
        blocks: [
          {
            id: 'block_11',
            type: 'text',
            content: '<h2>Github 프로필</h2><p>Github 프로필 페이지 꾸미기</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 2
      },
      {
        id: 'lecture_12',
        title: '알고리즘 연습방법',
        description: '알고리즘 학습 방법',
        blocks: [
          {
            id: 'block_12',
            type: 'text',
            content: '<h2>알고리즘 학습</h2><p>효과적인 알고리즘 연습 방법</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 3
      },
      {
        id: 'lecture_13',
        title: 'Github 와 백준허브 연동방법',
        description: 'Github와 백준 연동',
        blocks: [
          {
            id: 'block_13',
            type: 'text',
            content: '<h2>Github 백준 연동</h2><p>백준 문제 풀이 자동 업로드</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 4
      },
      {
        id: 'lecture_14',
        title: '온라인 타자연습',
        description: '타자 연습',
        blocks: [
          {
            id: 'block_14',
            type: 'text',
            content: '<h2>타자 연습</h2><p>온라인 타자 연습 방법</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 5
      }
    ],
    order: 2,
    isExpanded: false
  },
  {
    id: 'module_4',
    title: '리엑트 NEW',
    lectures: [
      {
        id: 'lecture_15',
        title: '타입스크립트',
        description: 'TypeScript 기초',
        blocks: [
          {
            id: 'block_15',
            type: 'text',
            content: '<h2>TypeScript</h2><p>타입 안전성을 제공하는 JavaScript</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 0
      },
      {
        id: 'lecture_16',
        title: '타입스크립트 기초 연습문제',
        description: 'TypeScript 실습',
        blocks: [
          {
            id: 'block_16',
            type: 'text',
            content: '<h2>TypeScript 연습</h2><p>기초 문제 풀이</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 1
      },
      {
        id: 'lecture_17',
        title: 'ES6',
        description: 'ES6 문법',
        blocks: [
          {
            id: 'block_17',
            type: 'text',
            content: '<h2>ES6</h2><p>모던 JavaScript 문법</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 2
      },
      {
        id: 'lecture_18',
        title: '리엑트 설명',
        description: 'React 소개',
        blocks: [
          {
            id: 'block_18',
            type: 'text',
            content: '<h2>React</h2><p>React 라이브러리 개요</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 3
      },
      {
        id: 'lecture_19',
        title: '컴포넌트 기초',
        description: 'React 컴포넌트',
        blocks: [
          {
            id: 'block_19',
            type: 'text',
            content: '<h2>컴포넌트</h2><p>React 컴포넌트 기초</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 4
      },
      {
        id: 'lecture_20',
        title: 'JSX 문법',
        description: 'JSX 사용법',
        blocks: [
          {
            id: 'block_20',
            type: 'text',
            content: '<h2>JSX</h2><p>JavaScript XML 문법</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 5
      },
      {
        id: 'lecture_21',
        title: 'Props와 State',
        description: 'Props와 State 개념',
        blocks: [
          {
            id: 'block_21',
            type: 'text',
            content: '<h2>Props와 State</h2><p>컴포넌트 데이터 관리</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 6
      },
      {
        id: 'lecture_22',
        title: '이벤트 처리',
        description: 'React 이벤트',
        blocks: [
          {
            id: 'block_22',
            type: 'text',
            content: '<h2>이벤트</h2><p>React 이벤트 처리</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 7
      },
      {
        id: 'lecture_23',
        title: '조건부 렌더링',
        description: '조건부 렌더링',
        blocks: [
          {
            id: 'block_23',
            type: 'text',
            content: '<h2>조건부 렌더링</h2><p>조건에 따른 UI 표시</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 8
      },
      {
        id: 'lecture_24',
        title: '리스트와 키',
        description: '리스트 렌더링',
        blocks: [
          {
            id: 'block_24',
            type: 'text',
            content: '<h2>리스트</h2><p>리스트와 키 활용</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 9
      },
      {
        id: 'lecture_25',
        title: '폼 처리',
        description: '폼 관리',
        blocks: [
          {
            id: 'block_25',
            type: 'text',
            content: '<h2>폼</h2><p>React 폼 처리</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 10
      },
      {
        id: 'lecture_26',
        title: '라이프사이클',
        description: 'React 라이프사이클',
        blocks: [
          {
            id: 'block_26',
            type: 'text',
            content: '<h2>라이프사이클</h2><p>컴포넌트 생명주기</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 11
      }
    ],
    order: 3,
    isExpanded: false
  }
]

// 교육과정 데이터를 업데이트하는 함수
export const updateCurriculumData = (newData: CurriculumModule[]) => {
  // 실제로는 API 호출이나 상태 관리 라이브러리를 사용
  // 여기서는 간단히 로컬 스토리지에 저장
  localStorage.setItem('curriculumData', JSON.stringify(newData))
}

// 교육과정 데이터를 가져오는 함수 (항상 동일한 mock 데이터 반환)
export const getCurriculumData = (): CurriculumModule[] => {
  // 나중에 실제 API 호출로 교체 가능
  // 현재는 항상 동일한 mock 데이터 반환
  const stored = localStorage.getItem('curriculumData')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      // 교육과정 데이터 파싱 오류 처리
    }
  }
  return curriculumData
}

// CourseDetail용 변환 함수 (CurriculumModule → CurriculumItem)
export const getCurriculumForCourseDetail = () => {
  const modules = getCurriculumData()
  return modules.map((module, index) => {
    const lessons = module.lectures.map((lecture, lessonIndex) => ({
      id: `${index + 1}-${lessonIndex + 1}`,
      title: lecture.title,
      completed: false, // 임시: 실제로는 사용자 진행 데이터 필요
      date: undefined,
      isLastViewed: index === 3 && lessonIndex === 0 // 리엑트 NEW의 첫 강의
    }))

    return {
      id: String(index + 1),
      title: module.title,
      completed: 0, // 임시
      total: lessons.length,
      expanded: false,
      lessons
    }
  })
}

// EditCurriculum용 변환 함수 (CurriculumModule → Curriculum)
export const getCurriculumForEdit = () => {
  const modules = getCurriculumData()
  return modules.map((module, index) => {
    const lessons = module.lectures.map((lecture, lessonIndex) => ({
      id: `lesson-${lecture.id}`,
      title: lecture.title,
      type: 'file' as const,
      completed: index === 3 && lessonIndex === 0 ? 1 : undefined, // 임시
      total: 1,
      isSelected: index === 3 && lessonIndex === 0,
      studyDate: index === 1 && lessonIndex === 0 ? '25. 10. 13.' : undefined
    }))

    return {
      id: `curriculum-${index + 1}`,
      title: module.title,
      lessons
    }
  })
}
