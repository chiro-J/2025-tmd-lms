import { useState } from "react";
import { Users, BookOpen, CheckCircle, XCircle, Settings, TrendingUp, AlertTriangle, FileText } from "lucide-react";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";

export default function SubDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "instructors" | "content" | "users">("overview");
  const [showPendingList, setShowPendingList] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showInstructorList, setShowInstructorList] = useState(false);

  const stats = {
    totalInstructors: 12,
    pendingApprovals: 3,
    totalCourses: 25,
    totalStudents: 280,
    contentUploads: 45
  };

  const pendingInstructors = [
    { id: 1, name: "김강사", email: "kim@example.com", specialization: "React", appliedDate: "2025-01-15" },
    { id: 2, name: "이강사", email: "lee@example.com", specialization: "JavaScript", appliedDate: "2025-01-14" },
    { id: 3, name: "박강사", email: "park@example.com", specialization: "Python", appliedDate: "2025-01-13" },
  ];

  const allStudents = [
    { id: 1, name: "김수강", email: "kim@student.com", course: "React 기초", enrolledDate: "2025-01-10", progress: 75 },
    { id: 2, name: "이학생", email: "lee@student.com", course: "JavaScript 심화", enrolledDate: "2025-01-08", progress: 90 },
    { id: 3, name: "박학습", email: "park@student.com", course: "Python 데이터 분석", enrolledDate: "2025-01-05", progress: 60 },
    { id: 4, name: "최공부", email: "choi@student.com", course: "웹 개발 풀스택", enrolledDate: "2025-01-03", progress: 45 },
    { id: 5, name: "정학원", email: "jung@student.com", course: "React 기초", enrolledDate: "2025-01-01", progress: 30 },
  ];

  const approvedInstructors = [
    { id: 1, name: "김승인", email: "kim@instructor.com", specialization: "React", approvedDate: "2025-01-10" },
    { id: 2, name: "이승인", email: "lee@instructor.com", specialization: "JavaScript", approvedDate: "2025-01-08" },
    { id: 3, name: "박승인", email: "park@instructor.com", specialization: "Python", approvedDate: "2025-01-05" },
    { id: 4, name: "최승인", email: "choi@instructor.com", specialization: "Vue.js", approvedDate: "2025-01-03" },
    { id: 5, name: "정승인", email: "jung@instructor.com", specialization: "Node.js", approvedDate: "2025-01-01" },
  ];

  const recentActivities = [
    { id: 1, type: "instructor_approval", message: "새로운 강의자 신청", time: "2시간 전", status: "pending" },
    { id: 2, type: "content_upload", message: "강의 자료 업로드", time: "4시간 전", status: "completed" },
    { id: 3, type: "user_registration", message: "새로운 수강생 등록", time: "6시간 전", status: "completed" },
    { id: 4, type: "course_creation", message: "새 강의 생성", time: "1일 전", status: "completed" },
  ];

  const handleApproveInstructor = (id: number) => {
    console.log(`강의자 승인: ${id}`);
  };

  const handleRejectInstructor = (id: number) => {
    console.log(`강의자 거부: ${id}`);
  };

  const handlePendingClick = () => {
    setShowPendingList(true);
    setShowStudentList(false);
    setShowInstructorList(false);
  };

  const handleStudentClick = () => {
    setShowStudentList(true);
    setShowPendingList(false);
    setShowInstructorList(false);
  };

  const handleInstructorClick = () => {
    setShowInstructorList(true);
    setShowPendingList(false);
    setShowStudentList(false);
  };

  const handleCloseLists = () => {
    setShowPendingList(false);
    setShowStudentList(false);
    setShowInstructorList(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">서브 관리자 대시보드</h1>
              <p className="text-gray-600">콘텐츠 및 사용자 관리</p>
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

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleInstructorClick}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</div>
                  <div className="text-sm text-gray-600">승인된 강의자</div>
                </div>
              </div>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handlePendingClick}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</div>
                  <div className="text-sm text-gray-600">승인 대기</div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                  <div className="text-sm text-gray-600">활성 강의</div>
                </div>
              </div>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleStudentClick}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
                  <div className="text-sm text-gray-600">전체 수강생</div>
                </div>
              </div>
            </Card>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200">
            <nav className="tabbar">
              {[
                { id: "overview", label: "개요", icon: <TrendingUp className="w-4 h-4" /> },
                { id: "instructors", label: "강의자 관리", icon: <BookOpen className="w-4 h-4" /> },
                { id: "content", label: "콘텐츠 관리", icon: <FileText className="w-4 h-4" /> },
                { id: "users", label: "사용자 관리", icon: <Users className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`tab ${activeTab === tab.id ? 'tab-active' : ''} flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 탭 컨텐츠 */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {showPendingList && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">승인 대기 강의자 목록</h2>
                    <button onClick={handleCloseLists} className="btn-outline">닫기</button>
                  </div>
                  <div className="space-y-4">
                    {pendingInstructors.map((instructor) => (
                      <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                              <p className="text-sm text-gray-600">{instructor.email}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500">전문분야: {instructor.specialization}</span>
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
                </div>
              )}

              {showStudentList && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">전체 수강생 목록</h2>
                    <button onClick={handleCloseLists} className="btn-outline">닫기</button>
                  </div>
                  <div className="space-y-4">
                    {allStudents.map((student) => (
                      <Card key={student.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{student.name}</h3>
                              <p className="text-sm text-gray-600">{student.email}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500">강의: {student.course}</span>
                                <span className="text-sm text-gray-500">등록일: {student.enrolledDate}</span>
                                <span className="text-sm text-gray-500">진행률: {student.progress}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {showInstructorList && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">승인된 강의자 목록</h2>
                    <button onClick={handleCloseLists} className="btn-outline">닫기</button>
                  </div>
                  <div className="space-y-4">
                    {approvedInstructors.map((instructor) => (
                      <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                              <p className="text-sm text-gray-600">{instructor.email}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500">전문분야: {instructor.specialization}</span>
                                <span className="text-sm text-gray-500">승인일: {instructor.approvedDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {!showPendingList && !showStudentList && !showInstructorList && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Section title="최근 활동">
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section title="시스템 상태">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">콘텐츠 업로드</span>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={75} />
                          <span className="text-sm font-medium text-gray-600">75%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">강의 승인률</span>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={85} />
                          <span className="text-sm font-medium text-gray-600">85%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">사용자 만족도</span>
                        <div className="flex items-center gap-2">
                          <ProgressBar value={92} />
                          <span className="text-sm font-medium text-gray-600">92%</span>
                        </div>
                      </div>
                    </div>
                  </Section>
                </div>
              )}
            </div>
          )}

          {activeTab === "instructors" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">강의자 승인 관리</h2>
                <div className="text-sm text-gray-600">
                  {pendingInstructors.length}명의 승인 대기 중
                </div>
              </div>

              <div className="space-y-4">
                {pendingInstructors.map((instructor) => (
                  <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                          <p className="text-sm text-gray-600">{instructor.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-500">전문분야: {instructor.specialization}</span>
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
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6">
              <Section title="콘텐츠 관리">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">강의 자료</h3>
                        <p className="text-sm text-gray-600">45개 파일</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">강의 관리</h3>
                        <p className="text-sm text-gray-600">25개 강의</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Settings className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">카테고리 관리</h3>
                        <p className="text-sm text-gray-600">8개 카테고리</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Section>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <Section title="사용자 관리">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">수강생 관리</h3>
                        <p className="text-sm text-gray-600">280명</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">강의자 관리</h3>
                        <p className="text-sm text-gray-600">12명</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">신규 가입</h3>
                        <p className="text-sm text-gray-600">3명 대기</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
