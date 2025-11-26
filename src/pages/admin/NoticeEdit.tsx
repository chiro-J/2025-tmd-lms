import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, User, Save, X, Upload, XCircle, File, Image as ImageIcon } from 'lucide-react';
import * as adminApi from '../../core/api/admin';
import { uploadFile } from '../../core/api/upload';
import Card from '../../components/ui/Card';

export default function AdminNoticeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<adminApi.Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'active' as 'active' | 'inactive'
  });
  const [attachments, setAttachments] = useState<Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }>>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadNotice = async () => {
      if (!id) {
        navigate('/admin/sub-dashboard?section=platform');
        return;
      }

      try {
        const data = await adminApi.getNotice(parseInt(id, 10));
        setNotice(data);
        setFormData({
          title: data.title || '',
          content: data.content || '',
          priority: (data.priority || 'medium') as 'low' | 'medium' | 'high',
          status: (data.status || 'active') as 'active' | 'inactive'
        });
        // 기존 첨부파일 로드
        if (data.attachments && Array.isArray(data.attachments)) {
          setAttachments(data.attachments);
        }
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('파일 크기는 100MB를 초과할 수 없습니다.');
      return;
    }

    setUploading(true);
    try {
      let fileType: 'pdf' | 'image' | 'video' = 'image';
      if (file.type === 'application/pdf') {
        fileType = 'pdf';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      } else if (file.type.startsWith('image/')) {
        fileType = 'image';
      }

      const result = await uploadFile(file, fileType, 'notice');
      setAttachments(prev => [...prev, result]);
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert('파일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (!id) {
      return;
    }

    setSaving(true);
    try {
      await adminApi.updateNotice(parseInt(id, 10), {
        title: formData.title.trim(),
        content: formData.content.trim(),
        priority: formData.priority,
        status: formData.status,
        attachments: attachments.length > 0 ? attachments : null
      });
      alert('공지사항이 수정되었습니다.');
      navigate(`/admin/notice/${id}`);
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      alert('공지사항 수정에 실패했습니다.');
    } finally {
      setSaving(false);
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
            to={`/admin/notice/${id}`}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">공지사항 상세로 돌아가기</span>
          </Link>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">공지사항 수정</h1>
                <p className="text-gray-600">시스템 공지사항을 수정하세요</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/admin/notice/${id}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>

        {/* 공지사항 수정 폼 */}
        <Card className="p-8">
          {/* 제목 및 우선순위 */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-2xl font-bold text-gray-900"
                  placeholder="공지사항 제목을 입력하세요"
                />
              </div>
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">중요도</label>
                <div className="flex gap-2">
                  <label className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                    formData.priority === 'low'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={formData.priority === 'low'}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="sr-only"
                    />
                    낮음
                  </label>
                  <label className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                    formData.priority === 'medium'
                      ? 'bg-blue-200 text-blue-800'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}>
                    <input
                      type="radio"
                      name="priority"
                      value="medium"
                      checked={formData.priority === 'medium'}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="sr-only"
                    />
                    일반
                  </label>
                  <label className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                    formData.priority === 'high'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}>
                    <input
                      type="radio"
                      name="priority"
                      value="high"
                      checked={formData.priority === 'high'}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="sr-only"
                    />
                    중요
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">활성</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">비활성</span>
              </label>
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 leading-relaxed resize-none"
              rows={15}
              placeholder="공지사항 내용을 입력하세요"
            />
          </div>

          {/* 첨부파일 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">첨부파일</label>
            <div className="space-y-4">
              {/* 파일 업로드 버튼 */}
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {uploading ? '업로드 중...' : '파일을 선택하거나 드래그하세요'}
                  </span>
                  <span className="text-xs text-gray-500">이미지, PDF, 동영상 (최대 100MB)</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf,video/*"
                  disabled={uploading}
                />
              </label>

              {/* 첨부파일 목록 */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
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
                      <button
                        onClick={() => handleRemoveAttachment(index)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(`/admin/notice/${id}`)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}



