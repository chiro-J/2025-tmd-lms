import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Edit, Trash2, Calendar, ChevronRight, Plus } from "lucide-react";
import Card from "../ui/Card";
import * as adminApi from "../../core/api/admin";

interface NoticeManagementProps {
  showActions?: boolean;
}

export default function NoticeManagement({
  showActions = true
}: NoticeManagementProps) {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<adminApi.Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getNotices();
      // 우선순위 순으로 정렬
      const sortedNotices = data.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
      });
      setNotices(sortedNotices);
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleNoticeCreate = () => {
    navigate('/admin/notice/new');
  };

  const handleNoticeView = (notice: adminApi.Notice) => {
    navigate(`/admin/notice/${notice.id}`);
  };

  const handleNoticeEdit = (notice: adminApi.Notice, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    navigate(`/admin/notice/${notice.id}/edit`);
  };

  const handleNoticeDelete = async (id: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (window.confirm("이 공지사항을 삭제하시겠습니까?")) {
      try {
        await adminApi.deleteNotice(id);
        await loadNotices();
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
        alert('공지사항 삭제에 실패했습니다.');
      }
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Bell className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">공지사항 관리</h2>
            <p className="text-gray-600">시스템 공지사항을 관리하고 작성하세요</p>
          </div>
        </div>
        {showActions && (
          <button
            onClick={handleNoticeCreate}
            className="btn-primary bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            공지사항 작성
          </button>
        )}
      </div>

      {/* 공지사항 목록 */}
      {notices.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">새로운 공지사항이 없습니다</h3>
          <p className="text-gray-600 mb-6">중요한 업데이트나 공지사항이 있을 때 여기에 표시됩니다.</p>
          {showActions && (
            <button
              onClick={handleNoticeCreate}
              className="btn-primary bg-orange-600 hover:bg-orange-700 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              첫 공지사항 작성하기
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => handleNoticeView(notice)}
              className="card-panel p-5 hover:shadow-md transition-all hover:bg-gray-50 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {notice.title}
                      </h3>
                      {notice.status === 'inactive' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          비활성
                        </span>
                      )}
                    </div>
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
                  {showActions && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleNoticeEdit(notice, e)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleNoticeDelete(notice.id, e)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
