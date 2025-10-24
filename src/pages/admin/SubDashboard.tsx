import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  UserX,
  Trash2,
  Eye,
  Edit,
  MessageSquare,
  Bell,
  GraduationCap,
  Shield,
  Search,
  Filter
} from "lucide-react";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";

export default function SubDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<"overview" | "students" | "instructors" | "courses" | "platform">("overview");
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [showInstructorDetail, setShowInstructorDetail] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "" });
  const [inquiryResponse, setInquiryResponse] = useState("");
  const [showStudentDeleteModal, setShowStudentDeleteModal] = useState(false);

  const stats = {
    totalStudents: 280,
    totalInstructors: 12,
    pendingApprovals: 3,
    totalCourses: 25,
    totalNotices: 8,
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
      status: "active",
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
      status: "active",
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
      status: "inactive",
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
      status: "active",
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
      status: "active",
      totalProgress: 30
    },
  ];

  // 강사 데이터
  const pendingInstructors = [
    { 
      id: 1, 
      name: "김강사", 
      email: "kim@example.com", 
      specialization: "React", 
      appliedDate: "2025-01-15",
      experience: "5년",
      portfolio: "포트폴리오 링크"
    },
    { 
      id: 2, 
      name: "이강사", 
      email: "lee@example.com", 
      specialization: "JavaScript", 
      appliedDate: "2025-01-14",
      experience: "3년",
      portfolio: "포트폴리오 링크"
    },
    { 
      id: 3, 
      name: "박강사", 
      email: "park@example.com", 
      specialization: "Python", 
      appliedDate: "2025-01-13",
      experience: "7년",
      portfolio: "포트폴리오 링크"
    },
  ];

  const approvedInstructors = [
    { 
      id: 1, 
      name: "김승인", 
      email: "kim@instructor.com", 
      specialization: "React", 
      approvedDate: "2025-01-10",
      status: "active",
      courses: 3
    },
    { 
      id: 2, 
      name: "이승인", 
      email: "lee@instructor.com", 
      specialization: "JavaScript", 
      approvedDate: "2025-01-08",
      status: "active",
      courses: 2
    },
    { 
      id: 3, 
      name: "박승인", 
      email: "park@instructor.com", 
      specialization: "Python", 
      approvedDate: "2025-01-05",
      status: "inactive",
      courses: 1
    },
  ];

  // 강좌 데이터
  const courses = [
    {
      id: 1,
      title: "React 기초 강의",
      instructor: "김승인",
      students: 45,
      status: "active",
      createdDate: "2025-01-10"
    },
    {
      id: 2,
      title: "JavaScript 심화",
      instructor: "이승인",
      students: 32,
      status: "active",
      createdDate: "2025-01-08"
    },
    {
      id: 3,
      title: "Python 데이터 분석",
      instructor: "박승인",
      students: 28,
      status: "inactive",
      createdDate: "2025-01-05"
    }
  ];

  // 공지사항 데이터
  const notices = [
    {
      id: 1,
      title: "시스템 점검 안내",
      content: "1월 20일 새벽 2시-4시 시스템 점검 예정입니다.",
      createdDate: "2025-01-15",
      status: "active"
    },
    {
      id: 2,
      title: "새로운 강의 출시",
      content: "React 고급 강의가 새롭게 출시되었습니다.",
      createdDate: "2025-01-14",
      status: "active"
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
  const handleStudentDetail = (student: any) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };

  const handleStudentWithdraw = (student: any) => {
    setSelectedStudent(student);
    setShowStudentDeleteModal(true);
  };

  const handleStudentDeleteConfirm = () => {
    console.log(`수강생 탈퇴: ${selectedStudent?.id}`);
    // 실제 구현에서는 API 호출
    setShowStudentDeleteModal(false);
    setSelectedStudent(null);
  };

  // 강사 관련 핸들러
  const handleInstructorDetail = (instructor: any) => {
    setSelectedInstructor(instructor);
    setShowInstructorDetail(true);
  };

  const handleApproveInstructor = (id: number) => {
    console.log(`강의자 승인: ${id}`);
    // 실제 구현에서는 API 호출
  };

  const handleRejectInstructor = (id: number) => {
    console.log(`강의자 거부: ${id}`);
    // 실제 구현에서는 API 호출
  };

  const handleDeleteInstructor = (id: number) => {
    console.log(`강의자 삭제: ${id}`);
    // 실제 구현에서는 API 호출
  };

  // 강좌 관련 핸들러
  const handleCourseAccess = (courseId: number) => {
    console.log(`강좌 접근: ${courseId}`);
    // 메인 강의자 권한으로 강좌 접근 - 강의자 대시보드로 이동
    navigate(`/instructor/course/${courseId}/home`);
  };

  // 플랫폼 관리 핸들러
  const handleNoticeCreate = () => {
    setNoticeForm({ title: "", content: "" });
    setShowNoticeModal(true);
  };

  const handleNoticeSubmit = () => {
    console.log("공지사항 작성:", noticeForm);
    // 실제 구현에서는 API 호출
    setShowNoticeModal(false);
    setNoticeForm({ title: "", content: "" });
  };

  const handleInquiryResponse = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setInquiryResponse("");
    setShowInquiryModal(true);
  };

  const handleInquirySubmit = () => {
    console.log("문의사항 답변:", { inquiryId: selectedInquiry.id, response: inquiryResponse });
    // 실제 구현에서는 API 호출
    setShowInquiryModal(false);
    setSelectedInquiry(null);
    setInquiryResponse("");
  };

  // 페이지 연동 핸들러들
  const handleStudentManagement = () => {
    // 수강생 관리 페이지로 이동 (강의자 대시보드의 학생 관리)
    navigate('/instructor/dashboard');
  };

  const handleInstructorApproval = () => {
    // 강사 승인 관리 페이지로 이동
    navigate('/admin/instructor-approval');
  };

  const handleCourseManagement = () => {
    // 강의자 대시보드로 이동
    navigate('/instructor/dashboard');
  };

  const handlePlatformManagement = () => {
    // 플랫폼 관리 페이지로 이동 (공지사항, 문의 관리)
    // 실제 구현에서는 별도 페이지가 필요할 수 있음
    console.log('플랫폼 관리 페이지로 이동');
  };

  // 모달 닫기
  const handleCloseModals = () => {
    setShowStudentDetail(false);
    setShowInstructorDetail(false);
    setShowNoticeModal(false);
    setShowInquiryModal(false);
    setShowStudentDeleteModal(false);
    setSelectedStudent(null);
    setSelectedInstructor(null);
    setSelectedInquiry(null);
    setNoticeForm({ title: "", content: "" });
    setInquiryResponse("");
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
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 break-words">수강생 관리</h3>
                    <p className="text-sm text-gray-600 break-words">전체 수강생 조회 및 관리</p>
                  </div>
                </div>
                <div className="space-y-2">
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
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 break-words">강사 관리</h3>
                    <p className="text-sm text-gray-600 break-words">강사 승인 및 관리</p>
                  </div>
                </div>
                <div className="space-y-2">
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
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 break-words">강좌 관리</h3>
                    <p className="text-sm text-gray-600 break-words">메인 강의자 권한으로 관리</p>
                  </div>
                </div>
                <div className="space-y-2">
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
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 break-words">플랫폼 관리</h3>
                    <p className="text-sm text-gray-600 break-words">공지사항 및 문의 관리</p>
                  </div>
                </div>
                <div className="space-y-2">
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 break-words">수강생 관리</h2>
                <div className="text-sm text-gray-600 break-words">
                  총 {allStudents.length}명의 수강생
                </div>
              </div>

              <div className="space-y-4">
                {allStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900 break-words">{student.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {student.status === 'active' ? '활성' : '비활성'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 break-words">{student.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500 break-words">전화: {student.phone}</span>
                            <span className="text-sm text-gray-500 break-words">등록일: {student.enrolledDate}</span>
                            <span className="text-sm text-gray-500 break-words">마지막 로그인: {student.lastLogin}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-600 break-words">수강 강의:</span>
                            {student.enrolledCourses.map((course, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded break-words">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStudentDetail(student)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStudentWithdraw(student)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 강사 관리 섹션 */}
          {activeSection === "instructors" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 break-words">강사 관리</h2>
                <div className="text-sm text-gray-600 break-words">
                  승인 대기: {pendingInstructors.length}명 | 승인된 강사: {approvedInstructors.length}명
                </div>
              </div>

              {/* 승인 대기 강사 */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900">승인 대기 강사</h3>
                {pendingInstructors.map((instructor) => (
                  <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                          <p className="text-sm text-gray-600">{instructor.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">전문분야: {instructor.specialization}</span>
                            <span className="text-sm text-gray-500">경력: {instructor.experience}</span>
                            <span className="text-sm text-gray-500">신청일: {instructor.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveInstructor(instructor.id)}
                          className="btn-primary bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          승인
                        </button>
                        <button
                          onClick={() => handleRejectInstructor(instructor.id)}
                          className="btn-primary bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                          거부
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* 승인된 강사 */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900">승인된 강사</h3>
                {approvedInstructors.map((instructor) => (
                  <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              instructor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {instructor.status === 'active' ? '활성' : '비활성'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{instructor.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">전문분야: {instructor.specialization}</span>
                            <span className="text-sm text-gray-500">강의 수: {instructor.courses}개</span>
                            <span className="text-sm text-gray-500">승인일: {instructor.approvedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleInstructorDetail(instructor)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInstructor(instructor.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 강좌 관리 섹션 */}
          {activeSection === "courses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">강좌 관리</h2>
                <div className="text-sm text-gray-600">
                  메인 강의자 권한으로 모든 강좌 관리
                </div>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">{course.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {course.status === 'active' ? '활성' : '비활성'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">강의자: {course.instructor}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">수강생: {course.students}명</span>
                            <span className="text-sm text-gray-500">생성일: {course.createdDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCourseAccess(course.id)}
                          className="btn-primary bg-purple-600 hover:bg-purple-700"
                        >
                          <Shield className="w-4 h-4" />
                          메인 강의자로 접근
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 플랫폼 관리 섹션 */}
          {activeSection === "platform" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 break-words">플랫폼 관리</h2>
                <button
                  onClick={handleNoticeCreate}
                  className="btn-primary bg-orange-600 hover:bg-orange-700"
                >
                  <Bell className="w-4 h-4" />
                  공지사항 작성
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 공지사항 관리 */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 break-words">공지사항 관리</h3>
                  {notices.map((notice) => (
                    <Card key={notice.id} className="hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 break-words">{notice.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            notice.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {notice.status === 'active' ? '활성' : '비활성'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 break-words">{notice.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 break-words">작성일: {notice.createdDate}</span>
                          <div className="flex gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* 문의사항 관리 */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 break-words">문의사항 관리</h3>
                  {inquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 break-words">{inquiry.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {inquiry.status === 'pending' ? '대기' : '완료'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 break-words">{inquiry.content}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-gray-500 break-words">문의자: {inquiry.user}</span>
                            <span className="text-xs text-gray-500 ml-2 break-words">({inquiry.email})</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleInquiryResponse(inquiry)}
                              className="p-1 text-gray-400 hover:text-green-600"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 공지사항 작성 모달 */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">공지사항 작성</h3>
                  <p className="text-sm text-gray-600 break-words">새로운 공지사항을 작성합니다</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">제목</label>
                  <input
                    type="text"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                    className="input w-full"
                    placeholder="공지사항 제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">내용</label>
                  <textarea
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
                    className="input w-full h-32 resize-none"
                    placeholder="공지사항 내용을 입력하세요"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="btn-outline"
                >
                  취소
                </button>
                <button
                  onClick={handleNoticeSubmit}
                  className="btn-primary bg-orange-600 hover:bg-orange-700"
                >
                  <Bell className="w-4 h-4" />
                  공지사항 작성
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 수강생 세부사항 모달 */}
      {showStudentDetail && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">수강생 상세 정보</h3>
                  <p className="text-sm text-gray-600 break-words">{selectedStudent.name}님의 상세 정보</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">이름</label>
                    <p className="text-sm text-gray-900 break-words">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">이메일</label>
                    <p className="text-sm text-gray-900 break-words">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">전화번호</label>
                    <p className="text-sm text-gray-900 break-words">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">상태</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedStudent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedStudent.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">등록일</label>
                    <p className="text-sm text-gray-900 break-words">{selectedStudent.enrolledDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">마지막 로그인</label>
                    <p className="text-sm text-gray-900 break-words">{selectedStudent.lastLogin}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">수강 강의</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.enrolledCourses.map((course: string, index: number) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded break-words">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowStudentDetail(false)}
                  className="btn-outline"
                >
                  닫기
                </button>
                <button
                  onClick={() => {
                    setShowStudentDetail(false);
                    handleStudentWithdraw(selectedStudent);
                  }}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  <UserX className="w-4 h-4" />
                  수강생 탈퇴
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 수강생 삭제 확인 모달 */}
      {showStudentDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <UserX className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">수강생 탈퇴</h3>
                  <p className="text-sm text-gray-600 break-words">이 작업은 되돌릴 수 없습니다</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 break-words">
                  <strong>{selectedStudent.name}</strong> ({selectedStudent.email}) 수강생을 탈퇴시키시겠습니까?
                </p>
                <p className="text-xs text-gray-500 mt-2 break-words">
                  이 수강생과 관련된 모든 데이터가 삭제됩니다.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowStudentDeleteModal(false)}
                  className="btn-outline"
                >
                  취소
                </button>
                <button
                  onClick={handleStudentDeleteConfirm}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  <UserX className="w-4 h-4" />
                  탈퇴
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 문의사항 답변 모달 */}
      {showInquiryModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">문의사항 답변</h3>
                  <p className="text-sm text-gray-600 break-words">문의사항에 답변을 작성합니다</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 break-words">{selectedInquiry.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 break-words">{selectedInquiry.content}</p>
                  <div className="mt-2 text-xs text-gray-500 break-words">
                    문의자: {selectedInquiry.user} ({selectedInquiry.email})
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">답변 내용</label>
                  <textarea
                    value={inquiryResponse}
                    onChange={(e) => setInquiryResponse(e.target.value)}
                    className="input w-full h-32 resize-none"
                    placeholder="문의사항에 대한 답변을 입력하세요"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="btn-outline"
                >
                  취소
                </button>
                <button
                  onClick={handleInquirySubmit}
                  className="btn-primary bg-green-600 hover:bg-green-700"
                >
                  <MessageSquare className="w-4 h-4" />
                  답변 전송
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
