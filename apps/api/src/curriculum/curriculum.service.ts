import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurriculumModule } from './entities/curriculum.entity';
import { Lesson } from './entities/lesson.entity';
import { Course } from '../courses/entities/course.entity';
import { getUploadService } from '../utils/upload-helper';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(CurriculumModule)
    private curriculumRepository: Repository<CurriculumModule>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findAllByCourse(courseId: number): Promise<CurriculumModule[]> {
    const modules = await this.curriculumRepository.find({
      where: { courseId },
      relations: ['course'],
      order: { order: 'ASC' },
    });

    // 각 모듈의 레슨도 함께 조회
    for (const module of modules) {
      const lessons = await this.lessonRepository.find({
        where: { curriculumModuleId: module.id },
        order: { order: 'ASC' },
      });
      (module as any).lessons = lessons;
    }

    return modules;
  }

  async seedData(courseId: number): Promise<{ message: string; modules: CurriculumModule[] }> {
    // Course가 없으면 먼저 생성
    let course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      // 환경변수 기반 기본 썸네일 경로
      const uploadPathThumbnail = process.env.UPLOAD_PATH_THUMBNAIL || 'thumbnails';
      const DEFAULT_THUMBNAIL = `/${uploadPathThumbnail}/aaa.jpg`;
      course = this.courseRepository.create({
        title: '(1회차) 풀스택 과정',
        instructor: '박강사', // 빠른 로그인 계정 이름으로 변경
        thumbnail: DEFAULT_THUMBNAIL,
        progress: 0,
        status: 'published',
      });
      course = await this.courseRepository.save(course);
      // 생성된 Course의 실제 ID를 사용
      courseId = course.id;
    }

    // 기존 커리큘럼 데이터가 있으면 모두 삭제
    const existingModules = await this.curriculumRepository.find({
      where: { courseId },
    });

    if (existingModules.length > 0) {
      // 각 모듈의 레슨 먼저 삭제 (파일도 함께 삭제)
      for (const module of existingModules) {
        const lessons = await this.lessonRepository.find({
          where: { curriculumModuleId: module.id },
        });
        if (lessons.length > 0) {
          // 각 레슨의 파일 삭제
          for (const lesson of lessons) {
            await this.deleteLessonFiles(lesson);
          }
          await this.lessonRepository.remove(lessons);
        }
      }
      // 커리큘럼 모듈 삭제
      await this.curriculumRepository.remove(existingModules);
    }

    // 강사 페이지에 있는 정확한 강좌 구성 데이터 (각 모듈당 3개씩만)
    const modulesData = [
      {
        title: '풀스택 기초',
        order: 1,
        lessons: [
          {
            title: '환경설정/기본문법/조건문/반복문',
            description: JSON.stringify([
              {
                id: 'block-1',
                type: 'markdown',
                content: '# 환경설정 및 기본 문법\n\n## 학습 목표\n- 개발 환경 설정 방법 이해\n- JavaScript 기본 문법 습득\n- 조건문과 반복문 활용\n\n## 1. 개발 환경 설정\n\n### Node.js 설치\nNode.js는 JavaScript를 서버에서 실행할 수 있게 해주는 런타임 환경입니다.\n\n```bash\n# Node.js 버전 확인\nnode --version\n```\n\n### VS Code 설치 및 확장 프로그램\n- ESLint: 코드 품질 검사\n- Prettier: 코드 포맷팅\n- Live Server: 실시간 미리보기\n\n## 2. JavaScript 기본 문법\n\n### 변수 선언\n```javascript\n// let: 재할당 가능\nlet name = "홍길동";\nname = "김철수";\n\n// const: 재할당 불가\nconst PI = 3.14;\n```\n\n### 데이터 타입\n- Number: 숫자\n- String: 문자열\n- Boolean: true/false\n- Array: 배열\n- Object: 객체\n\n## 3. 조건문\n\n### if-else 문\n```javascript\nlet score = 85;\n\nif (score >= 90) {\n  console.log("A등급");\n} else if (score >= 80) {\n  console.log("B등급");\n} else {\n  console.log("C등급");\n}\n```\n\n### switch 문\n```javascript\nlet day = "월요일";\n\nswitch(day) {\n  case "월요일":\n    console.log("주간 회의");\n    break;\n  case "금요일":\n    console.log("주간 마무리");\n    break;\n  default:\n    console.log("일반 업무");\n}\n```\n\n## 4. 반복문\n\n### for 문\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n```\n\n### while 문\n```javascript\nlet count = 0;\nwhile (count < 5) {\n  console.log(count);\n  count++;\n}\n```\n\n### forEach (배열)\n```javascript\nconst fruits = ["사과", "바나나", "오렌지"];\nfruits.forEach((fruit) => {\n  console.log(fruit);\n});\n```\n\n## 실습 과제\n1. 1부터 100까지의 합을 구하는 프로그램 작성\n2. 점수에 따른 등급 판별 프로그램 작성\n3. 배열의 최댓값과 최솟값 찾기',
              }
            ]),
            order: 0
          },
          {
            title: '함수/배열/객체',
            description: JSON.stringify([
              {
                id: 'block-2',
                type: 'markdown',
                content: '# 함수, 배열, 객체\n\n## 1. 함수 (Function)\n\n### 함수 선언\n```javascript\n// 함수 선언식\nfunction greet(name) {\n  return `안녕하세요, ${name}님!`;\n}\n\n// 함수 표현식\nconst greet2 = function(name) {\n  return `안녕하세요, ${name}님!`;\n};\n\n// 화살표 함수\nconst greet3 = (name) => {\n  return `안녕하세요, ${name}님!`;\n};\n```\n\n### 매개변수와 반환값\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nconst result = add(3, 5); // 8\n```\n\n## 2. 배열 (Array)\n\n### 배열 생성 및 접근\n```javascript\nconst fruits = ["사과", "바나나", "오렌지"];\nconsole.log(fruits[0]); // "사과"\nconsole.log(fruits.length); // 3\n```\n\n### 배열 메서드\n```javascript\n// push: 배열 끝에 추가\nfruits.push("포도");\n\n// pop: 배열 끝 요소 제거\nfruits.pop();\n\n// map: 각 요소 변환\nconst upperFruits = fruits.map(fruit => fruit.toUpperCase());\n\n// filter: 조건에 맞는 요소만 필터링\nconst longFruits = fruits.filter(fruit => fruit.length > 3);\n\n// reduce: 배열을 하나의 값으로 축약\nconst sum = [1, 2, 3, 4, 5].reduce((acc, curr) => acc + curr, 0);\n```\n\n## 3. 객체 (Object)\n\n### 객체 생성 및 접근\n```javascript\nconst person = {\n  name: "홍길동",\n  age: 30,\n  city: "서울"\n};\n\nconsole.log(person.name); // "홍길동"\nconsole.log(person["age"]); // 30\n```\n\n### 객체 메서드\n```javascript\nconst student = {\n  name: "김철수",\n  score: 85,\n  getGrade: function() {\n    if (this.score >= 90) return "A";\n    if (this.score >= 80) return "B";\n    return "C";\n  }\n};\n\nconsole.log(student.getGrade()); // "B"\n```\n\n## 실습 과제\n1. 두 수의 최대공약수를 구하는 함수 작성\n2. 배열에서 중복 제거 함수 작성\n3. 학생 정보를 담는 객체 배열 만들기',
              }
            ]),
            order: 1
          },
          {
            title: 'DOM 조작과 이벤트 처리',
            description: JSON.stringify([
              {
                id: 'block-3',
                type: 'markdown',
                content: '# DOM 조작과 이벤트 처리\n\n## 1. DOM (Document Object Model)\n\n### DOM 요소 선택\n```javascript\n// ID로 선택\nconst element = document.getElementById("myId");\n\n// 클래스로 선택\nconst elements = document.getElementsByClassName("myClass");\n\n// 쿼리 선택자\nconst element2 = document.querySelector("#myId");\nconst elements2 = document.querySelectorAll(".myClass");\n```\n\n### DOM 요소 조작\n```javascript\n// 텍스트 변경\nconst title = document.querySelector("h1");\ntitle.textContent = "새로운 제목";\n\n// HTML 변경\nconst div = document.querySelector("div");\ndiv.innerHTML = "<p>새로운 내용</p>";\n\n// 스타일 변경\nconst box = document.querySelector(".box");\nbox.style.backgroundColor = "blue";\nbox.style.padding = "20px";\n\n// 클래스 추가/제거\nelement.classList.add("active");\nelement.classList.remove("inactive");\nelement.classList.toggle("highlight");\n```\n\n### DOM 요소 생성 및 추가\n```javascript\n// 새 요소 생성\nconst newDiv = document.createElement("div");\nnewDiv.textContent = "새로운 div";\nnewDiv.className = "new-element";\n\n// 부모 요소에 추가\nconst parent = document.querySelector("#container");\nparent.appendChild(newDiv);\n\n// 특정 위치에 삽입\nconst beforeElement = document.querySelector("#before");\nparent.insertBefore(newDiv, beforeElement);\n```\n\n## 2. 이벤트 처리\n\n### 이벤트 리스너 추가\n```javascript\n// 클릭 이벤트\nconst button = document.querySelector("#myButton");\nbutton.addEventListener("click", function() {\n  console.log("버튼이 클릭되었습니다!");\n});\n\n// 입력 이벤트\nconst input = document.querySelector("#myInput");\ninput.addEventListener("input", function(e) {\n  console.log("입력값:", e.target.value);\n});\n\n// 폼 제출 이벤트\nconst form = document.querySelector("#myForm");\nform.addEventListener("submit", function(e) {\n  e.preventDefault(); // 기본 동작 방지\n  console.log("폼이 제출되었습니다!");\n});\n```\n\n### 이벤트 위임\n```javascript\n// 부모 요소에 이벤트 리스너 추가\nconst list = document.querySelector("#list");\nlist.addEventListener("click", function(e) {\n  if (e.target.tagName === "LI") {\n    console.log("리스트 항목 클릭:", e.target.textContent);\n  }\n});\n```\n\n## 실습 과제\n1. 버튼 클릭 시 배경색 변경하기\n2. 입력 필드에 실시간 글자 수 표시하기\n3. 동적으로 리스트 항목 추가/삭제하기',
              }
            ]),
            order: 2
          },
        ],
      },
      {
        title: '정보통신개론 및 IT 기본 실습',
        order: 2,
        lessons: [
          {
            title: 'IT 산업 역사와 웹 개발 현황',
            description: JSON.stringify([
              {
                id: 'block-4',
                type: 'markdown',
                content: '# IT 산업 역사와 웹 개발 현황\n\n## 1. IT 산업의 발전 과정\n\n### 컴퓨터의 역사\n- **1940년대**: 최초의 전자 컴퓨터 등장 (ENIAC)\n- **1960년대**: 메인프레임 컴퓨터 시대\n- **1980년대**: 개인용 컴퓨터(PC) 보급\n- **1990년대**: 인터넷의 대중화\n- **2000년대**: 모바일 혁명\n- **2010년대**: 클라우드 컴퓨팅과 빅데이터\n- **2020년대**: AI와 메타버스 시대\n\n### 한국 IT 산업의 성장\n- **1990년대**: 인터넷 인프라 구축\n- **2000년대**: IT 강국으로 부상\n- **2010년대**: 스마트폰과 모바일 앱 시장 선도\n- **2020년대**: K-콘텐츠와 IT 융합 산업 확대\n\n## 2. 웹 개발의 발전\n\n### 웹 1.0 (1990-2000)\n- 정적 웹페이지\n- HTML 중심\n- 단방향 정보 제공\n\n### 웹 2.0 (2000-2010)\n- 동적 웹 애플리케이션\n- 사용자 참여와 상호작용\n- 소셜 미디어 등장\n\n### 웹 3.0 (2010-현재)\n- 모바일 우선 설계\n- 반응형 웹 디자인\n- SPA(Single Page Application)\n- PWA(Progressive Web App)\n\n## 3. 현재 웹 개발 트렌드\n\n### 프론트엔드 기술\n- **React**: 컴포넌트 기반 UI 라이브러리\n- **Vue.js**: 점진적 프레임워크\n- **Next.js**: React 기반 풀스택 프레임워크\n- **TypeScript**: 타입 안정성 강화\n\n### 백엔드 기술\n- **Node.js**: JavaScript 서버 사이드\n- **Python**: Django, Flask\n- **Java**: Spring Boot\n- **Go**: 고성능 서버 개발\n\n### 클라우드와 DevOps\n- AWS, Azure, GCP\n- Docker와 Kubernetes\n- CI/CD 파이프라인\n- 마이크로서비스 아키텍처\n\n## 4. 웹 개발자 커리어 패스\n\n### 프론트엔드 개발자\n- HTML/CSS/JavaScript 기초\n- React, Vue 등 프레임워크\n- UI/UX 이해\n\n### 백엔드 개발자\n- 서버 프로그래밍 언어\n- 데이터베이스 설계\n- API 개발\n\n### 풀스택 개발자\n- 프론트엔드 + 백엔드\n- 전체 시스템 이해\n- 프로젝트 관리 능력',
              }
            ]),
            order: 0
          },
          {
            title: 'Github와 개발 협업',
            description: JSON.stringify([
              {
                id: 'block-5',
                type: 'markdown',
                content: '# Github와 개발 협업\n\n## 1. Git 기초\n\n### Git이란?\nGit은 분산 버전 관리 시스템으로, 코드의 변경 이력을 추적하고 관리합니다.\n\n### 기본 명령어\n```bash\n# 저장소 초기화\ngit init\n\n# 파일 추가\ngit add .\n\n# 커밋\ngit commit -m "커밋 메시지"\n\n# 상태 확인\ngit status\n\n# 변경 이력 확인\ngit log\n```\n\n### 브랜치 관리\n```bash\n# 브랜치 생성\ngit branch feature/new-feature\n\n# 브랜치 전환\ngit checkout feature/new-feature\n\n# 브랜치 병합\ngit merge feature/new-feature\n```\n\n## 2. GitHub 사용법\n\n### 원격 저장소 연결\n```bash\n# 원격 저장소 추가\ngit remote add origin https://github.com/username/repo.git\n\n# 원격 저장소로 푸시\ngit push -u origin main\n\n# 원격 저장소에서 가져오기\ngit pull origin main\n```\n\n### GitHub 주요 기능\n- **Repository**: 코드 저장소\n- **Issues**: 버그 리포트 및 기능 요청\n- **Pull Request**: 코드 리뷰 및 병합\n- **Actions**: CI/CD 자동화\n- **Wiki**: 프로젝트 문서화\n\n## 3. 협업 워크플로우\n\n### Fork & Pull Request\n1. 원본 저장소 Fork\n2. 로컬에서 브랜치 생성\n3. 변경사항 커밋 및 푸시\n4. Pull Request 생성\n5. 코드 리뷰 후 병합\n\n### Git Flow\n- **main**: 프로덕션 코드\n- **develop**: 개발 브랜치\n- **feature**: 기능 개발 브랜치\n- **hotfix**: 긴급 수정 브랜치\n\n## 4. README 작성 가이드\n\n### 좋은 README의 구성\n```markdown\n# 프로젝트 제목\n\n## 프로젝트 소개\n프로젝트에 대한 간단한 설명\n\n## 설치 방법\n```bash\nnpm install\n```\n\n## 사용 방법\n프로젝트 실행 방법\n\n## 기술 스택\n- React\n- Node.js\n- PostgreSQL\n\n## 기여 방법\n기여 가이드라인\n```\n\n## 실습 과제\n1. GitHub 계정 생성 및 저장소 만들기\n2. 로컬 프로젝트를 GitHub에 연결하기\n3. README.md 파일 작성하기',
              }
            ]),
            order: 1
          },
          {
            title: '알고리즘과 문제 해결',
            description: JSON.stringify([
              {
                id: 'block-6',
                type: 'markdown',
                content: '# 알고리즘과 문제 해결\n\n## 1. 알고리즘이란?\n\n알고리즘은 문제를 해결하기 위한 단계별 절차입니다.\n\n### 알고리즘의 특징\n- **명확성**: 각 단계가 명확해야 함\n- **유한성**: 반드시 종료되어야 함\n- **효율성**: 최소한의 시간과 공간 사용\n- **정확성**: 올바른 결과를 도출해야 함\n\n## 2. 기본 알고리즘 패턴\n\n### 선형 탐색 (Linear Search)\n```javascript\nfunction linearSearch(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) {\n      return i;\n    }\n  }\n  return -1;\n}\n```\n\n### 이진 탐색 (Binary Search)\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    \n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  \n  return -1;\n}\n```\n\n### 정렬 알고리즘\n\n#### 버블 정렬\n```javascript\nfunction bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}\n```\n\n## 3. 시간 복잡도\n\n### Big O 표기법\n- **O(1)**: 상수 시간\n- **O(log n)**: 로그 시간\n- **O(n)**: 선형 시간\n- **O(n log n)**: 선형 로그 시간\n- **O(n²)**: 제곱 시간\n\n### 알고리즘 선택 기준\n1. 데이터 크기\n2. 시간 제약\n3. 메모리 제약\n4. 정확도 요구사항\n\n## 4. 문제 해결 접근법\n\n### 단계별 접근\n1. **문제 이해**: 문제를 정확히 파악\n2. **계획 수립**: 해결 방법 설계\n3. **코드 구현**: 알고리즘을 코드로 작성\n4. **테스트**: 다양한 케이스로 검증\n5. **최적화**: 성능 개선\n\n## 실습 과제\n1. 배열에서 최댓값과 최솟값 찾기\n2. 팰린드롬 문자열 판별하기\n3. 피보나치 수열 구현하기',
              }
            ]),
            order: 2
          },
        ],
      },
      {
        title: '리엑트 NEW',
        order: 3,
        lessons: [
          {
            title: 'React 기초와 컴포넌트',
            description: JSON.stringify([
              {
                id: 'block-7',
                type: 'markdown',
                content: '# React 기초와 컴포넌트\n\n## 1. React란?\n\nReact는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다.\n\n### React의 특징\n- **컴포넌트 기반**: 재사용 가능한 UI 구성 요소\n- **가상 DOM**: 효율적인 렌더링\n- **단방향 데이터 흐름**: 예측 가능한 상태 관리\n- **선언적**: UI를 선언적으로 작성\n\n## 2. 컴포넌트 생성\n\n### 함수형 컴포넌트\n```jsx\nfunction Welcome(props) {\n  return <h1>안녕하세요, {props.name}님!</h1>;\n}\n\n// 화살표 함수\nconst Welcome = (props) => {\n  return <h1>안녕하세요, {props.name}님!</h1>;\n};\n```\n\n### 컴포넌트 사용\n```jsx\nfunction App() {\n  return (\n    <div>\n      <Welcome name="홍길동" />\n      <Welcome name="김철수" />\n    </div>\n  );\n}\n```\n\n## 3. JSX 문법\n\n### JSX 기본\n```jsx\nconst element = <h1>Hello, World!</h1>;\n\n// 변수 사용\nconst name = "홍길동";\nconst element2 = <h1>Hello, {name}!</h1>;\n\n// 표현식 사용\nconst element3 = <h1>1 + 1 = {1 + 1}</h1>;\n```\n\n### 조건부 렌더링\n```jsx\nfunction Greeting({ isLoggedIn }) {\n  if (isLoggedIn) {\n    return <h1>환영합니다!</h1>;\n  }\n  return <h1>로그인이 필요합니다.</h1>;\n}\n\n// 삼항 연산자\nfunction Greeting2({ isLoggedIn }) {\n  return (\n    <div>\n      {isLoggedIn ? <h1>환영합니다!</h1> : <h1>로그인이 필요합니다.</h1>}\n    </div>\n  );\n}\n```\n\n## 4. Props와 State\n\n### Props (Properties)\n```jsx\nfunction Button({ text, onClick }) {\n  return <button onClick={onClick}>{text}</button>;\n}\n\n// 사용\n<Button text="클릭하세요" onClick={() => alert("클릭!")} />\n```\n\n### State (상태)\n```jsx\nimport { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>현재 카운트: {count}</p>\n      <button onClick={() => setCount(count + 1)}>증가</button>\n      <button onClick={() => setCount(count - 1)}>감소</button>\n    </div>\n  );\n}\n```\n\n## 실습 과제\n1. 사용자 정보를 표시하는 컴포넌트 만들기\n2. 카운터 컴포넌트 만들기\n3. 할 일 목록 컴포넌트 만들기',
              }
            ]),
            order: 0
          },
          {
            title: '이벤트 처리와 폼 관리',
            description: JSON.stringify([
              {
                id: 'block-8',
                type: 'markdown',
                content: '# 이벤트 처리와 폼 관리\n\n## 1. 이벤트 처리\n\n### 기본 이벤트 핸들러\n```jsx\nfunction Button() {\n  const handleClick = () => {\n    alert("버튼이 클릭되었습니다!");\n  };\n  \n  return <button onClick={handleClick}>클릭하세요</button>;\n}\n```\n\n### 이벤트 객체 사용\n```jsx\nfunction Input() {\n  const handleChange = (e) => {\n    console.log("입력값:", e.target.value);\n  };\n  \n  return <input onChange={handleChange} />;\n}\n```\n\n### 여러 이벤트 타입\n```jsx\nfunction InteractiveElement() {\n  return (\n    <div\n      onClick={() => console.log("클릭")}\n      onMouseEnter={() => console.log("마우스 진입")}\n      onMouseLeave={() => console.log("마우스 이탈")}\n    >\n      상호작용 요소\n    </div>\n  );\n}\n```\n\n## 2. 폼 관리\n\n### 제어 컴포넌트 (Controlled Component)\n```jsx\nimport { useState } from \'react\';\n\nfunction LoginForm() {\n  const [username, setUsername] = useState("");\n  const [password, setPassword] = useState("");\n  \n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log("사용자명:", username);\n    console.log("비밀번호:", password);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        type="text"\n        value={username}\n        onChange={(e) => setUsername(e.target.value)}\n        placeholder="사용자명"\n      />\n      <input\n        type="password"\n        value={password}\n        onChange={(e) => setPassword(e.target.value)}\n        placeholder="비밀번호"\n      />\n      <button type="submit">로그인</button>\n    </form>\n  );\n}\n```\n\n### 여러 입력 필드 관리\n```jsx\nfunction ContactForm() {\n  const [formData, setFormData] = useState({\n    name: "",\n    email: "",\n    message: ""\n  });\n  \n  const handleChange = (e) => {\n    const { name, value } = e.target;\n    setFormData(prev => ({\n      ...prev,\n      [name]: value\n    }));\n  };\n  \n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log("폼 데이터:", formData);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        name="name"\n        value={formData.name}\n        onChange={handleChange}\n        placeholder="이름"\n      />\n      <input\n        name="email"\n        type="email"\n        value={formData.email}\n        onChange={handleChange}\n        placeholder="이메일"\n      />\n      <textarea\n        name="message"\n        value={formData.message}\n        onChange={handleChange}\n        placeholder="메시지"\n      />\n      <button type="submit">전송</button>\n    </form>\n  );\n}\n```\n\n## 3. 폼 유효성 검사\n\n```jsx\nfunction ValidatedForm() {\n  const [email, setEmail] = useState("");\n  const [error, setError] = useState("");\n  \n  const validateEmail = (email) => {\n    const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n    return regex.test(email);\n  };\n  \n  const handleSubmit = (e) => {\n    e.preventDefault();\n    \n    if (!validateEmail(email)) {\n      setError("올바른 이메일 형식이 아닙니다.");\n      return;\n    }\n    \n    setError("");\n    console.log("이메일:", email);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        type="email"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        placeholder="이메일"\n      />\n      {error && <p style={{ color: "red" }}>{error}</p>}\n      <button type="submit">제출</button>\n    </form>\n  );\n}\n```\n\n## 실습 과제\n1. 로그인 폼 만들기\n2. 회원가입 폼 만들기 (유효성 검사 포함)\n3. 동적 입력 필드 추가/삭제 기능 구현',
              }
            ]),
            order: 1
          },
          {
            title: '리스트 렌더링과 조건부 렌더링',
            description: JSON.stringify([
              {
                id: 'block-9',
                type: 'markdown',
                content: '# 리스트 렌더링과 조건부 렌더링\n\n## 1. 리스트 렌더링\n\n### 기본 리스트 렌더링\n```jsx\nfunction TodoList() {\n  const todos = ["할 일 1", "할 일 2", "할 일 3"];\n  \n  return (\n    <ul>\n      {todos.map((todo, index) => (\n        <li key={index}>{todo}</li>\n      ))}\n    </ul>\n  );\n}\n```\n\n### 객체 배열 렌더링\n```jsx\nfunction ProductList() {\n  const products = [\n    { id: 1, name: "노트북", price: 1000000 },\n    { id: 2, name: "마우스", price: 50000 },\n    { id: 3, name: "키보드", price: 100000 }\n  ];\n  \n  return (\n    <div>\n      {products.map(product => (\n        <div key={product.id}>\n          <h3>{product.name}</h3>\n          <p>가격: {product.price.toLocaleString()}원</p>\n        </div>\n      ))}\n    </div>\n  );\n}\n```\n\n### Key의 중요성\n- React가 어떤 항목이 변경되었는지 식별\n- 고유하고 안정적인 값 사용 권장\n- 배열 인덱스는 최후의 수단\n\n## 2. 조건부 렌더링\n\n### if 문 사용\n```jsx\nfunction Greeting({ isLoggedIn }) {\n  if (isLoggedIn) {\n    return <h1>환영합니다!</h1>;\n  }\n  return <h1>로그인이 필요합니다.</h1>;\n}\n```\n\n### 논리 연산자 사용\n```jsx\nfunction Notification({ message }) {\n  return (\n    <div>\n      {message && <p>{message}</p>}\n    </div>\n  );\n}\n```\n\n### 삼항 연산자\n```jsx\nfunction Status({ isOnline }) {\n  return (\n    <div>\n      {isOnline ? (\n        <span style={{ color: "green" }}>온라인</span>\n      ) : (\n        <span style={{ color: "gray" }}>오프라인</span>\n      )}\n    </div>\n  );\n}\n```\n\n### 복잡한 조건부 렌더링\n```jsx\nfunction UserProfile({ user }) {\n  if (!user) {\n    return <div>사용자 정보를 불러오는 중...</div>;\n  }\n  \n  if (user.isLoading) {\n    return <div>로딩 중...</div>;\n  }\n  \n  if (user.error) {\n    return <div>오류가 발생했습니다: {user.error}</div>;\n  }\n  \n  return (\n    <div>\n      <h2>{user.name}</h2>\n      <p>{user.email}</p>\n    </div>\n  );\n}\n```\n\n## 3. 필터링과 정렬\n\n```jsx\nfunction FilteredList() {\n  const items = [\n    { id: 1, name: "사과", category: "과일" },\n    { id: 2, name: "당근", category: "채소" },\n    { id: 3, name: "바나나", category: "과일" }\n  ];\n  \n  const [filter, setFilter] = useState("all");\n  \n  const filteredItems = filter === "all" \n    ? items \n    : items.filter(item => item.category === filter);\n  \n  return (\n    <div>\n      <button onClick={() => setFilter("all")}>전체</button>\n      <button onClick={() => setFilter("과일")}>과일</button>\n      <button onClick={() => setFilter("채소")}>채소</button>\n      \n      <ul>\n        {filteredItems.map(item => (\n          <li key={item.id}>{item.name}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n```\n\n## 실습 과제\n1. 동적 할 일 목록 만들기 (추가/삭제/완료)\n2. 상품 목록 필터링 기능 구현\n3. 사용자 목록 검색 기능 구현',
              }
            ]),
            order: 2
          },
        ],
      },
    ];

    const createdModules: CurriculumModule[] = [];

    for (const moduleData of modulesData) {
      const module = this.curriculumRepository.create({
        courseId,
        title: moduleData.title,
        order: moduleData.order,
      });
      const savedModule = await this.curriculumRepository.save(module);

      for (const lessonData of moduleData.lessons) {
        const lesson = this.lessonRepository.create({
          curriculumModuleId: savedModule.id,
          title: lessonData.title,
          description: lessonData.description,
          order: lessonData.order,
        });
        await this.lessonRepository.save(lesson);
      }

      // 레슨 포함하여 다시 조회
      const moduleWithLessons = await this.curriculumRepository.findOne({
        where: { id: savedModule.id },
        relations: ['course'],
      });
      if (moduleWithLessons) {
        createdModules.push(moduleWithLessons);
      }
    }

    return {
      message: `커리큘럼 ${createdModules.length}개 모듈이 생성되었습니다.`,
      modules: createdModules.sort((a, b) => a.order - b.order),
    };
  }

  async create(courseId: number, createDto: { title: string; order?: number }): Promise<CurriculumModule> {
    const maxOrder = await this.curriculumRepository
      .createQueryBuilder('cm')
      .select('MAX(cm.order)', 'max')
      .where('cm.courseId = :courseId', { courseId })
      .getRawOne();

    const order = createDto.order ?? (maxOrder?.max ?? -1) + 1;

    const module = this.curriculumRepository.create({
      courseId,
      title: createDto.title,
      order,
    });

    return this.curriculumRepository.save(module);
  }

  async update(id: number, updateDto: { title?: string; order?: number }): Promise<CurriculumModule> {
    const module = await this.curriculumRepository.findOne({ where: { id } });
    if (!module) {
      throw new Error(`Curriculum module with ID ${id} not found`);
    }

    if (updateDto.title !== undefined) {
      module.title = updateDto.title;
    }
    if (updateDto.order !== undefined) {
      module.order = updateDto.order;
    }

    return this.curriculumRepository.save(module);
  }

  async remove(id: number): Promise<void> {
    try {
      // 먼저 해당 커리큘럼 모듈이 존재하는지 확인
      const module = await this.curriculumRepository.findOne({ where: { id } });
      if (!module) {
        throw new Error(`Curriculum module with ID ${id} not found`);
      }

      // 해당 커리큘럼 모듈에 연결된 모든 레슨 삭제 (파일도 함께 삭제)
      const lessons = await this.lessonRepository.find({
        where: { curriculumModuleId: id },
      });

      if (lessons.length > 0) {
        // 각 레슨의 파일 삭제
        for (const lesson of lessons) {
          await this.deleteLessonFiles(lesson);
        }
        await this.lessonRepository.remove(lessons);
      }

      // 커리큘럼 모듈 삭제
      await this.curriculumRepository.delete(id);
    } catch (error) {
      console.error(`커리큘럼 모듈 삭제 실패 (ID: ${id}):`, error);
      throw error;
    }
  }

  async createLesson(curriculumModuleId: number, createDto: { title: string; description?: string; order?: number }): Promise<Lesson> {
    const maxOrder = await this.lessonRepository
      .createQueryBuilder('lesson')
      .select('MAX(lesson.order)', 'max')
      .where('lesson.curriculumModuleId = :curriculumModuleId', { curriculumModuleId })
      .getRawOne();

    const order = createDto.order ?? (maxOrder?.max ?? -1) + 1;

    const lesson = this.lessonRepository.create({
      curriculumModuleId,
      title: createDto.title,
      description: createDto.description || null,
      order,
    });

    return this.lessonRepository.save(lesson);
  }

  async findOneLesson(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new Error(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async updateLesson(id: number, updateDto: { title?: string; description?: string }): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new Error(`Lesson with ID ${id} not found`);
    }

    console.log('📚 Lesson.update 호출:', {
      lessonId: id,
      descriptionChanged: updateDto.description !== undefined && lesson.description !== updateDto.description,
      oldDescriptionLength: lesson.description?.length,
      newDescriptionLength: updateDto.description?.length
    });

    // description이 업데이트되는 경우, 삭제된 파일만 삭제 (새로운 파일은 유지)
    if (updateDto.description !== undefined && lesson.description !== updateDto.description) {
      console.log('🗑️ 레슨 파일 삭제 시작...');
      await this.deleteRemovedLessonFiles(lesson.description, updateDto.description);
    }

    if (updateDto.title !== undefined) {
      lesson.title = updateDto.title;
    }
    if (updateDto.description !== undefined) {
      lesson.description = updateDto.description;
    }

    return this.lessonRepository.save(lesson);
  }

  // 삭제된 파일만 삭제하는 헬퍼 메서드 (이전과 새로운 contentBlocks 비교)
  private async deleteRemovedLessonFiles(oldDescription: string | null, newDescription: string | null): Promise<void> {
    if (!oldDescription) {
      return; // 이전 description이 없으면 삭제할 파일 없음
    }

    try {
      const oldBlocks = JSON.parse(oldDescription);
      const newBlocks = newDescription ? JSON.parse(newDescription) : [];

      if (!Array.isArray(oldBlocks) || !Array.isArray(newBlocks)) {
        // JSON 형식이 아니면 전체 삭제 (기존 로직)
        await this.deleteLessonFiles({ description: oldDescription } as Lesson);
        return;
      }

      // 새로운 contentBlocks에서 사용 중인 파일 URL 수집
      const newFileUrls = new Set<string>();
      newBlocks.forEach((block: any) => {
        if ((block.type === 'pdf' || block.type === 'image' || block.type === 'video') && block.content) {
          newFileUrls.add(block.content);
        }
      });

      console.log('📊 레슨 파일 비교:', {
        oldBlocksCount: oldBlocks.length,
        newBlocksCount: newBlocks.length,
        oldFileCount: oldBlocks.filter((b: any) => (b.type === 'pdf' || b.type === 'image' || b.type === 'video') && b.content).length,
        newFileCount: newFileUrls.size
      });

      // 이전 contentBlocks에서 삭제된 파일만 찾아서 삭제
      const uploadService = await getUploadService();

      let deletedCount = 0;
      for (const block of oldBlocks) {
        if ((block.type === 'pdf' || block.type === 'image' || block.type === 'video') && block.content) {
          // 새로운 contentBlocks에 없는 파일만 삭제
          if (!newFileUrls.has(block.content)) {
            try {
              console.log(`🗑️ 레슨 파일 삭제 시도: ${block.content} (타입: ${block.type})`);
              await uploadService.deleteFile(block.content);
              console.log(`✅ 삭제된 레슨 파일 삭제 성공: ${block.content} (타입: ${block.type})`);
              deletedCount++;
            } catch (error) {
              console.error(`❌ 레슨 파일 삭제 실패: ${block.content}`, error);
            }
          }
        }
      }
      console.log(`📊 레슨 파일 삭제 완료: ${deletedCount}개 파일 삭제됨`);
    } catch (error) {
      console.warn('레슨 description 비교 실패, 전체 삭제 시도:', error);
      // JSON 파싱 실패 시 기존 방식으로 전체 삭제
      await this.deleteLessonFiles({ description: oldDescription } as Lesson);
    }
  }

  // 레슨의 파일 삭제 헬퍼 메서드
  private async deleteLessonFiles(lesson: Lesson): Promise<void> {
    if (!lesson.description) {
      return;
    }

    try {
      const contentBlocks = JSON.parse(lesson.description);
      if (Array.isArray(contentBlocks)) {
        // UploadService를 통해 파일 삭제 (환경변수 기반 경로 처리)
        const uploadService = await getUploadService();

        for (const block of contentBlocks) {
          // PDF, 이미지, 비디오 블록의 파일 삭제
          if ((block.type === 'pdf' || block.type === 'image' || block.type === 'video') && block.content) {
            try {
              await uploadService.deleteFile(block.content);
              console.log(`✅ 레슨 파일 삭제: ${block.content} (타입: ${block.type})`);
            } catch (error) {
              console.error(`❌ 레슨 파일 삭제 실패: ${block.content}`, error);
            }
          }
        }
      }
    } catch (error) {
      // JSON 파싱 실패 시 무시 (기존 텍스트 형식일 수 있음)
      console.warn(`레슨 description 파싱 실패 (ID: ${lesson.id}, 파일 삭제 건너뜀):`, error);
    }
  }

  async removeLesson(id: number): Promise<void> {
    try {
      // 레슨 조회
      const lesson = await this.lessonRepository.findOne({ where: { id } });
      if (!lesson) {
        throw new Error(`Lesson with ID ${id} not found`);
      }

      // 레슨의 파일 삭제
      await this.deleteLessonFiles(lesson);

      // 레슨 삭제
      await this.lessonRepository.delete(id);
    } catch (error) {
      console.error(`레슨 삭제 실패 (ID: ${id}):`, error);
      throw error;
    }
  }
}

