import { BookOpen, Edit, Trash2 } from "lucide-react";
import Card from "../ui/Card";

interface Course {
  id: number;
  title: string;
  instructor: string;
  status: 'active' | 'inactive' | 'pending';
  enrolledStudents: number;
  createdAt: string;
  description: string;
  thumbnail?: string;
  videoUrl?: string;
  content?: string;
}

interface CourseDetailModalProps {
  course: Course;
  showActions?: boolean;
  onClose: () => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function CourseDetailModal({
  course,
  showActions = true,
  onClose,
  onEdit,
  onDelete,
  getStatusColor,
  getStatusText,
}: CourseDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-2xl w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 break-words">강좌 상세 정보</h3>
              <p className="text-sm text-gray-600 break-words">{course.title}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">강좌명</label>
                <p className="text-sm text-gray-900 break-words">{course.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">강사</label>
                <p className="text-sm text-gray-900 break-words">{course.instructor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">상태</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                  {getStatusText(course.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">수강생 수</label>
                <p className="text-sm text-gray-900 break-words">{course.enrolledStudents}명</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 break-words">생성일</label>
                <p className="text-sm text-gray-900 break-words">{course.createdAt}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 break-words">강좌 설명</label>
              <p className="text-sm text-gray-900 break-words">{course.description}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
            {showActions && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit?.(course);
                  }}
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  편집
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onDelete?.(course);
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
  );
}






