import { useState } from "react";
import { Users, UserX, Eye } from "lucide-react";
import Card from "../ui/Card";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  enrolledDate: string;
  lastLogin: string;
  enrolledCourses: string[];
}

interface StudentManagementProps {
  students: Student[];
  onStudentWithdraw?: (student: Student) => void;
  showActions?: boolean;
}

export default function StudentManagement({ students, onStudentWithdraw, showActions = true }: StudentManagementProps) {
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  const [showStudentDeleteModal, setShowStudentDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredStudents = students.filter(student =>
    filter === "all" || student.status === filter
  );

  const handleStudentDetail = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };

  const handleStudentWithdraw = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDeleteModal(true);
  };

  const handleStudentDeleteConfirm = () => {
    if (selectedStudent && onStudentWithdraw) {
      onStudentWithdraw(selectedStudent);
    }
    setShowStudentDeleteModal(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <div className="text-sm text-gray-600 break-words">
            총 {students.length}명의 수강생
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            전체 ({students.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "active"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            활성 ({students.filter(s => s.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "inactive"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            비활성 ({students.filter(s => s.status === 'inactive').length})
          </button>
        </div>

        {/* 수강생 목록 */}
        <div className="space-y-4">
          {filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">일치하는 수강생이 없습니다.</p>
          ) : (
            filteredStudents.map((student) => (
              <Card key={student.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 break-words">{student.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 break-words mb-2">{student.email}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="break-words">
                          <span className="font-medium">전화:</span> {student.phone}
                        </div>
                        <div className="break-words">
                          <span className="font-medium">등록일:</span> {student.enrolledDate}
                        </div>
                        <div className="break-words">
                          <span className="font-medium">마지막 로그인:</span> {student.lastLogin}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 break-words">
                        <span className="font-medium">수강 강의:</span> {student.enrolledCourses.join(', ')}
                      </div>
                    </div>
                  </div>
                  {showActions && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStudentDetail(student)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStudentWithdraw(student)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="탈퇴"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

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
                    {selectedStudent.enrolledCourses.map((course, index) => (
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
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
                {showActions && (
                  <button
                    onClick={() => {
                      setShowStudentDetail(false);
                      handleStudentWithdraw(selectedStudent);
                    }}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    수강생 탈퇴
                  </button>
                )}
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
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleStudentDeleteConfirm}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <UserX className="w-4 h-4" />
                  탈퇴
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
