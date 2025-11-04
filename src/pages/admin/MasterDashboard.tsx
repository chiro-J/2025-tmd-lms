import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, CheckCircle, BookOpen, ArrowRight, X, Settings } from 'lucide-react'
import Card from '../../components/ui/Card'
import StudentManagement from '../../components/admin/StudentManagement'
import CourseManagement from '../../components/admin/CourseManagement'
import SubAdminManagement from '../../components/admin/SubAdminManagement'
import InstructorApproval from '../../components/admin/InstructorApproval'
import NoticeManagement from '../../components/admin/NoticeManagement'
import SystemSettings from '../../components/admin/SystemSettings'

export default function MasterDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'students' | 'courses' | 'subAdmins' | 'instructors' | 'platform' | 'settings'>('overview');

  // 수강생 데이터
  const students = [
    {
      id: 1,
      name: "김수강",
      email: "student1@example.com",
      phone: "010-1234-5678",
      status: 'active' as const,
      enrolledDate: "2025-01-10",
      lastLogin: "2025-01-15 14:30",
      enrolledCourses: ["React 기초", "JavaScript 고급"]
    },
    {
      id: 2,
      name: "이학습",
      email: "student2@example.com",
      phone: "010-2345-6789",
      status: 'active' as const,
      enrolledDate: "2025-01-12",
      lastLogin: "2025-01-15 09:15",
      enrolledCourses: ["Vue.js 완전정복", "Node.js 실습"]
    },
    {
      id: 3,
      name: "박공부",
      email: "student3@example.com",
      phone: "010-3456-7890",
      status: 'inactive' as const,
      enrolledDate: "2025-01-08",
      lastLogin: "2025-01-10 16:45",
      enrolledCourses: ["Python 기초"]
    }
  ];

  // 강좌 데이터
  const courses = [
    {
      id: 1,
      title: "React 완전정복",
      instructor: "김강사",
      status: 'active' as const,
      enrolledStudents: 45,
      createdAt: "2025-01-01",
      description: "React의 모든 것을 배우는 완전한 강의입니다. 기초부터 고급까지 단계별로 학습할 수 있습니다."
    },
    {
      id: 2,
      title: "JavaScript ES6+",
      instructor: "이강사",
      status: 'active' as const,
      enrolledStudents: 32,
      createdAt: "2025-01-05",
      description: "최신 JavaScript 문법과 기능들을 배우는 강의입니다. 모던 웹 개발에 필수적인 내용을 다룹니다."
    },
    {
      id: 3,
      title: "Vue.js 3 마스터",
      instructor: "박강사",
      status: 'pending' as const,
      enrolledStudents: 18,
      createdAt: "2025-01-10",
      description: "Vue.js 3의 새로운 Composition API와 최신 기능들을 배우는 강의입니다."
    }
  ];

  // 서브 관리자 데이터
  const subAdmins = [
    {
      id: 1,
      name: "김콘텐츠",
      email: "content@example.com",
      role: "Content Manager",
      status: "active" as const,
      permissions: {
        userManagement: false,
        contentManagement: true,
        systemSettings: false,
        instructorApproval: false
      },
      createdAt: "2025-01-10",
      lastLogin: "2025-01-15 14:30"
    },
    {
      id: 2,
      name: "이사용자",
      email: "user@example.com",
      role: "User Manager",
      status: "active" as const,
      permissions: {
        userManagement: true,
        contentManagement: false,
        systemSettings: false,
        instructorApproval: true
      },
      createdAt: "2025-01-08",
      lastLogin: "2025-01-15 09:15"
    },
    {
      id: 3,
      name: "박시스템",
      email: "system@example.com",
      role: "System Manager",
      status: "pending" as const,
      permissions: {
        userManagement: true,
        contentManagement: true,
        systemSettings: true,
        instructorApproval: true
      },
      createdAt: "2025-01-12",
      lastLogin: "2025-01-14 16:45"
    }
  ];

  // 강사 데이터
  const instructors = [
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
      specialization: "Python, Django",
      experience: "7년",
      education: "소프트웨어공학 석사",
      appliedDate: "2025-01-14",
      status: "pending" as const,
      documents: ["이력서.pdf", "학위증명서.pdf"],
      portfolio: "https://lee-portfolio.com",
      motivation: "백엔드 개발의 핵심 개념을 체계적으로 전달하고 싶습니다.",
      previousExperience: "XYZ 스타트업에서 백엔드 팀장으로 4년간 근무"
    },
    {
      id: 3,
      name: "박강사",
      email: "park@example.com",
      phone: "010-3456-7890",
      specialization: "Java, Spring",
      experience: "8년",
      education: "컴퓨터공학 박사",
      appliedDate: "2025-01-13",
      status: "approved" as const,
      documents: ["이력서.pdf", "학위증명서.pdf", "자격증.pdf"],
      portfolio: "https://park-portfolio.com",
      motivation: "체계적인 교육과정을 통해 학생들이 실무에 바로 적용할 수 있는 지식을 전달하고 싶습니다.",
      previousExperience: "DEF 대기업에서 시니어 개발자로 6년간 근무"
    }
  ];

  // 문의사항 데이터
  const inquiries = [
    {
      id: 1,
      title: "강의 수강 관련 문의",
      user: "김학생",
      email: "student@example.com",
      content: "강의를 수강하려고 하는데 접근이 안됩니다. 도움 부탁드립니다.",
      createdDate: "2025-01-15",
      status: "pending" as const
    },
    {
      id: 2,
      title: "결제 시스템 오류",
      user: "이수강생",
      email: "student2@example.com",
      content: "결제 과정에서 오류가 발생했습니다. 환불 처리가 가능한지 문의드립니다.",
      createdDate: "2025-01-14",
      status: "completed" as const
    },
    {
      id: 3,
      title: "강의 자료 다운로드 문제",
      user: "박공부",
      email: "student3@example.com",
      content: "강의 자료를 다운로드할 수 없습니다. 파일이 손상되었을 수 있습니다.",
      createdDate: "2025-01-13",
      status: "pending" as const
    }
  ];

  const handleStudentWithdraw = (student: any) => {
    // 실제 구현에서는 API 호출
  };

  const handleCourseEdit = (course: any) => {
    // 강좌 편집 페이지로 이동
    navigate(`/instructor/course/${course.id}/introduction`);
  };

  const handleCourseDelete = (courseId: number) => {
    // 실제 구현에서는 API 호출
  };

  const handleCourseApprove = (courseId: number) => {
    // 실제 구현에서는 API 호출
  };

  const handleCourseReject = (courseId: number) => {
    // 실제 구현에서는 API 호출
  };

  const handleCreateSubAdmin = (data: any) => {
    // 실제 구현에서는 API 호출
  };

  const handleEditSubAdmin = (id: number, data: any) => {
    // 실제 구현에서는 API 호출
  };

  const handleDeleteSubAdmin = (id: number) => {
    // 실제 구현에서는 API 호출
  };

  const handleApproveInstructor = (id: number) => {
    // 실제 구현에서는 API 호출
  };

  const handleRejectInstructor = (id: number) => {
    // 실제 구현에서는 API 호출
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">마스터 관리자 대시보드</h1>
              <p className="text-gray-600">전체 시스템 관리 및 모니터링</p>
            </div>
            <button
              onClick={() => setActiveSection('platform')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'platform'
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              플랫폼 관리
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === 'settings'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              시스템 설정
            </button>
          </div>
        </div>



        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">빠른 작업</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveSection('subAdmins')}
                className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group ${
                  activeSection === 'subAdmins'
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    activeSection === 'subAdmins'
                      ? 'bg-orange-200'
                      : 'bg-orange-100 group-hover:bg-orange-200'
                  }`}>
                    <UserPlus className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">서브 관리자 관리</h3>
                    <p className="text-sm text-gray-600 break-words leading-tight">서브 관리자 조회, 생성,<br />삭제</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <ArrowRight className={`h-4 w-4 transition-colors ${
                    activeSection === 'subAdmins'
                      ? 'text-orange-500'
                      : 'text-gray-400 group-hover:text-orange-500'
                  }`} />
                </div>
              </div>

              <div
                onClick={() => setActiveSection('instructors')}
                className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group ${
                  activeSection === 'instructors'
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    activeSection === 'instructors'
                      ? 'bg-green-200'
                      : 'bg-green-100 group-hover:bg-green-200'
                  }`}>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">강사 승인 관리</h3>
                    <p className="text-sm text-gray-600 break-words leading-tight">강사 가입 승인 및 관리</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <ArrowRight className={`h-4 w-4 transition-colors ${
                    activeSection === 'instructors'
                      ? 'text-green-500'
                      : 'text-gray-400 group-hover:text-green-500'
                  }`} />
                </div>
              </div>

              <div
                onClick={() => setActiveSection('students')}
                className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group ${
                  activeSection === 'students'
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    activeSection === 'students'
                      ? 'bg-blue-200'
                      : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">사용자 관리</h3>
                    <p className="text-sm text-gray-600 break-words leading-tight">수강생 조회 및 관리</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <ArrowRight className={`h-4 w-4 transition-colors ${
                    activeSection === 'students'
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-blue-500'
                  }`} />
                </div>
              </div>

              <div
                onClick={() => setActiveSection('courses')}
                className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer group ${
                  activeSection === 'courses'
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    activeSection === 'courses'
                      ? 'bg-purple-200'
                      : 'bg-purple-100 group-hover:bg-purple-200'
                  }`}>
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-h-[3.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 break-words">강좌 관리</h3>
                    <p className="text-sm text-gray-600 break-words leading-tight">강좌 승인 및 관리</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <ArrowRight className={`h-4 w-4 transition-colors ${
                    activeSection === 'courses'
                      ? 'text-purple-500'
                      : 'text-gray-400 group-hover:text-purple-500'
                  }`} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">최근 활동</h2>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-600">새로운 강사가 가입했습니다</span>
                <span className="ml-auto text-gray-400">2분 전</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-600">새 강좌가 생성되었습니다</span>
                <span className="ml-auto text-gray-400">15분 전</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-600">서브 관리자가 승인되었습니다</span>
                <span className="ml-auto text-gray-400">1시간 전</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 선택된 섹션에 따른 컨텐츠 표시 */}
        {activeSection === 'students' && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">사용자 관리</h2>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <StudentManagement
                students={students}
                onStudentWithdraw={handleStudentWithdraw}
                showActions={true}
              />
            </Card>
          </div>
        )}

        {activeSection === 'courses' && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">강좌 관리</h2>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <CourseManagement
                courses={courses}
                onCourseEdit={handleCourseEdit}
                onCourseDelete={handleCourseDelete}
                onCourseApprove={handleCourseApprove}
                onCourseReject={handleCourseReject}
                showActions={true}
              />
            </Card>
          </div>
        )}

        {activeSection === 'subAdmins' && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">서브 관리자 관리</h2>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SubAdminManagement
                subAdmins={subAdmins}
                onCreateSubAdmin={handleCreateSubAdmin}
                onEditSubAdmin={handleEditSubAdmin}
                onDeleteSubAdmin={handleDeleteSubAdmin}
                showActions={true}
              />
            </Card>
          </div>
        )}

        {activeSection === 'instructors' && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">강사 승인 관리</h2>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <InstructorApproval
                instructors={instructors}
                onApproveInstructor={handleApproveInstructor}
                onRejectInstructor={handleRejectInstructor}
                showActions={true}
              />
            </Card>
          </div>
        )}

        {activeSection === 'platform' && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">플랫폼 관리</h2>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <NoticeManagement
                inquiries={inquiries}
                showActions={true}
              />
            </Card>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">시스템 설정</h2>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SystemSettings />
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
