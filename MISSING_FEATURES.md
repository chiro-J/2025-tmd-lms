# 🚨 미구현 기능 체크리스트

## 1. 강의 자료 관리 (High Priority)

### 현재 상태
- ❌ 학생 화면에 "강의 자료" 탭 있음 (`src/pages/student/CourseDetail.tsx`)
- ❌ 강사는 강의 자료 업로드 페이지 없음
- ❌ 데이터만 mock으로 존재

### 필요한 작업
- [ ] 강사용 강의 자료 관리 페이지 생성
  - 위치: `src/pages/instructor/ResourceManagement.tsx`
  - 라우트: `/instructor/course/:id/resources`
  - 기능: 파일 업로드, 분류, 삭제
  - 연동: CourseSidebar에 메뉴 추가

### DB 연동
- 테이블: `course_resources`
- 필드: id, course_id, title, type, file_url, created_at

---

## 2. Q&A 관리 (High Priority)

### 현재 상태
- ❌ 학생 화면에 "Q&A" 탭 있음 (`src/pages/student/CourseDetail.tsx`)
- ❌ 강사용 Q&A 관리 페이지 없음
- ❌ 데이터만 mock으로 존재

### 필요한 작업
- [ ] 강사용 Q&A 관리 페이지 생성
  - 위치: `src/pages/instructor/QnAManagement.tsx`
  - 라우트: `/instructor/course/:id/qna`
  - 기능: Q&A 목록, 답변 작성, 필터링
  - 연동: CourseSidebar에 메뉴 추가

### DB 연동
- 테이블: `course_qa`
- 필드: id, course_id, student_id, question, answer, status, created_at

---

## 3. 강좌 정보 편집 (Medium Priority)

### 현재 상태
- ❌ 학생 화면에 "강좌 정보" 탭 있음
- ❌ 버튼은 있지만 페이지 내용 없음
- 🔴 강사가 강좌 정보를 편집하는 화면 필요

### 필요한 작업
- [ ] 강사용 강좌 정보 편집 페이지
  - 위치: `src/pages/instructor/CourseInfoEdit.tsx`
  - 라우트: `/instructor/course/:id/info`
  - 기능: 강좌 설명, 카테고리, 태그 수정
  - 연동: CourseSidebar에 메뉴 추가

### DB 연동
- 테이블: `courses` (기존)
- 필드: description, category1, category2, tags

---

## 4. 시험/과제 관리 (Already Implemented ✅)

### 현재 상태
- ✅ ExamManagement.tsx 존재
- ✅ 학생 시험 응시 페이지 존재
- ⚠️ 실제 연동 확인 필요

### 확인 사항
- [ ] 시험 생성 → 학생 화면 동기화 확인
- [ ] 과제 제출 → 강사 화면 표시 확인

---

## 5. 공지 관리 (Already Implemented ✅)

### 현재 상태
- ✅ NoticeManagement.tsx 존재
- ✅ 빈 화면만 있음
- ⚠️ 기능 구현 필요

### 필요한 작업
- [ ] 공지 작성 폼 구현
- [ ] 공지 목록 표시
- [ ] 강사가 작성한 공지 → 학생 화면 동기화

### DB 연동
- 테이블: `notices`
- 필드: id, course_id, title, content, priority, created_at

---

## 6. CourseSidebar 메뉴 업데이트 필요

### 현재 메뉴
```tsx
<nav>
  <Link to="home">강좌 홈</Link>
  <Link to="students">학생 관리</Link>
  <Link to="exams">시험 관리</Link>
  <Link to="community">커뮤니티</Link>
  <Link to="settings">설정</Link>
</nav>
```

### 추가 필요한 메뉴
- [ ] 강의 자료 관리
- [ ] Q&A 관리
- [ ] 강좌 정보 편집

---

## 📋 우선순위별 작업 계획

### Phase 1: 급한 것 (1주)
1. ✅ ResourceManagement 페이지 생성
2. ✅ QnAManagement 페이지 생성
3. ✅ CourseSidebar 메뉴 추가
4. ✅ DB 스키마 설계

### Phase 2: 중요 기능 (2주)
5. ✅ CourseInfoEdit 페이지 생성
6. ✅ NoticeManagement 기능 구현
7. ✅ 전체 페이지간 데이터 동기화 테스트

### Phase 3: 개선 (3주)
8. ✅ 실제 파일 업로드 기능
9. ✅ 이미지/PDF 미리보기
10. ✅ 검색 및 필터링 고도화

---

## 🔍 누락된 기능 상세

### 1. ResourceManagement.tsx (미작성)
```tsx
// src/pages/instructor/ResourceManagement.tsx
// 기능:
// - 강의 자료 목록 (카드 그리드)
// - 파일 업로드 버튼 (로컬 파일, 드래그 앤 드롭)
// - 자료 분류 (PDF, 이미지, 문서 등)
// - 삭제 기능
```

### 2. QnAManagement.tsx (미작성)
```tsx
// src/pages/instructor/QnAManagement.tsx
// 기능:
// - 학생 Q&A 목록
// - 미답변 필터
// - 답변 작성/수정
// - 검색 기능
```

### 3. CourseInfoEdit.tsx (미작성)
```tsx
// src/pages/instructor/CourseInfoEdit.tsx
// 기능:
// - 강좌 설명 수정
// - 카테고리 수정
// - 태그 추가/삭제
```

---

## 💡 데이터 흐름도

### 학생 화면 → 강사 화면
```
학생이 Q&A 작성
  ↓
/instructor/course/:id/qna
  ↓
강사가 답변 작성
  ↓
학생 화면에 답변 표시 (실시간)
```

### 강사 화면 → 학생 화면
```
강사가 강의 자료 업로드
  ↓
/instructor/course/:id/resources
  ↓
학생 화면에 자동 표시
  ↓
/student/course/:id (강의 자료 탭)
```

---

## ⚠️ 현재 문제점

1. **강의 자료**: 강사는 업로드 못함, 학생은 볼 수 있음 (역설)
2. **Q&A**: 학생은 질문 가능, 강사는 관리 못함
3. **강좌 정보**: 강사가 편집할 방법 없음

모두 비대칭적인 기능임 → 대칭적 기능 구현 필요
