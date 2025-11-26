import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Bell, File, Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { getCourse, getCourseNotices, deleteCourseNotice, type CourseNotice } from '../../core/api/courses';
import { useAuth } from '../../contexts/AuthContext';
import { getDownloadUrl } from '../../utils/download';

export default function CourseNoticeDetail() {
  const { courseId, noticeId } = useParams<{ courseId: string; noticeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notices, setNotices] = useState<CourseNotice[]>([]);
  const [notice, setNotice] = useState<CourseNotice | null>(null);
  const [course, setCourse] = useState<{ title: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // 강좌 정보 및 공지 목록 로드
  useEffect(() => {
    const loadData = async () => {
      if (!courseId) {
        navigate(-1);
        return;
      }

      try {
        // 강좌 정보 로드
        const courseData = await getCourse(Number(courseId));
        setCourse({ title: courseData.title });

        // 공지 목록 로드
        const allNotices = await getCourseNotices(Number(courseId));
        setNotices(allNotices);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

    loadData();
  }, [courseId, navigate]);

  // 선택된 공지 로드
  useEffect(() => {
    if (!noticeId) {
      setLoading(false);
      return;
    }

    if (notices.length === 0) {
      // 아직 목록이 로드되지 않음
      return;
    }

    const foundNotice = notices.find(n => n.id === parseInt(noticeId, 10));
    if (foundNotice) {
      setNotice(foundNotice);
      setLoading(false);
    } else {
      // 공지 목록은 있지만 해당 ID가 없는 경우
      navigate(-1);
    }
  }, [noticeId, notices, navigate]);

  const handleNoticeClick = (clickedNoticeId: number) => {
    if (clickedNoticeId.toString() !== noticeId) {
      navigate(`/${user?.role === 'instructor' ? 'instructor' : 'student'}/course/${courseId}/notice/${clickedNoticeId}`, { replace: true });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBackUrl = () => {
    if (user?.role === 'instructor') {
      return `/instructor/course/${courseId}/notices`;
    }
    return `/student/course/${courseId}`;
  };

  const handleDelete = async () => {
    if (!courseId || !noticeId) return;
    if (!confirm('정말 이 공지사항을 삭제하시겠습니까? 첨부된 파일도 함께 삭제됩니다.')) {
      return;
    }

    try {
      await deleteCourseNotice(Number(courseId), Number(noticeId));
      alert('공지사항이 삭제되었습니다.');
      navigate(getBackUrl());
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      alert('공지사항 삭제에 실패했습니다.');
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
            to={getBackUrl()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">
              {user?.role === 'instructor' ? '공지 관리로 돌아가기' : '강좌로 돌아가기'}
            </span>
          </Link>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {course ? `${course.title} 공지사항` : '강좌 공지사항'}
              </h1>
            </div>
          </div>
        </div>

        {/* 좌우 레이아웃 */}
        <div className="flex gap-6">
          {/* 왼쪽: 공지 목록 */}
          <div className="w-64 flex-shrink-0">
            <div className="card-panel p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">공지 목록</h3>
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {notices.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">공지사항이 없습니다.</p>
                ) : (
                  notices.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNoticeClick(n.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        n.id === notice?.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <h4 className={`font-medium text-sm mb-1 ${
                        n.id === notice?.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {n.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(n.createdAt)}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 공지사항 상세 */}
          <div className="flex-1 min-w-0">
            <div className="card-panel p-8">
              {/* 제목 */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900">{notice.title}</h2>
              </div>

              {/* 메타 정보 */}
              <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(notice.createdAt)}</span>
                </div>
              </div>

              {/* 내용 */}
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                  {notice.content}
                </div>
              </div>

              {/* 첨부파일 */}
              {notice.attachments && notice.attachments.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">첨부파일</h3>
                  <div className="space-y-2">
                    {notice.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={getDownloadUrl(attachment)}
                        download
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {attachment.mimetype.startsWith('image/') ? (
                          <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        ) : (
                          <File className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                        <span className="text-sm text-gray-700 flex-1 truncate">{attachment.originalname}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          ({(attachment.size / 1024).toFixed(1)} KB)
                        </span>
                        <Download className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 강의자 수정/삭제 버튼 */}
              {user?.role === 'instructor' && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-3">
                  <Link
                    to={`/instructor/course/${courseId}/notices/${noticeId}/edit`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    수정하기
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

