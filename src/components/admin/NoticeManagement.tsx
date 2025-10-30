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
  status: string;
}

interface NoticeManagementProps {
  inquiries?: Inquiry[];
  showActions?: boolean;
}

export default function NoticeManagement({ 
  inquiries = [], 
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
      console.log("문의사항 답변:", { inquiryId: selectedInquiry.id, response: inquiryResponse });
      // 실제 구현에서는 API 호출
      setShowInquiryModal(false);
      setSelectedInquiry(null);
      setInquiryResponse("");
    }
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
          {inquiries.map((inquiry) => (
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
                <p className="text-sm text-gray-600 mb-2 break-words">{inquiry.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 break-words">문의자: {inquiry.user}</span>
                  <span className="text-xs text-gray-500 break-words">({inquiry.email})</span>
                </div>
                {showActions && inquiry.status === 'pending' && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleInquiryResponse(inquiry)}
                      className="btn-primary bg-green-600 hover:bg-green-700 text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      답변하기
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
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
          <Card className="max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 break-words">문의사항 답변</h3>
                  <p className="text-sm text-gray-600 break-words">문의사항에 답변을 작성합니다</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 break-words">{selectedInquiry.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 break-words">{selectedInquiry.content}</p>
                  <div className="mt-2 text-xs text-gray-500 break-words">
                    문의자: {selectedInquiry.user} ({selectedInquiry.email})
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 break-words">답변 내용</label>
                  <textarea
                    value={inquiryResponse}
                    onChange={(e) => setInquiryResponse(e.target.value)}
                    className="input w-full h-32 resize-none"
                    placeholder="문의사항에 대한 답변을 입력하세요"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="btn-outline"
                >
                  취소
                </button>
                <button
                  onClick={handleInquirySubmit}
                  className="btn-primary bg-green-600 hover:bg-green-700"
                >
                  <MessageSquare className="w-4 h-4" />
                  답변 전송
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
