import { useState } from "react";
import { BookOpen, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import Card from "../ui/Card";

interface Course {
  id: number;
  title: string;
  instructor: string;
  status: 'active' | 'inactive' | 'pending';
  enrolledStudents: number;
  createdAt: string;
  description: string;
}

interface CourseManagementProps {
  courses: Course[];
  onCourseEdit?: (course: Course) => void;
  onCourseDelete?: (courseId: number) => void;
  onCourseApprove?: (courseId: number) => void;
  onCourseReject?: (courseId: number) => void;
  showActions?: boolean;
}

export default function CourseManagement({ courses, onCourseEdit, onCourseDelete, onCourseApprove, onCourseReject, showActions = true }: CourseManagementProps) {
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [showCourseDeleteModal, setShowCourseDeleteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  const handleCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleCourseDelete = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDeleteModal(true);
  };

  const handleCourseDeleteConfirm = () => {
    if (selectedCourse && onCourseDelete) {
      onCourseDelete(selectedCourse.id);
    }
    setShowCourseDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleCourseApproval = (course: Course, action: 'approve' | 'reject') => {
    setSelectedCourse(course);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const handleApprovalConfirm = () => {
    if (selectedCourse && approvalAction) {
      if (approvalAction === 'approve' && onCourseApprove) {
        onCourseApprove(selectedCourse.id);
      } else if (approvalAction === 'reject' && onCourseReject) {
        onCourseReject(selectedCourse.id);
      }
    }
    setShowApprovalModal(false);
    setSelectedCourse(null);
    setApprovalAction(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'inactive':
        return '비활성';
      case 'pending':
        return '승인 대기';
      default:
        return '알 수 없음';
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <div className="text-sm text-gray-600 break-words">
            총 {courses.length}개의 강좌
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 break-words">{course.title}</h3>
                    <p className="text-sm text-gray-600 break-words">{course.instructor}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                  {getStatusText(course.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="break-words">수강생: {course.enrolledStudents}명</div>
                <div className="break-words">생성일: {course.createdAt}</div>
                <div className="break-words line-clamp-2">{course.description}</div>
              </div>

              {showActions && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCourseDetail(course)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      상세보기
                    </button>
                    <button
                      onClick={() => onCourseEdit?.(course)}
                      className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      편집
                    </button>
                    <button
                      onClick={() => handleCourseDelete(course)}
                      className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                  {course.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCourseApproval(course, 'approve')}
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        승인
                      </button>
                      <button
                        onClick={() => handleCourseApproval(course, 'reject')}
                        className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        거부
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* 강좌 세부사항 모달 */}
      {showCourseDetail && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">강좌 상세 정보</h3>
                  <p className="text-sm text-gray-600 break-words">{selectedCourse.title}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">강좌명</label>
                    <p className="text-sm text-gray-900 break-words">{selectedCourse.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">강사</label>
                    <p className="text-sm text-gray-900 break-words">{selectedCourse.instructor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">상태</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedCourse.status)}`}>
                      {getStatusText(selectedCourse.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">수강생 수</label>
                    <p className="text-sm text-gray-900 break-words">{selectedCourse.enrolledStudents}명</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">생성일</label>
                    <p className="text-sm text-gray-900 break-words">{selectedCourse.createdAt}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">강좌 설명</label>
                  <p className="text-sm text-gray-900 break-words">{selectedCourse.description}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCourseDetail(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
                {showActions && (
                  <>
                    <button
                      onClick={() => {
                        setShowCourseDetail(false);
                        onCourseEdit?.(selectedCourse);
                      }}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      편집
                    </button>
                    <button
                      onClick={() => {
                        setShowCourseDetail(false);
                        handleCourseDelete(selectedCourse);
                      }}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 강좌 삭제 확인 모달 */}
      {showCourseDeleteModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">강좌 삭제</h3>
                  <p className="text-sm text-gray-600 break-words">이 작업은 되돌릴 수 없습니다</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 break-words">
                  <strong>{selectedCourse.title}</strong> 강좌를 삭제하시겠습니까?
                </p>
                <p className="text-xs text-gray-500 mt-2 break-words">
                  이 강좌와 관련된 모든 데이터가 삭제됩니다.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCourseDeleteModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCourseDeleteConfirm}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 강좌 승인/거부 확인 모달 */}
      {showApprovalModal && selectedCourse && approvalAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  approvalAction === 'approve' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {approvalAction === 'approve' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    강좌 {approvalAction === 'approve' ? '승인' : '거부'}
                  </h3>
                  <p className="text-sm text-gray-600 break-words">
                    이 작업을 진행하시겠습니까?
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 break-words">
                  <strong>{selectedCourse.title}</strong> 강좌를 {approvalAction === 'approve' ? '승인' : '거부'}하시겠습니까?
                </p>
                <p className="text-xs text-gray-500 mt-2 break-words">
                  {approvalAction === 'approve' 
                    ? '승인된 강좌는 활성 상태가 되어 수강생들이 수강할 수 있습니다.'
                    : '거부된 강좌는 비활성 상태가 됩니다.'
                  }
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedCourse(null);
                    setApprovalAction(null);
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleApprovalConfirm}
                  className={`px-4 py-2 text-sm text-white rounded-lg transition-colors flex items-center gap-2 ${
                    approvalAction === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {approvalAction === 'approve' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {approvalAction === 'approve' ? '승인' : '거부'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
