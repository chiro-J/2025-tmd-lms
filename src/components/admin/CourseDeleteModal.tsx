import { Trash2 } from "lucide-react";
import Card from "../ui/Card";

interface Course {
  id: number;
  title: string;
}

interface CourseDeleteModalProps {
  course: Course;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CourseDeleteModal({
  course,
  onConfirm,
  onCancel,
}: CourseDeleteModalProps) {
  return (
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
              <strong>{course.title}</strong> 강좌를 삭제하시겠습니까?
            </p>
            <p className="text-xs text-gray-500 mt-2 break-words">
              이 강좌와 관련된 모든 데이터가 삭제됩니다.
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
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}






