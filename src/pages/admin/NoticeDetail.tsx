import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, User, Edit, Trash2 } from 'lucide-react';
import * as adminApi from '../../core/api/admin';
import Card from '../../components/ui/Card';

export default function AdminNoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<adminApi.Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotice = async () => {
      if (!id) {
        navigate('/admin/sub-dashboard?section=platform');
        return;
      }

      try {
        const data = await adminApi.getNotice(parseInt(id, 10));
        setNotice(data);
      } catch (error) {
        console.error('공지사항 로드 실패:', error);
        alert('공지사항을 불러오는데 실패했습니다.');
        navigate('/admin/sub-dashboard?section=platform');
      } finally {
        setLoading(false);
      }
    };

    loadNotice();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!notice || !window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await adminApi.deleteNotice(notice.id);
      alert('공지사항이 삭제되었습니다.');
      navigate('/admin/sub-dashboard?section=platform');
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      alert('공지사항 삭제에 실패했습니다.');
    }
  };

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container-page py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            to="/admin/sub-dashboard?section=platform"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">공지사항 관리로 돌아가기</span>
          </Link>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">공지사항 상세</h1>
                <p className="text-gray-600">시스템 공지사항을 확인하고 관리하세요</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/admin/notice/${notice.id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                수정
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            </div>
          </div>
        </div>

        {/* 공지사항 상세 */}
        <Card className="p-8">
          {/* 제목 및 우선순위 */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 flex-1 pr-4">{notice.title}</h2>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${getPriorityColor(notice.priority)}`}>
                {getPriorityText(notice.priority)}
              </span>
              {notice.status === 'inactive' && (
                <span className="px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap bg-gray-100 text-gray-800">
                  비활성
                </span>
              )}
            </div>
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
            {notice.author && (
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">작성자: {notice.author}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{notice.createdDate}</span>
            </div>
          </div>

          {/* 내용 */}
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {notice.content}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}



