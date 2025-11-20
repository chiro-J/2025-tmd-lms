import { useState } from "react";
import { MessageSquare, Search, X, ChevronDown } from "lucide-react";
import Card from "../ui/Card";
import * as adminApi from "../../core/api/admin";

interface Inquiry {
  id: number;
  title: string;
  user: string;
  email: string;
  content: string;
  createdDate: string;
  status: 'pending' | 'completed';
  response?: string;
  courseName?: string;
  courseNumber?: string;
  role?: string;
}

interface InquiryManagementProps {
  inquiries?: Inquiry[];
  onRespondToInquiry?: (id: number, response: string) => void;
  showActions?: boolean;
}

export default function InquiryManagement({
  inquiries = [],
  onRespondToInquiry,
  showActions = true
}: InquiryManagementProps) {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inquiryResponse, setInquiryResponse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourseName, setFilterCourseName] = useState("");
  const [filterCourseNumber, setFilterCourseNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'instructor'>('all');

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

  // 필터링된 문의사항 목록
  const filteredInquiries = inquiries.filter(inquiry => {
    // 검색어 필터
    if (searchQuery && !inquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inquiry.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inquiry.user.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 코스 이름 필터
    if (filterCourseName && inquiry.courseName !== filterCourseName) {
      return false;
    }
    // 기수 필터
    if (filterCourseNumber && inquiry.courseNumber !== filterCourseNumber) {
      return false;
    }
    // 상태 필터
    if (filterStatus !== 'all' && inquiry.status !== filterStatus) {
      return false;
    }
    // 역할 필터
    if (filterRole !== 'all' && inquiry.role !== filterRole) {
      return false;
    }
    return true;
  });

  // 고유한 코스 이름 목록
  const uniqueCourseNames = [...new Set(inquiries.map(i => i.courseName).filter(Boolean))] as string[];
  // 고유한 기수 목록
  const uniqueCourseNumbers = [...new Set(inquiries.map(i => i.courseNumber).filter(Boolean))] as string[];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white">
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">문의사항 관리</h3>
            <div className="text-sm text-gray-600">
              전체 {inquiries.length}건 / 표시 {filteredInquiries.length}건
            </div>
          </div>

          {/* 필터 및 검색 영역 */}
          <div className="mb-5 space-y-3">
            <div className="flex flex-wrap gap-3">
              {/* 검색 */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="제목, 내용, 문의자 검색..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 코스 이름 필터 */}
              <div className="min-w-[150px]">
                <div className="relative">
                  <select
                    value={filterCourseName}
                    onChange={(e) => setFilterCourseName(e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer"
                  >
                    <option value="">전체 코스</option>
                    {uniqueCourseNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 기수 필터 */}
              <div className="min-w-[120px]">
                <div className="relative">
                  <select
                    value={filterCourseNumber}
                    onChange={(e) => setFilterCourseNumber(e.target.value)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer"
                  >
                    <option value="">전체 기수</option>
                    {uniqueCourseNumbers.map((number) => (
                      <option key={number} value={number}>{number}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 상태 필터 */}
              <div className="min-w-[120px]">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'completed')}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">전체 상태</option>
                    <option value="pending">답변 대기</option>
                    <option value="completed">답변 완료</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 역할 필터 */}
              <div className="min-w-[120px]">
                <div className="relative">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as 'all' | 'student' | 'instructor')}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">전체 역할</option>
                    <option value="student">수강생</option>
                    <option value="instructor">강의자</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 필터 초기화 - 항상 표시 */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCourseName("");
                  setFilterCourseNumber("");
                  setFilterStatus('all');
                  setFilterRole('all');
                }}
                disabled={!searchQuery && !filterCourseName && !filterCourseNumber && filterStatus === 'all' && filterRole === 'all'}
                className="px-4 py-2 border border-gray-300 rounded-lg transition-colors text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 disabled:hover:bg-white"
              >
                <X className="h-4 w-4" />
                초기화
              </button>
            </div>
          </div>

          {/* 문의사항 게시판 테이블 */}
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-base text-gray-500">문의사항이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">번호</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">제목</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">문의자</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">역할</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">코스</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">기수</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">문의일</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry, index) => (
                    <tr key={inquiry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-base text-gray-600">{filteredInquiries.length - index}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewInquiry(inquiry)}
                          className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
                        >
                          {inquiry.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-base text-gray-700">
                        <div>
                          <div className="font-medium">{inquiry.user}</div>
                          <div className="text-sm text-gray-500">{inquiry.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {inquiry.role && (
                          <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                            inquiry.role === 'instructor'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {inquiry.role === 'instructor' ? '강의자' : '수강생'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-600">
                        {inquiry.courseName || '-'}
                      </td>
                      <td className="px-4 py-3 text-base text-gray-600">
                        {inquiry.courseNumber || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                          inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {inquiry.status === 'pending' ? '답변 대기' : '답변 완료'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-base text-gray-600">{inquiry.createdDate}</td>
                      <td className="px-4 py-3">
                        {showActions && (
                          inquiry.status === 'pending' ? (
                            <button
                              onClick={() => handleInquiryResponse(inquiry)}
                              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <MessageSquare className="w-4 h-4" />
                              답변
                            </button>
                          ) : (
                            <button
                              onClick={() => handleViewInquiry(inquiry)}
                              className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                            >
                              <MessageSquare className="w-4 h-4" />
                              보기
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

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
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                    <div className="text-xs text-gray-500 break-words">
                      <span className="font-medium">문의자:</span> {selectedInquiry.user} ({selectedInquiry.email})
                    </div>
                    {(selectedInquiry.courseName || selectedInquiry.courseNumber) && (
                      <div className="text-xs text-gray-500 break-words">
                        <span className="font-medium">수강 코스:</span> {selectedInquiry.courseName || '-'} {selectedInquiry.courseNumber ? `- ${selectedInquiry.courseNumber}` : ''}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 break-words">
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





