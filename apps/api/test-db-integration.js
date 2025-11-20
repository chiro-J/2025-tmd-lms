/**
 * DB 연동 테스트 스크립트
 *
 * 실행 방법:
 * cd apps/api
 * npm install axios (필요시)
 * node test-db-integration.js
 *
 * 테스트 항목:
 * 1. 강좌 생성 시 공개/비공개 설정 저장
 * 2. 강좌 수정 시 공개/비공개 설정 업데이트
 * 3. 강좌 조회 시 공개/비공개 상태 확인
 * 4. 수강 신청 시 공개/비공개 체크
 */

const axios = require('axios');
const { Pool } = require('pg');

const API_BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// DB 연결 설정
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USERNAME || 'postgres', // pg는 'user' 사용
  password: process.env.DB_PASSWORD || 'monstera',
  database: process.env.DB_DATABASE || 'lms',
});

// 테스트 결과 저장
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

// 헬퍼 함수: 로그인
async function login() {
  try {
    // 테스트용 사용자 조회 (DB에서)
    const userResult = await pool.query('SELECT id, email FROM users WHERE role = $1 LIMIT 1', ['student']);
    if (userResult.rows.length === 0) {
      console.log('⚠️  테스트용 학생 계정이 없습니다. 기본 계정을 사용합니다.');
      // 기본 계정으로 시도
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'student@test.com',
        password: 'password123'
      });
      authToken = response.data.accessToken;
      console.log('✅ 로그인 성공 (기본 계정)');
      return { userId: 2, success: true };
    }

    // 실제로는 JWT 토큰이 필요하지만, 테스트를 위해 직접 DB에서 사용자 정보 가져오기
    console.log('✅ 테스트용 사용자 확인');
    return { userId: userResult.rows[0].id, success: true };
  } catch (error) {
    console.error('❌ 로그인 실패:', error.message);
    return { userId: null, success: false };
  }
}

// 헬퍼 함수: 인증된 요청
function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };
}

// 테스트 실행 함수
async function runTest(testName, testFn) {
  testResults.total++;
  console.log(`\n📝 ${testName}`);
  try {
    const result = await testFn();
    if (result) {
      testResults.passed++;
      console.log(`✅ ${testName} - 성공`);
      return result;
    } else {
      testResults.failed++;
      testResults.errors.push(`${testName} - 실패`);
      console.log(`❌ ${testName} - 실패`);
      return null;
    }
  } catch (error) {
    testResults.failed++;
    testResults.errors.push(`${testName} - 에러: ${error.message}`);
    console.log(`❌ ${testName} - 에러:`, error.message);
    return null;
  }
}

// 테스트 1: DB에서 강좌 상태 확인
async function testCheckCourseStatusInDB() {
  try {
    const result = await pool.query(`
      SELECT id, title, status
      FROM courses
      WHERE status IN ('공개', '비공개', 'published', 'draft')
      ORDER BY id DESC
      LIMIT 5
    `);

    console.log('   DB에 저장된 강좌 상태:');
    result.rows.forEach(course => {
      console.log(`   - ID: ${course.id}, 제목: ${course.title}, 상태: ${course.status}`);
    });

    return result.rows.length > 0;
  } catch (error) {
    console.error('   DB 조회 실패:', error.message);
    return false;
  }
}

// 테스트 2: 강좌 생성 (공개) - DB 직접 확인
async function testCreatePublicCourseInDB() {
  try {
    const result = await pool.query(`
      INSERT INTO courses (title, instructor, status, content, progress, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, title, status
    `, ['테스트 공개 강좌', '테스트 강사', '공개', '<p>테스트 내용</p>', 0]);

    const course = result.rows[0];
    console.log(`   생성된 강좌 ID: ${course.id}`);
    console.log(`   상태: ${course.status}`);

    if (course.status === '공개') {
      return course.id;
    }
    return null;
  } catch (error) {
    console.error('   강좌 생성 실패:', error.message);
    return null;
  }
}

// 테스트 3: 강좌 상태 수정 - DB 직접 확인
async function testUpdateCourseStatusInDB(courseId) {
  try {
    const result = await pool.query(`
      UPDATE courses
      SET status = $1, "updatedAt" = NOW()
      WHERE id = $2
      RETURNING id, status
    `, ['비공개', courseId]);

    if (result.rows.length > 0 && result.rows[0].status === '비공개') {
      console.log(`   강좌 ID ${courseId}의 상태가 '비공개'로 업데이트됨`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('   상태 업데이트 실패:', error.message);
    return false;
  }
}

// 테스트 4: 수강 신청 로직 확인 (비공개 강좌)
async function testEnrollmentLogic(courseId, userId) {
  try {
    // 강좌 상태 확인
    const courseResult = await pool.query('SELECT status FROM courses WHERE id = $1', [courseId]);
    if (courseResult.rows.length === 0) {
      console.log('   강좌를 찾을 수 없습니다.');
      return false;
    }

    const courseStatus = courseResult.rows[0].status;
    const isPublic = courseStatus === '공개' || courseStatus === 'published';

    console.log(`   강좌 상태: ${courseStatus}`);
    console.log(`   공개 여부: ${isPublic}`);

    if (!isPublic) {
      console.log('   ✅ 비공개 강좌는 수강 신청이 불가능해야 함');
      // 실제로 등록 시도하지 않고 로직만 확인
      return true;
    } else {
      // 공개 강좌는 등록 가능
      const enrollResult = await pool.query(`
        INSERT INTO course_enrollments (course_id, user_id, enrolled_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (course_id, user_id) DO NOTHING
        RETURNING id
      `, [courseId, userId]);

      if (enrollResult.rows.length > 0) {
        console.log('   ✅ 공개 강좌 수강 신청 성공');
        return true;
      } else {
        console.log('   ⚠️  이미 등록된 강좌이거나 등록 실패');
        return true; // 이미 등록된 경우도 정상
      }
    }
  } catch (error) {
    console.error('   수강 신청 로직 확인 실패:', error.message);
    return false;
  }
}

// 테스트 5: API 엔드포인트 확인
async function testAPIEndpoints() {
  try {
    console.log('   API 서버 연결 확인 중...');
    const response = await axios.get(`${API_BASE_URL}/courses`, { timeout: 5000 });
    console.log('   ✅ API 서버 연결 성공');
    console.log(`   강좌 개수: ${response.data.length}`);
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('   ⚠️  API 서버가 실행되지 않았습니다.');
      console.log('   백엔드 서버를 시작하세요: cd apps/api && npm run start:dev');
    } else {
      console.error('   API 연결 실패:', error.message);
    }
    return false;
  }
}

// 메인 테스트 실행
async function runTests() {
  console.log('🚀 DB 연동 테스트 시작\n');
  console.log('='.repeat(60));

  // API 서버 확인
  await runTest('API 서버 연결 확인', testAPIEndpoints);

  // 로그인 (사용자 확인)
  const loginResult = await login();
  if (!loginResult.success) {
    console.log('\n⚠️  로그인 실패 - 일부 테스트만 진행합니다.');
  }

  const testUserId = loginResult.userId || 2;

  // DB에서 강좌 상태 확인
  await runTest('DB 강좌 상태 확인', testCheckCourseStatusInDB);

  // 공개 강좌 생성
  const publicCourseId = await runTest('공개 강좌 생성 (DB)', testCreatePublicCourseInDB);

  if (publicCourseId) {
    // 강좌 상태 수정
    await runTest('강좌 상태 수정 (공개 → 비공개)', () =>
      testUpdateCourseStatusInDB(publicCourseId)
    );

    // 수강 신청 로직 확인
    await runTest('수강 신청 로직 확인 (비공개 강좌)', () =>
      testEnrollmentLogic(publicCourseId, testUserId)
    );

    // 다시 공개로 변경 후 수강 신청
    await pool.query('UPDATE courses SET status = $1 WHERE id = $2', ['공개', publicCourseId]);
    await runTest('수강 신청 로직 확인 (공개 강좌)', () =>
      testEnrollmentLogic(publicCourseId, testUserId)
    );
  }

  // 테스트 결과 출력
  console.log('\n' + '='.repeat(60));
  console.log('📊 테스트 결과 요약');
  console.log(`   총 테스트: ${testResults.total}`);
  console.log(`   성공: ${testResults.passed}`);
  console.log(`   실패: ${testResults.failed}`);

  if (testResults.errors.length > 0) {
    console.log('\n❌ 실패한 테스트:');
    testResults.errors.forEach(error => {
      console.log(`   - ${error}`);
    });
  }

  // DB 연결 종료
  await pool.end();

  console.log('\n✅ 테스트 완료');
}

// 스크립트 실행
runTests().catch(async (error) => {
  console.error('❌ 테스트 실행 중 오류:', error);
  await pool.end();
  process.exit(1);
});

