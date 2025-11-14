import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, CheckCircle, BookOpen, ArrowRight, X, Settings, Bell, MessageSquare } from 'lucide-react'
import Card from '../../components/ui/Card'
import StudentManagement from '../../components/admin/StudentManagement'
import CourseManagement from '../../components/admin/CourseManagement'
import SubAdminManagement from '../../components/admin/SubAdminManagement'
import InstructorApproval from '../../components/admin/InstructorApproval'
import NoticeManagement from '../../components/admin/NoticeManagement'
import InquiryManagement from '../../components/admin/InquiryManagement'
import SystemSettings from '../../components/admin/SystemSettings'
import * as adminApi from '../../core/api/admin'
import type { SubAdmin, Instructor, Student, Course, Notice, Inquiry } from '../../core/api/admin'

export default function MasterDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'students' | 'courses' | 'subAdmins' | 'instructors' | 'platform' | 'settings'>('overview');
  const [platformTab, setPlatformTab] = useState<'notices' | 'inquiries'>('notices');

  // 데이터 상태
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // 로딩 상태
  const [loading, setLoading] = useState<Record<string, boolean>>({
    students: false,
    courses: false,
    subAdmins: false,
    instructors: false,
    inquiries: false,
  });

  // 데이터 로드 함수들
  const loadStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const data = await adminApi.getStudents();
      // Student 타입에 enrolledCourses 필드가 없으므로 추가 필요
      const studentsWithCourses = data.map(student => ({
        ...student,
        enrolledCourses: [] as string[], // 실제로는 별도 API에서 가져와야 함
      }));
      setStudents(studentsWithCourses);
    } catch (error: any) {
      console.error('수강생 목록 로드 실패:', error);
      if (error.response?.status === 404) {
        console.error('API 엔드포인트를 찾을 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      setStudents([]); // 에러 시 빈 배열로 설정
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const loadCourses = async () => {
    setLoading(prev => ({ ...prev, courses: true }));
    try {
      const data = await adminApi.getCoursesForAdmin();
      setCourses(data);
    } catch (error: any) {
      console.error('강좌 목록 로드 실패:', error);
      if (error.response?.status === 404) {
        console.error('API 엔드포인트를 찾을 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      setCourses([]); // 에러 시 빈 배열로 설정
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const loadSubAdmins = async () => {
    setLoading(prev => ({ ...prev, subAdmins: true }));
    try {
      const data = await adminApi.getSubAdmins();
      // SubAdmin 타입 변환 (permissions 객체로 변환)
      const formattedData = data.map(admin => ({
        ...admin,
        permissions: {
          userManagement: admin.userManagement ?? admin.permissions?.userManagement ?? false,
          contentManagement: admin.contentManagement ?? admin.permissions?.contentManagement ?? false,
          systemSettings: admin.systemSettings ?? admin.permissions?.systemSettings ?? false,
          instructorApproval: admin.instructorApproval ?? admin.permissions?.instructorApproval ?? false,
        },
      }));
      setSubAdmins(formattedData);
    } catch (error: any) {
      console.error('서브 관리자 목록 로드 실패:', error);
      if (error.response?.status === 404) {
        console.error('API 엔드포인트를 찾을 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      setSubAdmins([]); // 에러 시 빈 배열로 설정
    } finally {
      setLoading(prev => ({ ...prev, subAdmins: false }));
    }
  };

  const loadInstructors = async () => {
    setLoading(prev => ({ ...prev, instructors: true }));
    try {
      const data = await adminApi.getInstructors();
      setInstructors(data);
    } catch (error: any) {
      console.error('강사 목록 로드 실패:', error);
      if (error.response?.status === 404) {
        console.error('API 엔드포인트를 찾을 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      setInstructors([]); // 에러 시 빈 배열로 설정
    } finally {
      setLoading(prev => ({ ...prev, instructors: false }));
    }
  };

  const loadInquiries = async () => {
    setLoading(prev => ({ ...prev, inquiries: true }));
    try {
      const data = await adminApi.getInquiries();
      // Inquiry 타입 변환 (user 필드로 변환)
      const formattedData = data.map(inquiry => ({
        ...inquiry,
        user: inquiry.userName || inquiry.user,
      }));
      setInquiries(formattedData);
    } catch (error: any) {
      console.error('문의사항 목록 로드 실패:', error);
      if (error.response?.status === 404) {
        console.error('API 엔드포인트를 찾을 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
      }
      setInquiries([]); // 에러 시 빈 배열로 설정
    } finally {
      setLoading(prev => ({ ...prev, inquiries: false }));
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadStudents();
    loadCourses();
    loadSubAdmins();
    loadInstructors();
    loadInquiries();
  }, []);

  // 섹션 변경 시 해당 데이터 다시 로드
  useEffect(() => {
    if (activeSection === 'students') {
      loadStudents();
    } else if (activeSection === 'courses') {
      loadCourses();
    } else if (activeSection === 'subAdmins') {
      loadSubAdmins();
    } else if (activeSection === 'instructors') {
      loadInstructors();
    } else if (activeSection === 'platform') {
      loadInquiries();
    }
  }, [activeSection]);

  // 핸들러 함수들
  const handleStudentWithdraw = async (student: Student) => {
    try {
      await adminApi.deleteStudent(student.id);
      await loadStudents();
      alert('수강생이 삭제되었습니다.');
    } catch (error) {
      console.error('수강생 삭제 실패:', error);
      alert('수강생 삭제에 실패했습니다.');
    }
  };

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

  const handleCreateSubAdmin = async (data: adminApi.CreateSubAdminData) => {
    try {
      await adminApi.createSubAdmin(data);
      await loadSubAdmins();
      alert('서브 관리자가 생성되었습니다.');
    } catch (error) {
      console.error('서브 관리자 생성 실패:', error);
      alert('서브 관리자 생성에 실패했습니다.');
    }
  };

  const handleEditSubAdmin = async (id: number, data: Partial<SubAdmin>) => {
    try {
      await adminApi.updateSubAdmin(id, data);
      await loadSubAdmins();
      alert('서브 관리자 정보가 수정되었습니다.');
    } catch (error) {
      console.error('서브 관리자 수정 실패:', error);
      alert('서브 관리자 수정에 실패했습니다.');
    }
  };

  const handleDeleteSubAdmin = async (id: number) => {
    if (!confirm('정말 이 서브 관리자를 삭제하시겠습니까?')) return;
    try {
      await adminApi.deleteSubAdmin(id);
      await loadSubAdmins();
      alert('서브 관리자가 삭제되었습니다.');
    } catch (error) {
      console.error('서브 관리자 삭제 실패:', error);
      alert('서브 관리자 삭제에 실패했습니다.');
    }
  };

  const handleActivateSubAdmin = async (id: number) => {
    if (!confirm('이 서브 관리자를 활성화하시겠습니까?')) return;
    try {
      await adminApi.updateSubAdmin(id, { status: 'active' });
      await loadSubAdmins();
      alert('서브 관리자가 활성화되었습니다.');
    } catch (error) {
      console.error('서브 관리자 활성화 실패:', error);
      alert('서브 관리자 활성화에 실패했습니다.');
    }
  };

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

  const handlePendingInstructor = async (id: number) => {
    try {
      await adminApi.pendingInstructor(id);
      await loadInstructors();
      alert('강사가 대기 상태로 변경되었습니다.');
    } catch (error) {
      console.error('강사 대기 상태 변경 실패:', error);
      alert('강사 대기 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteInstructor = async (id: number) => {
    if (!confirm('정말 이 강사를 삭제하시겠습니까?')) return;
    try {
      await adminApi.deleteInstructor(id);
      await loadInstructors();
      alert('강사가 삭제되었습니다.');
    } catch (error) {
      console.error('강사 삭제 실패:', error);
      alert('강사 삭제에 실패했습니다.');
    }
  };

  const handleCreateCourse = async (data: adminApi.CreateCourseData) => {
    try {
      await adminApi.createCourse(data);
      await loadCourses();
      alert('강좌가 생성되었습니다.');
    } catch (error) {
      console.error('강좌 생성 실패:', error);
      alert('강좌 생성에 실패했습니다.');
    }
  };

  const handleUpdateCourse = async (id: number, data: Partial<Course>) => {
    try {
      await adminApi.updateCourse(id, data);
      await loadCourses();
      alert('강좌 정보가 수정되었습니다.');
    } catch (error) {
      console.error('강좌 수정 실패:', error);
      alert('강좌 수정에 실패했습니다.');
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">마스터 관리자 대시보드</h1>
              <p className="text-gray-600">전체 시스템 관리 및 모니터링</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection('platform')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'platform'
                    ? 'bg-orange-500 text-white border border-orange-600 shadow-md'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                플랫폼 관리
              </button>
              <button
                onClick={() => setActiveSection('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === 'settings'
                    ? 'bg-blue-500 text-white border border-blue-600 shadow-md'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                시스템 설정
              </button>
            </div>
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
                  <div className={`p-3 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    activeSection === 'subAdmins'
                      ? 'bg-orange-200'
                      : 'bg-orange-100 group-hover:bg-orange-200'
                  }`} style={{ width: '48px', height: '48px' }}>
                    <UserPlus className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1 flex flex-col">
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
                  <div className={`p-3 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    activeSection === 'instructors'
                      ? 'bg-green-200'
                      : 'bg-green-100 group-hover:bg-green-200'
                  }`} style={{ width: '48px', height: '48px' }}>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1 flex flex-col">
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
                  <div className={`p-3 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    activeSection === 'students'
                      ? 'bg-blue-200'
                      : 'bg-blue-100 group-hover:bg-blue-200'
                  }`} style={{ width: '48px', height: '48px' }}>
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 flex flex-col">
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
                  <div className={`p-3 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    activeSection === 'courses'
                      ? 'bg-purple-200'
                      : 'bg-purple-100 group-hover:bg-purple-200'
                  }`} style={{ width: '48px', height: '48px' }}>
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1 flex flex-col">
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
              {loading.courses ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : (
                <CourseManagement
                  courses={courses}
                  onCourseCreate={(data) => handleCreateCourse(data as adminApi.CreateCourseData)}
                  onCourseUpdate={handleUpdateCourse}
                  onCourseDelete={handleCourseDelete}
                  onCourseApprove={handleCourseApprove}
                  onCourseReject={handleCourseReject}
                  showActions={true}
                />
              )}
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
              {loading.subAdmins ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : (
                <SubAdminManagement
                  subAdmins={subAdmins}
                  onCreateSubAdmin={handleCreateSubAdmin}
                  onEditSubAdmin={handleEditSubAdmin}
                  onDeleteSubAdmin={handleDeleteSubAdmin}
                  onActivateSubAdmin={handleActivateSubAdmin}
                  showActions={true}
                />
              )}
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
              {loading.instructors ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-500">로딩 중...</div>
                </div>
              ) : (
                <InstructorApproval
                  instructors={instructors}
                  onApproveInstructor={handleApproveInstructor}
                  onRejectInstructor={handleRejectInstructor}
                  onPendingInstructor={handlePendingInstructor}
                  onDeleteInstructor={handleDeleteInstructor}
                  showActions={true}
                />
              )}
            </Card>
          </div>
        )}

        {activeSection === 'platform' && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">플랫폼 관리</h2>
                <button
                  onClick={() => setActiveSection('overview')}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 탭 버튼 */}
              <div className="flex gap-3 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setPlatformTab('notices')}
                  className={`px-6 py-3 font-semibold text-base transition-colors border-b-2 ${
                    platformTab === 'notices'
                      ? 'border-orange-600 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-4 h-4 inline-block mr-2" />
                  공지사항 관리
                </button>
                <button
                  onClick={() => setPlatformTab('inquiries')}
                  className={`px-6 py-3 font-semibold text-base transition-colors border-b-2 ${
                    platformTab === 'inquiries'
                      ? 'border-purple-600 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline-block mr-2" />
                  문의사항 관리
                </button>
              </div>

              {/* 탭 내용 */}
              {platformTab === 'notices' ? (
                <NoticeManagement showActions={true} />
              ) : (
                loading.inquiries ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">로딩 중...</div>
                  </div>
                ) : (
                  <InquiryManagement
                    inquiries={inquiries}
                    onRespondToInquiry={handleRespondToInquiry}
                    showActions={true}
                  />
                )
              )}
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
