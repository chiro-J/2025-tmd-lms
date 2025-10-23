import { useState } from "react";
import { CheckCircle, XCircle, Eye, Mail, Calendar, BookOpen, User, AlertCircle } from "lucide-react";
import Card from "../../components/ui/Card";

export default function InstructorApproval() {
  const [selectedInstructor, setSelectedInstructor] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const instructors = [
    {
      id: 1,
      name: "김강사",
      email: "kim@example.com",
      phone: "010-1234-5678",
      specialization: "React, JavaScript",
      experience: "5년",
      education: "컴퓨터공학 학사",
      appliedDate: "2025-01-15",
      status: "pending",
      documents: ["이력서.pdf", "학위증명서.pdf", "포트폴리오.pdf"],
      portfolio: "https://kim-portfolio.com",
      motivation: "학생들에게 실무 경험을 바탕으로 한 실용적인 강의를 제공하고 싶습니다.",
      previousExperience: "ABC 회사에서 3년간 프론트엔드 개발자로 근무"
    },
    {
      id: 2,
      name: "이강사",
      email: "lee@example.com",
      phone: "010-2345-6789",
      specialization: "Python, Django",
      experience: "7년",
      education: "소프트웨어공학 석사",
      appliedDate: "2025-01-14",
      status: "pending",
      documents: ["이력서.pdf", "학위증명서.pdf"],
      portfolio: "https://lee-portfolio.com",
      motivation: "백엔드 개발의 핵심 개념을 체계적으로 전달하고 싶습니다.",
      previousExperience: "XYZ 스타트업에서 백엔드 팀장으로 4년간 근무"
    },
    {
      id: 3,
      name: "박강사",
      email: "park@example.com",
      phone: "010-3456-7890",
      specialization: "Java, Spring",
      experience: "8년",
      education: "컴퓨터공학 박사",
      appliedDate: "2025-01-13",
      status: "approved",
      documents: ["이력서.pdf", "학위증명서.pdf", "자격증.pdf"],
      portfolio: "https://park-portfolio.com",
      motivation: "대기업에서의 경험을 바탕으로 실무 중심의 강의를 제공하고 싶습니다.",
      previousExperience: "대기업에서 6년간 시니어 개발자로 근무"
    },
    {
      id: 4,
      name: "최강사",
      email: "choi@example.com",
      phone: "010-4567-8901",
      specialization: "Vue.js, Node.js",
      experience: "4년",
      education: "정보통신공학 학사",
      appliedDate: "2025-01-12",
      status: "rejected",
      documents: ["이력서.pdf"],
      portfolio: "https://choi-portfolio.com",
      motivation: "최신 기술 트렌드를 학생들에게 전달하고 싶습니다.",
      previousExperience: "프리랜서로 2년간 웹 개발"
    }
  ];

  const filteredInstructors = instructors.filter(instructor => 
    filter === "all" || instructor.status === filter
  );

  const handleApprove = (id: number) => {
    console.log(`강의자 승인: ${id}`);
    // 실제 구현에서는 API 호출
  };

  const handleReject = (id: number) => {
    console.log(`강의자 거부: ${id}`);
    // 실제 구현에서는 API 호출
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "승인 대기";
      case "approved": return "승인됨";
      case "rejected": return "거부됨";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">강의자 승인 관리</h1>
              <p className="text-gray-600">강의자 신청을 검토하고 승인/거부합니다</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">총 {instructors.length}명</span>
              <span className="text-sm text-yellow-600">대기 {instructors.filter(i => i.status === "pending").length}명</span>
            </div>
          </div>

          {/* 필터 */}
          <div className="flex gap-2">
            {[
              { value: "all", label: "전체" },
              { value: "pending", label: "승인 대기" },
              { value: "approved", label: "승인됨" },
              { value: "rejected", label: "거부됨" }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.value
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 강의자 목록 */}
            <div className="lg:col-span-2 space-y-4">
              {filteredInstructors.map((instructor) => (
                <Card 
                  key={instructor.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedInstructor?.id === instructor.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedInstructor(instructor)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(instructor.status)}`}>
                            {getStatusLabel(instructor.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{instructor.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>전문분야: {instructor.specialization}</span>
                          <span>경력: {instructor.experience}</span>
                          <span>신청일: {instructor.appliedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {instructor.status === "pending" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(instructor.id);
                            }}
                            className="btn-primary bg-green-600 hover:bg-green-700 text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            승인
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(instructor.id);
                            }}
                            className="btn-primary bg-red-600 hover:bg-red-700 text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            거부
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInstructor(instructor);
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 상세 정보 */}
            <div>
              {selectedInstructor ? (
                <Card>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">상세 정보</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">이름:</span>
                          <span className="text-sm font-medium">{selectedInstructor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">이메일:</span>
                          <span className="text-sm font-medium">{selectedInstructor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">전문분야:</span>
                          <span className="text-sm font-medium">{selectedInstructor.specialization}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">경력:</span>
                          <span className="text-sm font-medium">{selectedInstructor.experience}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">학력</h4>
                      <p className="text-sm text-gray-600">{selectedInstructor.education}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">이전 경험</h4>
                      <p className="text-sm text-gray-600">{selectedInstructor.previousExperience}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">지원 동기</h4>
                      <p className="text-sm text-gray-600">{selectedInstructor.motivation}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">제출 서류</h4>
                      <div className="space-y-1">
                        {selectedInstructor.documents.map((doc: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            <span>📄</span>
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">포트폴리오</h4>
                      <a 
                        href={selectedInstructor.portfolio} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {selectedInstructor.portfolio}
                      </a>
                    </div>

                    {selectedInstructor.status === "pending" && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(selectedInstructor.id)}
                            className="btn-primary bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            승인
                          </button>
                          <button
                            onClick={() => handleReject(selectedInstructor.id)}
                            className="btn-primary bg-red-600 hover:bg-red-700 flex-1"
                          >
                            <XCircle className="w-4 h-4" />
                            거부
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card>
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">강의자를 선택하여 상세 정보를 확인하세요</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
