import type { CurriculumModule, LectureContent } from '../types'

// 공통 교육과정 데이터
export const curriculumData: CurriculumModule[] = [
  {
    id: 'module_1',
    title: '01 오리엔테이션',
    lectures: [
      {
        id: 'lecture_1',
        title: '강의 소개',
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
    title: '02 풀스택 개발',
    lectures: [
      {
        id: 'lecture_2',
        title: '풀스택 개발 개요',
        description: '풀스택 개발의 기본 개념과 기술 스택',
        blocks: [
          {
            id: 'block_2',
            type: 'text',
            content: '<h2>풀스택 개발이란?</h2><p>프론트엔드와 백엔드를 모두 다룰 수 있는 개발자</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 0
      },
      {
        id: 'lecture_3',
        title: '프론트엔드 기초',
        description: 'HTML, CSS, JavaScript 기초',
        blocks: [
          {
            id: 'block_3',
            type: 'text',
            content: '<h2>프론트엔드 기술</h2><p>사용자 인터페이스를 만드는 기술</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 1
      },
      {
        id: 'lecture_4',
        title: '백엔드 기초',
        description: '서버 개발과 데이터베이스',
        blocks: [
          {
            id: 'block_4',
            type: 'text',
            content: '<h2>백엔드 기술</h2><p>서버와 데이터베이스를 다루는 기술</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 2
      },
      {
        id: 'lecture_5',
        title: '데이터베이스 설계',
        description: '데이터베이스 모델링과 설계',
        blocks: [
          {
            id: 'block_5',
            type: 'text',
            content: '<h2>데이터베이스 설계</h2><p>효율적인 데이터 저장과 관리</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 3
      },
      {
        id: 'lecture_6',
        title: 'API 개발',
        description: 'RESTful API 설계와 구현',
        blocks: [
          {
            id: 'block_6',
            type: 'text',
            content: '<h2>API 개발</h2><p>프론트엔드와 백엔드를 연결하는 인터페이스</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 4
      },
      {
        id: 'lecture_7',
        title: '클라우드 배포',
        description: 'AWS, Azure를 이용한 배포',
        blocks: [
          {
            id: 'block_7',
            type: 'text',
            content: '<h2>클라우드 배포</h2><p>실제 서비스로 배포하기</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 5
      },
      {
        id: 'lecture_8',
        title: '프로젝트 실습',
        description: '실제 프로젝트를 통한 실습',
        blocks: [
          {
            id: 'block_8',
            type: 'text',
            content: '<h2>프로젝트 실습</h2><p>실제 프로젝트를 통한 종합 학습</p>',
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
    title: '03 프론트엔드 심화',
    lectures: [
      {
        id: 'lecture_9',
        title: 'React 기초',
        description: 'React 라이브러리 기초',
        blocks: [
          {
            id: 'block_9',
            type: 'text',
            content: '<h2>React 기초</h2><p>컴포넌트 기반 UI 라이브러리</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 0
      },
      {
        id: 'lecture_10',
        title: 'TypeScript',
        description: '타입스크립트를 이용한 개발',
        blocks: [
          {
            id: 'block_10',
            type: 'text',
            content: '<h2>TypeScript</h2><p>타입 안전성을 제공하는 JavaScript</p>',
            order: 0
          }
        ],
        allowDownload: true,
        order: 1
      }
    ],
    order: 2,
    isExpanded: false
  }
]

// 교육과정 데이터를 업데이트하는 함수
export const updateCurriculumData = (newData: CurriculumModule[]) => {
  // 실제로는 API 호출이나 상태 관리 라이브러리를 사용
  console.log('교육과정 데이터 업데이트:', newData)
  // 여기서는 간단히 로컬 스토리지에 저장
  localStorage.setItem('curriculumData', JSON.stringify(newData))
}

// 교육과정 데이터를 가져오는 함수
export const getCurriculumData = (): CurriculumModule[] => {
  // 실제로는 API 호출이나 상태 관리 라이브러리를 사용
  const stored = localStorage.getItem('curriculumData')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error('교육과정 데이터 파싱 오류:', error)
    }
  }
  return curriculumData
}













