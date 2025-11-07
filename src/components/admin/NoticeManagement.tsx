import { useState } from "react";
import { Bell, Edit, Trash2, MessageSquare } from "lucide-react";
import Card from "../ui/Card";
import { useNotice } from "../../contexts/NoticeContext";

interface Inquiry {
  id: number;
  title: string;
  user: string;
  email: string;
  content: string;
  createdDate: string;
  status: 'pending' | 'completed';
  response?: string;
}

interface NoticeManagementProps {
  inquiries?: Inquiry[];
  onRespondToInquiry?: (id: number, response: string) => void;
  showActions?: boolean;
}

export default function NoticeManagement({
  inquiries = [],
  onRespondToInquiry,
  showActions = true
}: NoticeManagementProps) {
  const { notices, addNotice, updateNotice, deleteNotice } = useNotice();
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "" });
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [inquiryResponse, setInquiryResponse] = useState("");

  const handleNoticeCreate = () => {
    setEditingNotice(null);
    setNoticeForm({ title: "", content: "" });
    setShowNoticeModal(true);
  };

  const handleNoticeEdit = (notice: any) => {
    setEditingNotice(notice);
    setNoticeForm({ title: notice.title, content: notice.content });
    setShowNoticeModal(true);
  };

  const handleNoticeDelete = (id: number) => {
    if (window.confirm("이 공지사항을 삭제하시겠습니까?")) {
      deleteNotice(id);
    }
  };

  const handleNoticeSubmit = () => {
    if (noticeForm.title.trim() && noticeForm.content.trim()) {
      if (editingNotice) {
        updateNotice(editingNotice.id, {
          title: noticeForm.title.trim(),
          content: noticeForm.content.trim()
        });
      } else {
        addNotice({
          title: noticeForm.title.trim(),
          content: noticeForm.content.trim(),
          date: new Date().toISOString().split('T')[0],
          author: "서브 관리자",
          priority: "medium"
        });
      }
      setShowNoticeModal(false);
      setNoticeForm({ title: "", content: "" });
      setEditingNotice(null);
    }
  };

  const handleInquiryResponse = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setInquiryResponse("");
    setShowInquiryModal(true);
  };

  const handleInquirySubmit = () => {
    if (selectedInquiry && inquiryResponse.trim()) {
      if (onRespondToInquiry) {
        onRespondToInquiry(selectedInquiry.id, inquiryResponse.trim());
      }
      setShowInquiryModal(false);
      setSelectedInquiry(null);
      setInquiryResponse("");
    } else {
      alert('답변 내용을 입력해주세요.');
    }
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setInquiryResponse(inquiry.response || "");
    setShowInquiryModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        {showActions && (
          <button
            onClick={handleNoticeCreate}
            className="btn-primary bg-orange-600 hover:bg-orange-700"
          >
            <Bell className="w-4 h-4" />
            공지사항 작성
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 공지사항 관리 */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900 break-words">공지사항 관리</h3>
          {notices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 break-words">{notice.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      notice.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {notice.status === 'active' ? '활성' : '비활성'}
                    </span>
                    {showActions && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleNoticeEdit(notice)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleNoticeDelete(notice.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 break-words">{notice.content}</p>
                <span className="text-xs text-gray-500 break-words">작성일: {notice.createdDate}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* 문의사항 관리 */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900 break-words">문의사항 관리</h3>
          {inquiries.length === 0 ? (
            <p className="text-center text-gray-500 py-8 break-words">문의사항이 없습니다.</p>
          ) : (
            inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 break-words">{inquiry.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status === 'pending' ? '대기' : '완료'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 break-words line-clamp-2">{inquiry.content}</p>
                  {inquiry.response && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-2">
                      <p className="text-xs font-medium text-blue-800 mb-1 break-words">답변:</p>
                      <p className="text-sm text-gray-700 break-words">{inquiry.response}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 break-words">문의자: {inquiry.user}</span>
                    <span className="text-xs text-gray-500 break-words">({inquiry.email})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 break-words">문의일: {inquiry.createdDate}</span>
                    {showActions && (
                      <div className="flex gap-2">
                        {inquiry.status === 'pending' ? (
                          <button
                            onClick={() => handleInquiryResponse(inquiry)}
                            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            답변하기
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewInquiry(inquiry)}
                            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            답변 보기
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 공지사항 작성/수정 모달 */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {editingNotice ? "공지사항 수정" : "공지사항 작성"}
                  </h3>
                  <p className="text-sm text-gray-600 break-words">
                    {editingNotice ? "공지사항을 수정합니다" : "새로운 공지사항을 작성합니다"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">제목</label>
                  <input
                    type="text"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                    className="input w-full"
                    placeholder="공지사항 제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">내용</label>
                  <textarea
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm(prev => ({ ...prev, content: e.target.value }))}
                    className="input w-full h-32 resize-none"
                    placeholder="공지사항 내용을 입력하세요"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNoticeModal(false)}
                  className="btn-outline"
                >
                  취소
                </button>
                <button
                  onClick={handleNoticeSubmit}
                  className="btn-primary bg-orange-600 hover:bg-orange-700"
                >
                  <Bell className="w-4 h-4" />
                  {editingNotice ? "공지사항 수정" : "공지사항 작성"}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 문의사항 답변 모달 */}
      {showInquiryModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedInquiry.status === 'completed' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <MessageSquare className={`w-5 h-5 ${
                    selectedInquiry.status === 'completed' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    {selectedInquiry.status === 'completed' ? '문의사항 및 답변 확인' : '문의사항 답변'}
                  </h3>
                  <p className="text-sm text-gray-600 break-words">
                    {selectedInquiry.status === 'completed'
                      ? '문의사항과 답변을 확인합니다'
                      : '문의사항에 답변을 작성합니다'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* 문의사항 내용 */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 break-words">{selectedInquiry.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedInquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedInquiry.status === 'pending' ? '대기' : '완료'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 break-words whitespace-pre-wrap">{selectedInquiry.content}</p>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 break-words">
                      <span className="font-medium">문의자:</span> {selectedInquiry.user} ({selectedInquiry.email})
                    </div>
                    <div className="text-xs text-gray-500 mt-1 break-words">
                      <span className="font-medium">문의일:</span> {selectedInquiry.createdDate}
                    </div>
                  </div>
                </div>

                {/* 답변 영역 */}
                {selectedInquiry.status === 'completed' && selectedInquiry.response && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h5 className="font-medium text-blue-900 mb-2 break-words">관리자 답변</h5>
                    <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">{selectedInquiry.response}</p>
                  </div>
                )}

                {/* 답변 작성 영역 (대기 상태일 때만) */}
                {selectedInquiry.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 break-words">답변 내용</label>
                    <textarea
                      value={inquiryResponse}
                      onChange={(e) => setInquiryResponse(e.target.value)}
                      className="input w-full h-32 resize-none"
                      placeholder="문의사항에 대한 답변을 입력하세요. 이 답변은 문의자에게 전달됩니다."
                    />
                    <p className="text-xs text-gray-500 mt-1 break-words">
                      답변을 작성하면 문의자에게 전달되고 상태가 "완료"로 변경됩니다.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowInquiryModal(false);
                    setSelectedInquiry(null);
                    setInquiryResponse("");
                  }}
                  className="btn-outline"
                >
                  닫기
                </button>
                {selectedInquiry.status === 'pending' && (
                  <button
                    onClick={handleInquirySubmit}
                    className="btn-primary bg-green-600 hover:bg-green-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    답변 전송
                  </button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
