import { CheckCircle, XCircle } from "lucide-react";
import Card from "../ui/Card";

interface Course {
  id: number;
  title: string;
}

interface CourseApprovalModalProps {
  course: Course;
  action: 'approve' | 'reject';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CourseApprovalModal({
  course,
  action,
  onConfirm,
  onCancel,
}: CourseApprovalModalProps) {
  const isApprove = action === 'approve';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isApprove ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isApprove ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 break-words">
                강좌 {isApprove ? '승인' : '거부'}
              </h3>
              <p className="text-sm text-gray-600 break-words">이 작업을 계속하시겠습니까?</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 break-words">
              <strong>{course.title}</strong> 강좌를 {isApprove ? '승인' : '거부'}하시겠습니까?
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm text-white rounded-lg transition-colors flex items-center gap-2 ${
                isApprove
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isApprove ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  승인
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  거부
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

