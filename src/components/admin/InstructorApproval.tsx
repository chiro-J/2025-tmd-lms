import { useState } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  GraduationCap
} from "lucide-react";
import Card from "../ui/Card";

interface Instructor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  education: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
  documents: string[];
  portfolio: string;
  motivation: string;
  previousExperience: string;
}

interface InstructorApprovalProps {
  instructors: Instructor[];
  onApproveInstructor?: (id: number) => void;
  onRejectInstructor?: (id: number) => void;
  showActions?: boolean;
}

export default function InstructorApproval({ 
  instructors, 
  onApproveInstructor, 
  onRejectInstructor, 
  showActions = true 
}: InstructorApprovalProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const filteredInstructors = instructors.filter(instructor => {
    if (filter === "all") return true;
    return instructor.status === filter;
  });

  const handleViewDetails = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '승인됨';
      case 'rejected':
        return '거부됨';
      case 'pending':
        return '승인 대기';
      default:
        return '알 수 없음';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <div className="text-sm text-gray-600 break-words">
            총 {instructors.length}명의 강사 신청
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
            전체 ({instructors.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "pending"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            승인 대기 ({instructors.filter(i => i.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "approved"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            승인됨 ({instructors.filter(i => i.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === "rejected"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            거부됨 ({instructors.filter(i => i.status === 'rejected').length})
          </button>
        </div>

        {/* 강사 목록 */}
        <div className="space-y-4">
          {filteredInstructors.map((instructor) => (
            <Card key={instructor.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 break-words">{instructor.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(instructor.status)}`}>
                        {getStatusText(instructor.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 break-words mb-2">{instructor.email}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="break-words">
                        <span className="font-medium">전문분야:</span> {instructor.specialization}
                      </div>
                      <div className="break-words">
                        <span className="font-medium">경력:</span> {instructor.experience}
                      </div>
                      <div className="break-words">
                        <span className="font-medium">신청일:</span> {instructor.appliedDate}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 break-words">
                      <span className="font-medium">학력:</span> {instructor.education}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 break-words">
                      <span className="font-medium">이전 경험:</span> {instructor.previousExperience}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {instructor.documents.map((doc, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded break-words">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewDetails(instructor)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="상세보기"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {showActions && instructor.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApproveInstructor?.(instructor.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="승인"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRejectInstructor?.(instructor.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="거부"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredInstructors.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2 break-words">신청된 강사가 없습니다</h3>
            <p className="text-gray-500 break-words">현재 {getStatusText(filter)} 상태의 강사 신청이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      {showDetailModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 break-words">강사 신청 상세 정보</h3>
                  <p className="text-sm text-gray-600 break-words">{selectedInstructor.name}님의 신청 정보</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">이름</label>
                    <p className="text-sm text-gray-900 break-words">{selectedInstructor.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">이메일</label>
                    <p className="text-sm text-gray-900 break-words">{selectedInstructor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">전화번호</label>
                    <p className="text-sm text-gray-900 break-words">{selectedInstructor.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">전문분야</label>
                    <p className="text-sm text-gray-900 break-words">{selectedInstructor.specialization}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">경력</label>
                    <p className="text-sm text-gray-900 break-words">{selectedInstructor.experience}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">학력</label>
                    <p className="text-sm text-gray-900 break-words">{selectedInstructor.education}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">신청일</label>
                    <p className="text-sm text-gray-900 break-words">{selectedInstructor.appliedDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">상태</label>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedInstructor.status)}`}>
                      {getStatusText(selectedInstructor.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 break-words">포트폴리오</label>
                    <a 
                      href={selectedInstructor.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 break-words"
                    >
                      {selectedInstructor.portfolio}
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 break-words">첨부 문서</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstructor.documents.map((doc, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded break-words">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">지원 동기</label>
                  <p className="text-sm text-gray-900 break-words bg-gray-50 p-3 rounded-lg">
                    {selectedInstructor.motivation}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">이전 경험</label>
                  <p className="text-sm text-gray-900 break-words bg-gray-50 p-3 rounded-lg">
                    {selectedInstructor.previousExperience}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
                {showActions && selectedInstructor.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        onRejectInstructor?.(selectedInstructor.id);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      거부
                    </button>
                    <button
                      onClick={() => {
                        onApproveInstructor?.(selectedInstructor.id);
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      승인
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
