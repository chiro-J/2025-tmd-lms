import { GraduationCap, CheckCircle, XCircle, Trash2 } from "lucide-react";
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

interface InstructorDetailModalProps {
  instructor: Instructor;
  showActions?: boolean;
  onClose: () => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onDelete?: (instructor: Instructor) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function InstructorDetailModal({
  instructor,
  showActions = true,
  onClose,
  onApprove,
  onReject,
  onDelete,
  getStatusColor,
  getStatusText,
}: InstructorDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 break-words">강사 신청 상세 정보</h3>
              <p className="text-sm text-gray-600 break-words">{instructor.name}님의 신청 정보</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">이름</label>
                <p className="text-sm text-gray-900 break-words">{instructor.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">이메일</label>
                <p className="text-sm text-gray-900 break-words">{instructor.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">전화번호</label>
                <p className="text-sm text-gray-900 break-words">{instructor.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">전문분야</label>
                <p className="text-sm text-gray-900 break-words">{instructor.specialization}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">경력</label>
                <p className="text-sm text-gray-900 break-words">{instructor.experience}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">학력</label>
                <p className="text-sm text-gray-900 break-words">{instructor.education}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">신청일</label>
                <p className="text-sm text-gray-900 break-words">{instructor.appliedDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">상태</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(instructor.status)}`}>
                  {getStatusText(instructor.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">포트폴리오</label>
                <a
                  href={instructor.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 break-words"
                >
                  {instructor.portfolio}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 break-words">첨부 문서</label>
                <div className="flex flex-wrap gap-2">
                  {instructor.documents.map((doc, index) => (
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
                {instructor.motivation}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 break-words">이전 경험</label>
              <p className="text-sm text-gray-900 break-words bg-gray-50 p-3 rounded-lg">
                {instructor.previousExperience}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
            {showActions && (
              <>
                {instructor.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        onReject?.(instructor.id);
                        onClose();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      거부
                    </button>
                    <button
                      onClick={() => {
                        onApprove?.(instructor.id);
                        onClose();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      승인
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    onClose();
                    onDelete?.(instructor);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
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
  );
}

