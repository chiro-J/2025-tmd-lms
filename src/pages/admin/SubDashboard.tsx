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

export default function SubDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<"overview" | "students" | "instructors" | "courses" | "platform">("overview");

  // URL 파라미터 처리
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && ['overview', 'students', 'instructors', 'courses', 'platform'].includes(section)) {
      setActiveSection(section as "overview" | "students" | "instructors" | "courses" | "platform");
    }
  }, [searchParams]);

  const stats = {
    totalStudents: 280,
    totalInstructors: 12,
    pendingApprovals: 3,
    totalCourses: 25,
    totalNotices: 2,
    pendingInquiries: 5
  };

  // 수강생 데이터
  const allStudents = [
    {
      id: 1,
      name: "김수강",
      email: "kim@student.com",
      phone: "010-1234-5678",
      enrolledCourses: ["React 기초", "JavaScript 심화"],
      enrolledDate: "2025-01-10",
      lastLogin: "2025-01-15 14:30",
      status: "active" as const,
      totalProgress: 75
    },
    {
      id: 2,
      name: "이학생",
      email: "lee@student.com",
      phone: "010-2345-6789",
      enrolledCourses: ["JavaScript 심화", "웹 개발 풀스택"],
      enrolledDate: "2025-01-08",
      lastLogin: "2025-01-15 09:15",
      status: "active" as const,
      totalProgress: 90
    },
    {
      id: 3,
      name: "박학습",
      email: "park@student.com",
      phone: "010-3456-7890",
      enrolledCourses: ["Python 데이터 분석"],
      enrolledDate: "2025-01-05",
      lastLogin: "2025-01-14 16:45",
      status: "inactive" as const,
      totalProgress: 60
    },
    {
      id: 4,
      name: "최공부",
      email: "choi@student.com",
      phone: "010-4567-8901",
      enrolledCourses: ["웹 개발 풀스택", "React 기초"],
      enrolledDate: "2025-01-03",
      lastLogin: "2025-01-15 11:20",
      status: "active" as const,
      totalProgress: 45
    },
    {
      id: 5,
      name: "정학원",
      email: "jung@student.com",
      phone: "010-5678-9012",
      enrolledCourses: ["React 기초"],
      enrolledDate: "2025-01-01",
      lastLogin: "2025-01-12 08:30",
      status: "active" as const,
      totalProgress: 30
    },
  ];

  // 강사 데이터
  const allInstructors = [
    {
      id: 1,
      name: "김강사",
      email: "kim@example.com",
      phone: "010-1234-5678",
      specialization: "React, JavaScript",
      experience: "5년",
      education: "컴퓨터공학 학사",
      appliedDate: "2025-01-15",
      status: "pending" as const,
      documents: ["이력서.pdf", "학위증명서.pdf", "포트폴리오.pdf"],
      portfolio: "https://kim-portfolio.com",
      motivation: "학생들에게 실무 경험을 바탕으로 한 실용적인 강의를 제공하고 싶습니다.",
      previousExperience: "ABC 회사에서 3년간 프론트엔드 개발자로 근무"
    },
    {
      id: 2,
      name: "이강사",
      email: "lee@example.com",
      phone: "010-2345-6789",
      specialization: "JavaScript, Node.js",
      experience: "3년",
      education: "정보통신공학 학사",
      appliedDate: "2025-01-14",
      status: "pending" as const,
      documents: ["이력서.pdf", "학위증명서.pdf"],
      portfolio: "https://lee-portfolio.com",
      motivation: "웹 개발의 기초부터 고급까지 체계적으로 가르치고 싶습니다.",
      previousExperience: "XYZ 스타트업에서 2년간 풀스택 개발자로 근무"
    },
    {
      id: 3,
      name: "박강사",
      email: "park@example.com",
      phone: "010-3456-7890",
      specialization: "Python, Django",
      experience: "7년",
      education: "컴퓨터공학 석사",
      appliedDate: "2025-01-13",
      status: "approved" as const,
      documents: ["이력서.pdf", "학위증명서.pdf", "포트폴리오.pdf"],
      portfolio: "https://park-portfolio.com",
      motivation: "데이터 사이언스와 백엔드 개발을 전문적으로 가르치고 싶습니다.",
      previousExperience: "DEF 대기업에서 5년간 백엔드 개발자로 근무"
    },
    {
      id: 4,
      name: "김승인",
      email: "kim@instructor.com",
      phone: "010-4567-8901",
      specialization: "React, TypeScript",
      experience: "4년",
      education: "컴퓨터공학 학사",
      appliedDate: "2025-01-10",
      status: "approved" as const,
      documents: ["이력서.pdf", "학위증명서.pdf"],
      portfolio: "https://kim-approved-portfolio.com",
      motivation: "타입스크립트를 활용한 현대적인 웹 개발을 가르치고 싶습니다.",
      previousExperience: "GHI 회사에서 3년간 프론트엔드 개발자로 근무"
    },
    {
      id: 5,
      name: "이승인",
      email: "lee@instructor.com",
      phone: "010-5678-9012",
      specialization: "JavaScript, Vue.js",
      experience: "6년",
      education: "정보통신공학 석사",
      appliedDate: "2025-01-08",
      status: "rejected" as const,
      documents: ["이력서.pdf", "학위증명서.pdf"],
      portfolio: "https://lee-rejected-portfolio.com",
      motivation: "Vue.js 프레임워크를 활용한 웹 개발을 가르치고 싶습니다.",
      previousExperience: "JKL 회사에서 4년간 프론트엔드 개발자로 근무"
    }
  ];

  // 강좌 데이터
  const courses = [
    {
      id: 1,
      title: "React 기초 강의",
      instructor: "김승인",
      students: 45,
      status: "active" as const,
      createdDate: "2025-01-10"
    },
    {
      id: 2,
      title: "JavaScript 심화",
      instructor: "이승인",
      students: 32,
      status: "active" as const,
      createdDate: "2025-01-08"
    },
    {
      id: 3,
      title: "Python 데이터 분석",
      instructor: "박승인",
      students: 28,
      status: "inactive" as const,
      createdDate: "2025-01-05"
    }
  ];


  // 문의사항 데이터
  const inquiries = [
    {
      id: 1,
      title: "강의 접속 문제",
      user: "김수강",
      email: "kim@student.com",
      content: "강의 영상이 재생되지 않습니다.",
      createdDate: "2025-01-15",
      status: "pending"
    },
    {
      id: 2,
      title: "결제 문의",
      user: "이학생",
      email: "lee@student.com",
      content: "결제가 되지 않는 문제가 있습니다.",
      createdDate: "2025-01-14",
      status: "pending"
    }
  ];

  const recentActivities = [
    { id: 1, type: "instructor_approval", message: "새로운 강의자 신청", time: "2시간 전", status: "pending" },
    { id: 2, type: "content_upload", message: "강의 자료 업로드", time: "4시간 전", status: "completed" },
    { id: 3, type: "user_registration", message: "새로운 수강생 등록", time: "6시간 전", status: "completed" },
    { id: 4, type: "course_creation", message: "새 강의 생성", time: "1일 전", status: "completed" },
  ];

  // 수강생 관련 핸들러

  const handleStudentWithdraw = (student: any) => {
    // 실제 구현에서는 API 호출
  };

  // 강사 관련 핸들러
  const handleApproveInstructor = (id: number) => {
    // 실제 구현에서는 API 호출
  };

  const handleRejectInstructor = (id: number) => {
    // 실제 구현에서는 API 호출
  };


  // 강좌 관련 핸들러


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
              <button className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
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
                    <span className="text-sm font-medium text-green-600">{allStudents.filter(s => s.status === 'active').length}명</span>
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
              <Section title="최근 활동">
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 break-words">{activity.message}</p>
                        <p className="text-xs text-gray-500 break-words">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="시스템 상태">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 break-words">콘텐츠 업로드</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={75} />
                      <span className="text-sm font-medium text-gray-600">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 break-words">강의 승인률</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={85} />
                      <span className="text-sm font-medium text-gray-600">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 break-words">사용자 만족도</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={92} />
                      <span className="text-sm font-medium text-gray-600">92%</span>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {/* 수강생 관리 섹션 */}
          {activeSection === "students" && (
            <StudentManagement
              students={allStudents}
              onStudentWithdraw={handleStudentWithdraw}
              showActions={true}
            />
          )}

          {/* 강사 관리 섹션 */}
          {activeSection === "instructors" && (
            <InstructorApproval
              instructors={allInstructors}
              onApproveInstructor={handleApproveInstructor}
              onRejectInstructor={handleRejectInstructor}
              showActions={true}
            />
          )}

          {/* 강좌 관리 섹션 */}
          {activeSection === "courses" && (
            <CourseManagement
              courses={courses.map(course => ({
                id: course.id,
                title: course.title,
                instructor: course.instructor,
                status: course.status as 'active' | 'inactive' | 'pending',
                enrolledStudents: course.students,
                createdAt: course.createdDate,
                description: `${course.title} 강의입니다.`
              }))}
              onCourseEdit={(course) => {
                navigate(`/instructor/course/${course.id}/introduction`);
              }}
              onCourseDelete={() => {}}
              onCourseApprove={() => {}}
              onCourseReject={() => {}}
              showActions={true}
            />
          )}

          {/* 플랫폼 관리 섹션 */}
          {activeSection === "platform" && (
            <NoticeManagement
              inquiries={inquiries}
              showActions={true}
            />
          )}
        </div>
      </div>

    </div>
  );
}
