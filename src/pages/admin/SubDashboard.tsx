import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  Settings,
  Shield
} from "lucide-react";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import StudentManagement from "../../components/admin/StudentManagement";
import CourseManagement from "../../components/admin/CourseManagement";
import InstructorApproval from "../../components/admin/InstructorApproval";
import NoticeManagement from "../../components/admin/NoticeManagement";
import SystemSettings from "../../components/admin/SystemSettings";
import * as adminApi from "../../core/api/admin";
import type { SubAdmin, Instructor, Student, Course, Notice, Inquiry } from "../../core/api/admin";

export default function SubDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<"overview" | "students" | "instructors" | "courses" | "platform" | "settings">("overview");

  // 데이터 상태
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    pendingApprovals: 0,
    totalCourses: 0,
    totalNotices: 0,
    pendingInquiries: 0
  });

  // 로딩 상태
  const [loading, setLoading] = useState<Record<string, boolean>>({
    students: false,
    courses: false,
    instructors: false,
    inquiries: false,
    notices: false,
  });

  // URL 파라미터 처리
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && ['overview', 'students', 'instructors', 'courses', 'platform', 'settings'].includes(section)) {
      setActiveSection(section as "overview" | "students" | "instructors" | "courses" | "platform" | "settings");
    }
  }, [searchParams]);

  // 데이터 로드 함수들
  const loadStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const data = await adminApi.getStudents();
      const studentsWithCourses = data.map(student => ({
        ...student,
        enrolledCourses: [] as string[],
      }));
      setStudents(studentsWithCourses);
      setStats(prev => ({ ...prev, totalStudents: data.length }));
    } catch (error: any) {
      console.error('수강생 목록 로드 실패:', error);
      setStudents([]);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const loadCourses = async () => {
    setLoading(prev => ({ ...prev, courses: true }));
    try {
      const data = await adminApi.getCoursesForAdmin();
      setCourses(data);
      setStats(prev => ({ ...prev, totalCourses: data.length }));
    } catch (error: any) {
      console.error('강좌 목록 로드 실패:', error);
      setCourses([]);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const loadInstructors = async () => {
    setLoading(prev => ({ ...prev, instructors: true }));
    try {
      const data = await adminApi.getInstructors();
      setInstructors(data);
      setStats(prev => ({
        ...prev,
        totalInstructors: data.filter(i => i.status === 'approved').length,
        pendingApprovals: data.filter(i => i.status === 'pending').length
      }));
    } catch (error: any) {
      console.error('강사 목록 로드 실패:', error);
      setInstructors([]);
    } finally {
      setLoading(prev => ({ ...prev, instructors: false }));
    }
  };

  const loadInquiries = async () => {
    setLoading(prev => ({ ...prev, inquiries: true }));
    try {
      const data = await adminApi.getInquiries();
      const formattedData = data.map(inquiry => ({
        ...inquiry,
        user: inquiry.userName || inquiry.user,
      }));
      setInquiries(formattedData);
      setStats(prev => ({ ...prev, pendingInquiries: data.filter(i => i.status === 'pending').length }));
    } catch (error: any) {
      console.error('문의사항 목록 로드 실패:', error);
      setInquiries([]);
    } finally {
      setLoading(prev => ({ ...prev, inquiries: false }));
    }
  };

  const loadNotices = async () => {
    setLoading(prev => ({ ...prev, notices: true }));
    try {
      const data = await adminApi.getNotices();
      setNotices(data);
      setStats(prev => ({ ...prev, totalNotices: data.length }));
    } catch (error: any) {
      console.error('공지사항 목록 로드 실패:', error);
      setNotices([]);
    } finally {
      setLoading(prev => ({ ...prev, notices: false }));
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadStudents();
    loadCourses();
    loadInstructors();
    loadInquiries();
    loadNotices();
  }, []);

  // 섹션 변경 시 해당 데이터 다시 로드
  useEffect(() => {
    if (activeSection === 'students') {
      loadStudents();
    } else if (activeSection === 'courses') {
      loadCourses();
    } else if (activeSection === 'instructors') {
      loadInstructors();
    } else if (activeSection === 'platform') {
      loadInquiries();
      loadNotices();
    }
  }, [activeSection]);

  // 수강생 관련 핸들러
  const handleStudentWithdraw = async (student: Student) => {
    if (!confirm('정말 이 수강생을 삭제하시겠습니까?')) return;
    try {
      await adminApi.deleteStudent(student.id);
      await loadStudents();
      alert('수강생이 삭제되었습니다.');
    } catch (error) {
      console.error('수강생 삭제 실패:', error);
      alert('수강생 삭제에 실패했습니다.');
    }
  };

  // 강사 관련 핸들러
  const handleApproveInstructor = async (id: number) => {
    try {
      await adminApi.approveInstructor(id);
      await loadInstructors();
      alert('강사가 승인되었습니다.');
    } catch (error) {
      console.error('강사 승인 실패:', error);
      alert('강사 승인에 실패했습니다.');
    }
  };

  const handleRejectInstructor = async (id: number) => {
    try {
      await adminApi.rejectInstructor(id);
      await loadInstructors();
      alert('강사가 거부되었습니다.');
    } catch (error) {
      console.error('강사 거부 실패:', error);
      alert('강사 거부에 실패했습니다.');
    }
  };

  // 강좌 관련 핸들러
  const handleCourseEdit = (course: Course) => {
    navigate(`/instructor/course/${course.id}/home`);
  };

  const handleCourseDelete = async (courseId: number) => {
    if (!confirm('정말 이 강좌를 삭제하시겠습니까?')) return;
    try {
      await adminApi.deleteCourse(courseId);
      await loadCourses();
      alert('강좌가 삭제되었습니다.');
    } catch (error) {
      console.error('강좌 삭제 실패:', error);
      alert('강좌 삭제에 실패했습니다.');
    }
  };

  const handleCourseApprove = async (courseId: number) => {
    try {
      await adminApi.approveCourse(courseId);
      await loadCourses();
      alert('강좌가 승인되었습니다.');
    } catch (error) {
      console.error('강좌 승인 실패:', error);
      alert('강좌 승인에 실패했습니다.');
    }
  };

  const handleCourseReject = async (courseId: number) => {
    try {
      await adminApi.rejectCourse(courseId);
      await loadCourses();
      alert('강좌가 거부되었습니다.');
    } catch (error) {
      console.error('강좌 거부 실패:', error);
      alert('강좌 거부에 실패했습니다.');
    }
  };

  const handleRespondToInquiry = async (id: number, response: string) => {
    try {
      await adminApi.respondToInquiry(id, response);
      await loadInquiries();
      alert('문의사항 답변이 전달되었습니다.');
    } catch (error) {
      console.error('문의사항 답변 실패:', error);
      alert('문의사항 답변에 실패했습니다.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">서브 관리자 대시보드</h1>
              <p className="text-gray-600">수강생, 강사, 강좌, 플랫폼 관리</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection("settings")}
                className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>시스템 설정</span>
              </button>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                서브 관리자
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                활성
              </div>
            </div>
          </div>

          {/* 메인 관리 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 수강생 관리 */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setActiveSection("students")}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">수강생 관리</h3>
                    <p className="text-sm text-gray-600 break-words leading-tight">전체 수강생 조회 및 관리</p>
                  </div>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 break-words">전체 수강생</span>
                    <span className="text-lg font-bold text-gray-900">{stats.totalStudents}명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 break-words">활성 수강생</span>
                    <span className="text-sm font-medium text-green-600">{students.filter(s => s.status === 'active').length}명</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 강사 관리 */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setActiveSection("instructors")}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">강사 관리</h3>
                    <p className="text-sm text-gray-600 break-words leading-tight">강사 승인 및 관리</p>
                  </div>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 break-words">승인된 강사</span>
                    <span className="text-lg font-bold text-gray-900">{stats.totalInstructors}명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 break-words">승인 대기</span>
                    <span className="text-sm font-medium text-yellow-600">{stats.pendingApprovals}명</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 강좌 관리 */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setActiveSection("courses")}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">강좌 관리</h3>
                    <p className="text-sm text-gray-600 break-words leading-tight">강좌 승인 및 관리</p>
                  </div>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 break-words">전체 강좌</span>
                    <span className="text-lg font-bold text-gray-900">{stats.totalCourses}개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 break-words">활성 강좌</span>
                    <span className="text-sm font-medium text-green-600">{courses.filter(c => c.status === 'active').length}개</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 플랫폼 관리 */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setActiveSection("platform")}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">플랫폼 관리</h3>
                    <p className="text-sm text-gray-600 break-words leading-tight">공지사항 및<br />문의 관리</p>
                  </div>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 break-words">공지사항</span>
                    <span className="text-lg font-bold text-gray-900">{stats.totalNotices}개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 break-words">문의 대기</span>
                    <span className="text-sm font-medium text-red-600">{stats.pendingInquiries}건</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 섹션 컨텐츠 */}
          {activeSection === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="통계 요약">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 break-words">전체 수강생</span>
                    <span className="text-lg font-bold text-gray-900">{stats.totalStudents}명</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 break-words">승인된 강사</span>
                    <span className="text-lg font-bold text-gray-900">{stats.totalInstructors}명</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 break-words">전체 강좌</span>
                    <span className="text-lg font-bold text-gray-900">{stats.totalCourses}개</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 break-words">문의 대기</span>
                    <span className="text-lg font-bold text-yellow-600">{stats.pendingInquiries}건</span>
                  </div>
                </div>
              </Section>

              <Section title="시스템 상태">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 break-words">승인 대기 강사</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={stats.pendingApprovals > 0 ? (stats.pendingApprovals / (stats.totalInstructors + stats.pendingApprovals)) * 100 : 0} />
                      <span className="text-sm font-medium text-gray-600">{stats.pendingApprovals}명</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 break-words">활성 강좌 비율</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={stats.totalCourses > 0 ? (courses.filter(c => c.status === 'active').length / stats.totalCourses) * 100 : 0} />
                      <span className="text-sm font-medium text-gray-600">{courses.filter(c => c.status === 'active').length}/{stats.totalCourses}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 break-words">활성 수강생 비율</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={stats.totalStudents > 0 ? (students.filter(s => s.status === 'active').length / stats.totalStudents) * 100 : 0} />
                      <span className="text-sm font-medium text-gray-600">{students.filter(s => s.status === 'active').length}/{stats.totalStudents}</span>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* 수강생 관리 섹션 */}
          {activeSection === "students" && (
            <>
              {loading.students ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : (
                <StudentManagement
                  students={students.map(s => ({ ...s, enrolledCourses: s.enrolledCourses || [] }))}
                  onStudentWithdraw={handleStudentWithdraw}
                  showActions={true}
                />
              )}
            </>
          )}

          {/* 강사 관리 섹션 */}
          {activeSection === "instructors" && (
            <>
              {loading.instructors ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : (
                <InstructorApproval
                  instructors={instructors}
                  onApproveInstructor={handleApproveInstructor}
                  onRejectInstructor={handleRejectInstructor}
                  showActions={true}
                />
              )}
            </>
          )}

          {/* 강좌 관리 섹션 */}
          {activeSection === "courses" && (
            <>
              {loading.courses ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : (
                <CourseManagement
                  courses={courses}
                  onCourseEdit={handleCourseEdit}
                  onCourseDelete={handleCourseDelete}
                  onCourseApprove={handleCourseApprove}
                  onCourseReject={handleCourseReject}
                  showActions={true}
                />
              )}
            </>
          )}

          {/* 플랫폼 관리 섹션 */}
          {activeSection === "platform" && (
            <>
              {(loading.inquiries || loading.notices) ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : (
                <NoticeManagement
                  inquiries={inquiries}
                  onRespondToInquiry={handleRespondToInquiry}
                  showActions={true}
                />
              )}
            </>
          )}

          {/* 시스템 설정 섹션 */}
          {activeSection === "settings" && (
            <SystemSettings />
          )}
        </div>
      </div>

    </div>
  );
}
