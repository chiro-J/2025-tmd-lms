import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, User, File, Image as ImageIcon, Download } from 'lucide-react';
import * as adminApi from '../../core/api/admin';
import { getDownloadUrl } from '../../utils/download';

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<adminApi.Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotice = async () => {
      if (!id) {
        navigate('/student/notice');
        return;
      }

      try {
        // 개별 공지사항 조회 API 사용
        const foundNotice = await adminApi.getNotice(parseInt(id, 10));

        if (!foundNotice || foundNotice.status !== 'active') {
          navigate('/student/notice');
          return;
        }

        setNotice(foundNotice);
      } catch (error) {
        console.error('공지사항 로드 실패:', error);
        navigate('/student/notice');
      } finally {
        setLoading(false);
      }
    };

    loadNotice();
  }, [id, navigate]);

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

  if (!notice) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-200">
      <main className="container-page py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            to="/student/notice"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">공지사항 목록으로 돌아가기</span>
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

        {/* 공지사항 상세 */}
        <div className="card-panel p-8">
          {/* 제목 및 우선순위 */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 flex-1 pr-4">{notice.title}</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${getPriorityColor(notice.priority)}`}>
              {getPriorityText(notice.priority)}
            </span>
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
          <div className="prose max-w-none mb-6">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {notice.content}
            </div>
          </div>

          {/* 첨부파일 */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">첨부파일</h3>
              <div className="space-y-2">
                {notice.attachments.map((attachment, index) => {
                  return (
                    <a
                      key={index}
                      href={getDownloadUrl(attachment)}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {attachment.mimetype.startsWith('image/') ? (
                          <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        ) : (
                          <File className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{attachment.originalname}</p>
                          <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <Download className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}






