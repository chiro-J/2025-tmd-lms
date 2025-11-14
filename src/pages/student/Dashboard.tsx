import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Key, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import UserInfoCard from "../../components/student/UserInfoCard";
import StudentCalendar from "../../components/student/StudentCalendar";
import WeeklyActivity from "../../components/student/WeeklyActivity";
import RecentCourse from "../../components/student/RecentCourse";
import EnrollCodeModal from "../../components/modals/EnrollCodeModal";
import {
  getCourses,
  getUserEnrollments,
  enrollInCourse,
  unenrollFromCourse,
} from "../../core/api/courses";
import type { Course } from "../../types";

function StudentDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 강좌 목록 새로고침용
  const [lastLearnedCourse, setLastLearnedCourse] = useState<
    Course | undefined
  >(undefined);

  // 등록된 강좌 정보 로드 함수
  const loadEnrolledCourses = async () => {
    if (!isLoggedIn || !user?.id) return;

    try {
      setLoading(true);
      // DB에서 수강 목록 가져오기
      const enrollments = await getUserEnrollments(user.id);
      const enrolledCourses = enrollments.map(
        (enrollment) => enrollment.course as Course
      );
      setCourses(enrolledCourses);

      // localStorage 동기화 (백업용)
      const courseIds = enrolledCourses.map((c) => Number(c.id));
      localStorage.setItem("enrolledCourseIds", JSON.stringify(courseIds));
    } catch (error) {
      console.error("수강 목록 로드 실패:", error);
      // 실패 시 localStorage에서 복구 시도
      const enrolledCourseIds = JSON.parse(
        localStorage.getItem("enrolledCourseIds") || "[]"
      ) as number[];

      if (enrolledCourseIds.length > 0) {
        try {
          const allCourses = await getCourses();
          const enrolledCourses = allCourses.filter((course) =>
            enrolledCourseIds.includes(Number(course.id))
          );
          setCourses(enrolledCourses);
        } catch (e) {
          setCourses([]);
        }
      } else {
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 수강코드로 등록한 강좌만 표시 (로컬 스토리지에서 관리)
  useEffect(() => {
    loadEnrolledCourses();
  }, [isLoggedIn, user, refreshKey]);

  // 마지막 학습한 강좌 찾기
  useEffect(() => {
    if (courses.length > 0) {
      const lastLearnedCourseId = localStorage.getItem("lastLearnedCourseId");
      if (lastLearnedCourseId) {
        const course = courses.find(
          (c) => Number(c.id) === Number(lastLearnedCourseId)
        );
        if (course) {
          setLastLearnedCourse(course);
        } else {
          // 마지막 학습한 강좌가 등록된 강좌 목록에 없으면 첫 번째 강좌 표시
          setLastLearnedCourse(courses[0]);
        }
      } else {
        // 마지막 학습 기록이 없으면 첫 번째 강좌 표시
        setLastLearnedCourse(courses[0]);
      }
    } else {
      setLastLearnedCourse(undefined);
    }
  }, [courses]);

  // 수강코드 등록 성공 시 강좌 목록 새로고침
  const handleEnrollSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // 강좌 목록에서 제거
  const handleRemoveCourse = async (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    if (!user?.id) return;

    if (window.confirm("정말 이 강좌를 목록에서 제거하시겠습니까?")) {
      try {
        await unenrollFromCourse(courseId, user.id);
        // 목록 새로고침
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error("수강 취소 실패:", error);
        alert("수강 취소에 실패했습니다.");
      }
    }
  };

  // 비로그인 상태일 때 환영 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/welcome", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  // 로그인되지 않은 상태면 아무것도 렌더링하지 않음
  if (!isLoggedIn || !user) {
    return null;
  }

  // Get current date and time
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
  const timeStr = `오후 ${String(now.getHours() % 12 || 12).padStart(
    2,
    "0"
  )}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-surface-200">
      <main className="px-2 py-4 mx-auto max-w-7xl md:py-8">
        <div className="space-y-4 md:space-y-6">
          {/* Top Row: Profile (20%) + Right Content (80%) */}
          <div className="grid grid-cols-1 lg:grid-cols-[20%_1fr] gap-4 md:gap-6">
            {/* Left: Profile Card + Tooltip Display Area */}
            <div className="flex flex-col gap-4">
              {/* Profile Card */}
              <div className="h-[320px] flex-shrink-0">
                {user && <UserInfoCard user={user} />}
              </div>
              {/* Tooltip Display Area - Row 1 높이(약 80px) + gap(16px) + Row 2 높이(536px) = 632px에서 프로필(320px) + gap(16px) = 336px를 뺀 값 */}
              <div
                id="calendar-tooltip-area"
                className="flex flex-col items-center justify-center p-4 card-panel"
                style={{ height: "299px" }}
              >
                <div className="text-sm text-center text-neutral-500">
                  날짜를 클릭하면 상세 정보가 여기에 표시됩니다
                </div>
              </div>
            </div>

            {/* Right: Top Content Grid */}
            <div className="flex flex-col gap-4">
              {/* Row 1: Enroll Code + Last Login */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Enroll Code Section */}
                <div className="flex items-center justify-between p-4 card-panel">
                  <div className="flex items-center space-x-3">
                    <Key className="w-4 h-4 md:h-5 md:w-5 text-neutral-700" />
                    <h3 className="text-base font-bold md:text-lg text-neutral-900">
                      수강 코드
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="px-3 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg md:px-4 hover:bg-blue-700"
                  >
                    코드 입력
                  </button>
                </div>

                {/* Last Login Info */}
                <div className="flex items-center justify-between p-4 card-panel">
                  <span className="text-sm font-semibold md:text-base text-neutral-900">
                    최근 로그인 시각
                  </span>
                  <div className="text-sm font-medium md:text-base text-neutral-700">
                    {dateStr} {timeStr}
                  </div>
                </div>
              </div>

              {/* Row 2: Calendar + (Weekly Activity + Recent Course stacked) */}
              <div
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                style={{ height: "536px" }}
              >
                <div className="flex flex-col h-full">
                  <StudentCalendar />
                </div>
                <div className="flex flex-col h-full gap-4">
                  <WeeklyActivity />
                  <RecentCourse
                    recentCourse={lastLearnedCourse}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Course Sections (Full Width) */}
          <div className="space-y-6">
            {/* Learning Now Section - 작은 가로 카드들 */}
            <section className="p-6 border border-gray-300 card-panel">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-base-content">
                  수강중인 강좌({courses.length})
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {loading ? (
                  <div className="py-8 text-center text-gray-500 col-span-full">
                    로딩 중...
                  </div>
                ) : courses.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 col-span-full">
                    수강 중인 강의가 없습니다.
                  </div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className="card-panel p-4 cursor-pointer hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 border border-gray-200 relative"
                      onClick={() => navigate(`/student/course/${course.id}`)}
                    >
                      {/* 삭제 버튼 */}
                      <button
                        onClick={(e) =>
                          handleRemoveCourse(Number(course.id), e)
                        }
                        className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md"
                        aria-label="강좌 제거"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-3">
                        {/* Course Thumbnail */}
                        <div
                          className="relative w-full h-24 overflow-hidden bg-center bg-cover rounded-lg"
                          style={{
                            backgroundImage: `url('${
                              course.thumbnail || "/photo/ccc.jpg"
                            }')`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black/20"></div>
                        </div>

                        {/* Course Info */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-base-content line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-xs text-base-content/70">
                            강의자: {course.instructor || "강사명 없음"}
                          </p>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-base-content/70">
                                진행률
                              </span>
                              <span className="font-medium text-base-content/80">
                                {course.progress || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Enroll Code Modal */}
      <EnrollCodeModal
        open={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        onEnrollSuccess={handleEnrollSuccess}
      />
    </div>
  );
}

export default StudentDashboard;
