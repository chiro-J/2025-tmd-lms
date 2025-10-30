# DB 통합 맵핑 가이드

## 📊 DB 연동이 필요한 페이지 분류

### 🔴 **1단계: 핵심 동기화 (CRITICAL)**

#### 강의 구성 ↔ 수강자 화면 동기화
**연결 관계**: 강사 편집 → 수강자 보기

1. **강의 구성 (EditCurriculum) → 강좌 상세 (CourseDetail)**
   - URL: `/instructor/course/:id/edit` ↔ `/student/course/:id`
   - 동기화 데이터:
     - 강의 커리큘럼 구조 (폴더, 파일 구조)
     - 강의 제목, 설명
     - PDF 파일
     - 에디터 콘텐츠 (TinyEditor/MarkdownEditor)
     - 에디터 타입 (text/markdown)
   - DB 테이블: `curriculum`, `lessons`, `lesson_content`

2. **학습 화면 (Learning)**
   - URL: `/student/learning/:id`
   - 동기화 데이터:
     - 동일 커리큘럼 구조
     - 강의자 에디터 콘텐츠
     - PDF 파일
   - DB 테이블: 동일 (`curriculum`, `lessons`, `lesson_content`)

---

### 🟡 **2단계: 강의 관리 (HIGH PRIORITY)**

#### 강좌 정보 관리
3. **강의 소개 페이지 (CourseIntroduction) → 강좌 홈 (CourseHome)**
   - URL: `/instructor/create/introduction` ↔ `/instructor/course/:id/home`
   - 동기화 데이터:
     - 썸네일
     - 태그
     - 카테고리
     - 기간
     - 한 줄 설명
     - 소개 영상
     - 강좌 소개 내용 (StableLexicalEditor)
   - DB 테이블: `courses`, `course_content`

4. **강의 홈 (CourseHome)**
   - URL: `/instructor/course/:id/home`
   - 조회 데이터:
     - 학생 수, 진행률
     - 최근 활동
     - 공지사항
   - DB 테이블: `courses`, `enrollments`, `notices`

---

### 🟢 **3단계: 학생 관리 (MEDIUM PRIORITY)**

#### 학생 관리
5. **학생 관리 (ManageStudents)**
   - URL: `/instructor/course/:id/students`
   - DB 테이블: `enrollments`, `users`, `course_progress`
   - 기능:
     - 학생 목록 조회
     - 출석 관리
     - 이메일 발송

6. **성적 분석 (AchievementAnalysis)**
   - URL: `/instructor/course/:id/achievement`
   - DB 테이블: `exam_results`, `assignments`, `course_progress`
   - 기능:
     - 개별 학생 진도
     - 과제/시험 점수

---

### 🔵 **4단계: 시험 및 과제 (MEDIUM PRIORITY)**

#### 시험 관리
7. **시험 관리 (ExamManagement)**
   - URL: `/instructor/course/:id/exams`
   - DB 테이블: `exams`, `exam_questions`, `exam_results`

8. **학생 시험 응시 (QuizPlayer)**
   - URL: `/student/quiz/:id`
   - 동기화: 강사가 만든 시험 → 학생이 응시
   - DB 테이블: `exams`, `exam_questions`, `student_answers`

#### 과제 관리
9. **과제 제출 (AssignmentSubmit)**
   - URL: `/student/assignment/:id`
   - DB 테이블: `assignments`, `submissions`

---

### 🟣 **5단계: 공지 및 커뮤니티 (LOW PRIORITY)**

#### 공지사항
10. **공지 관리 (NoticeManagement)**
    - URL: `/instructor/course/:id/notices`
    - DB 테이블: `notices`

11. **공지 확인 (Notice)**
    - URL: `/student/notice`
    - 동기화: 강사 작성 → 학생 조회
    - DB 테이블: `notices`

---

### 🔵 **6단계: 사용자 프로필 (LOW PRIORITY)**

#### 프로필 관리
12. **학생 프로필 (Profile)**
    - URL: `/student/profile`
    - DB 테이블: `users`, `user_profiles`

13. **강사 프로필 (InstructorProfile)**
    - URL: `/instructor/profile`
    - DB 테이블: `users`, `instructor_profiles`

---

### 🔵 **7단계: 관리자 (ADMIN)**

#### 관리자 페이지
14. **마스터 대시보드 (MasterDashboard)**
    - URL: `/admin/master-dashboard`
    - DB 테이블: `users`, `courses`, `enrollments`, `sub_admins`

15. **서브 대시보드 (SubDashboard)**
    - URL: `/admin/sub-dashboard`
    - DB 테이블: 동일

16. **서브 관리자 관리 (SubAdminManagement)**
    - URL: `/admin/sub-admin-management`
    - DB 테이블: `sub_admins`

17. **강사 승인 (InstructorApproval)**
    - URL: `/admin/instructor-approval`
    - DB 테이블: `pending_instructors`

---

## 📋 DB 스키마 설계 (제안)

### 테이블 구조

#### 1. users
```sql
- id (PK)
- email (UNIQUE)
- password
- name
- role (student|instructor|admin|sub-admin)
- status (active|inactive|pending)
- created_at
- last_login
```

#### 2. courses
```sql
- id (PK)
- instructor_id (FK -> users)
- title
- description
- thumbnail
- tags (JSON)
- category1
- category2
- duration_start
- duration_end
- status (draft|published|archived)
- created_at
- updated_at
```

#### 3. curriculum
```sql
- id (PK)
- course_id (FK -> courses)
- title
- order
- created_at
```

#### 4. lessons
```sql
- id (PK)
- curriculum_id (FK -> curriculum)
- parent_id (FK -> lessons, NULL if root)
- title
- type (folder|file)
- content (TEXT) - 에디터 내용
- editor_type (text|markdown)
- pdf_url
- order
- created_at
- updated_at
```

#### 5. enrollments
```sql
- id (PK)
- student_id (FK -> users)
- course_id (FK -> courses)
- status (active|completed|dropped)
- enrolled_at
- last_activity_at
```

#### 6. course_progress
```sql
- id (PK)
- enrollment_id (FK -> enrollments)
- lesson_id (FK -> lessons)
- status (not_started|in_progress|completed)
- progress_percentage
- last_viewed_at
```

#### 7. exams
```sql
- id (PK)
- course_id (FK -> courses)
- title
- description
- time_limit
- created_at
- updated_at
```

#### 8. exam_questions
```sql
- id (PK)
- exam_id (FK -> exams)
- question
- question_type (multiple_choice|short_answer)
- options (JSON)
- correct_answer
- order
```

#### 9. exam_results
```sql
- id (PK)
- exam_id (FK -> exams)
- student_id (FK -> users)
- score
- submitted_at
- time_spent
```

#### 10. student_answers
```sql
- id (PK)
- exam_result_id (FK -> exam_results)
- question_id (FK -> exam_questions)
- answer (TEXT)
- is_correct
```

#### 11. notices
```sql
- id (PK)
- course_id (FK -> courses)
- instructor_id (FK -> users)
- title
- content
- priority (low|medium|high)
- created_at
- updated_at
```

---

## 🎯 우선순위별 개발 순서

### Phase 1: 핵심 동기화 (최우선)
1. ✅ EditCurriculum → CourseDetail 커리큘럼 동기화
2. ✅ EditCurriculum → Learning 화면 동기화
3. ✅ 에디터 콘텐츠 저장/불러오기 (TinyEditor, MarkdownEditor)
4. ✅ PDF 파일 업로드/저장

### Phase 2: 강의 관리
5. ✅ CourseIntroduction 저장/조회
6. ✅ CourseHome 대시보드 데이터
7. ✅ ManageStudents 학생 목록
8. ✅ AchievementAnalysis 성적 데이터

### Phase 3: 시험/과제
9. ✅ ExamManagement 시험 생성
10. ✅ QuizPlayer 시험 응시
11. ✅ AssignmentSubmit 과제 제출

### Phase 4: 공지 및 프로필
12. ✅ NoticeManagement 공지 작성
13. ✅ Profile 프로필 관리

### Phase 5: 관리자
14. ✅ MasterDashboard 전체 통계
15. ✅ SubDashboard 서브 관리자 화면
16. ✅ SubAdminManagement 서브 관리자 CRUD

---

## 🔧 API 엔드포인트 제안

### Courses
- `GET /api/courses/:id` - 강좌 상세
- `POST /api/courses` - 강좌 생성
- `PUT /api/courses/:id` - 강좌 수정
- `DELETE /api/courses/:id` - 강좌 삭제

### Curriculum
- `GET /api/courses/:id/curriculum` - 커리큘럼 조회
- `POST /api/courses/:id/curriculum` - 커리큘럼 생성
- `PUT /api/lessons/:id` - 강의 수정
- `DELETE /api/lessons/:id` - 강의 삭제

### Lessons
- `GET /api/lessons/:id` - 강의 상세
- `PUT /api/lessons/:id` - 강의 콘텐츠 저장
- `POST /api/lessons/:id/upload` - PDF 업로드

### Exams
- `GET /api/exams/:id` - 시험 조회
- `POST /api/exams` - 시험 생성
- `POST /api/exams/:id/submit` - 시험 제출
- `GET /api/exams/:id/results` - 시험 결과 조회

### Students
- `GET /api/courses/:id/students` - 학생 목록
- `GET /api/courses/:id/progress` - 수강 진도 조회

### Admins
- `GET /api/admin/dashboard` - 관리자 대시보드
- `POST /api/admin/sub-admins` - 서브 관리자 생성
- `GET /api/admin/sub-admins` - 서브 관리자 목록
- `PUT /api/admin/sub-admins/:id` - 서브 관리자 수정
- `DELETE /api/admin/sub-admins/:id` - 서브 관리자 삭제

---

## ⚠️ 주의사항

1. **에디터 콘텐츠 저장**
   - TinyEditor: HTML 형식으로 저장
   - MarkdownEditor: Markdown 형식으로 저장
   - `editor_type` 필드로 구분하여 렌더링

2. **PDF 파일 관리**
   - `lesson_content` 테이블에 `pdf_url` 저장
   - File Storage (S3, Cloudinary 등) 사용 권장

3. **권한 관리**
   - 강사는 자신의 강의만 수정 가능
   - 학생은 등록한 강의만 접근 가능
   - Admin은 전체 접근 가능

4. **실시간 동기화**
   - WebSocket 또는 Server-Sent Events 고려
   - 강사 편집 시 학생 화면 자동 업데이트
