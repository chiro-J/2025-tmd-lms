import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, ChevronRight } from 'lucide-react';
import * as adminApi from '../../core/api/admin';

export default function StudentNotice() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<adminApi.Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const data = await adminApi.getNotices();
        // 활성 상태인 공지사항만 필터링하고 우선순위 순으로 정렬
        const activeNotices = data
          .filter(notice => notice.status === 'active')
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
          });
        setNotices(activeNotices);
      } catch (error) {
        console.error('공지사항 로드 실패:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, []);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '중요';
      case 'medium':
        return '일반';
      case 'low':
        return '낮음';
      default:
        return '일반';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-200">
      <main className="container-page py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">대시보드로 돌아가기</span>
          </Link>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시스템 공지사항</h1>
              <p className="text-gray-600">중요한 시스템 업데이트 및 공지사항을 확인하세요</p>
            </div>
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="space-y-4">
          {notices.map((notice) => (
            <button
              key={notice.id}
              onClick={() => navigate(`/student/notice/${notice.id}`)}
              className="w-full text-left card-panel p-5 hover:shadow-md transition-all hover:bg-gray-50 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {notice.title}
                    </h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{notice.createdDate}</span>
                      </div>
                      {notice.author && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>작성자: {notice.author}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notice.priority)}`}>
                    {getPriorityText(notice.priority)}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 빈 상태 (공지사항이 없을 때) */}
        {notices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">새로운 공지사항이 없습니다</h3>
            <p className="text-gray-600">중요한 업데이트나 공지사항이 있을 때 여기에 표시됩니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}
