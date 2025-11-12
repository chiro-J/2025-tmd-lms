import { Plus, Edit } from "lucide-react";
import Card from "../ui/Card";

interface CourseFormData {
  title: string;
  instructor: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  content: string;
  status: 'active' | 'inactive' | 'pending';
}

interface CourseFormProps {
  mode: "create" | "edit";
  formData: CourseFormData;
  onFormDataChange: (data: Partial<CourseFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function CourseForm({
  mode,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const updateField = (field: keyof CourseFormData, value: string) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 break-words">
        {mode === "create" ? "새 강좌 생성" : "강좌 정보 수정"}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-words">강좌명</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="강좌명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-words">강사명</label>
            <input
              type="text"
              value={formData.instructor}
              onChange={(e) => updateField('instructor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="강사명을 입력하세요"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 break-words">상태</label>
          <select
            value={formData.status}
            onChange={(e) => updateField('status', e.target.value as 'active' | 'inactive' | 'pending')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="pending">승인 대기</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 break-words">강좌 설명</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder="강좌 설명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 break-words">썸네일 URL</label>
          <input
            type="text"
            value={formData.thumbnail}
            onChange={(e) => updateField('thumbnail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="썸네일 이미지 URL을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 break-words">비디오 URL</label>
          <input
            type="text"
            value={formData.videoUrl}
            onChange={(e) => updateField('videoUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="소개 영상 URL을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 break-words">강좌 내용 (HTML)</label>
          <textarea
            value={formData.content}
            onChange={(e) => updateField('content', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={5}
            placeholder="강좌 상세 내용을 HTML 형식으로 입력하세요"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          {mode === "create" ? (
            <>
              <Plus className="w-4 h-4" />
              강좌 생성
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              수정
            </>
          )}
        </button>
      </div>
    </Card>
  );
}



