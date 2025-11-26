import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types';
import { normalizeThumbnailUrl } from '../../utils/thumbnail';

interface RecentCourseProps {
  recentCourse?: Course;
  lastLearnedLessonTitle?: string | null;
  lastLearnedDate?: string | null;
  loading?: boolean;
}

export default function RecentCourse({ recentCourse, lastLearnedLessonTitle, lastLearnedDate, loading }: RecentCourseProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    } catch {
      return null;
    }
  };

  return (
    <div className="p-4 md:p-6 card-panel flex-1 flex flex-col">
      <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-4">최근 학습 강좌</h3>
      <div className="flex-1 flex items-center">
        {loading ? (
          <div className="text-center w-full py-8 text-gray-500">로딩 중...</div>
        ) : !recentCourse ? (
          <div className="text-center w-full py-8 text-gray-500">수강 중인 강의가 없습니다.</div>
        ) : (
          <div
            className="card-panel p-6 w-full cursor-pointer hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 border border-gray-200"
            onClick={() => navigate(`/student/course/${recentCourse.id}`)}
          >
            <div className="flex items-center space-x-4">
              {/* Course Thumbnail */}
              <div
                className="w-40 aspect-video rounded-lg relative overflow-hidden flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${normalizeThumbnailUrl(recentCourse.thumbnail, '/thumbnails/bbb.jpg')}')` }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-base-content mb-2 line-clamp-2">{recentCourse.title}</h4>
                {lastLearnedLessonTitle ? (
                  <p className="text-sm text-base-content/70 mb-1">마지막 수강 강의: {lastLearnedLessonTitle}</p>
                ) : (
                  <p className="text-sm text-base-content/70 mb-1">마지막 수강 강의: 수강 기록이 없습니다</p>
                )}
                {lastLearnedDate ? (
                  <p className="text-sm text-base-content/70">마지막 학습 일자: {formatDate(lastLearnedDate)}</p>
                ) : (
                  <p className="text-sm text-base-content/70">마지막 학습 일자: 기록 없음</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

