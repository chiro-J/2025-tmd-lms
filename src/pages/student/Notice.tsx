import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar } from 'lucide-react';
import { mockNotices } from '../../mocks';

export default function StudentNotice() {
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
          {mockNotices.map((notice) => (
            <div key={notice.id} className="card-panel p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{notice.date}</span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  중요
                </span>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{notice.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 (공지사항이 없을 때) */}
        {mockNotices.length === 0 && (
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
