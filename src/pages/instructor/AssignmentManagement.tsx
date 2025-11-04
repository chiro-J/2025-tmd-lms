import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CoursePageLayout from "../../components/instructor/CoursePageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { FileText, PlusCircle, Search, Filter, Eye } from "lucide-react";
import ModalBase from "../../components/modals/ModalBase";
import { mockAssignments as sharedAssignments, mockSubmissionsByAssignment } from "../../data/assignments";
import type { Assignment } from "../../types/assignment";

// use shared data

export default function AssignmentManagement() {
  const params = useParams();
  const courseId = Number(params.id) || 1;

  const [assignments, setAssignments] = useState<Assignment[]>(sharedAssignments.filter(a => a.courseId === courseId));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | "진행 중" | "마감">("ALL");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const okText = a.title.toLowerCase().includes(query.toLowerCase());
      const okStatus = status === "ALL" ? true : a.status === status;
      return okText && okStatus;
    });
  }, [assignments, query, status]);

  const openSubmissions = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setIsSubmissionsOpen(true);
  };

  const closeSubmissions = () => {
    setIsSubmissionsOpen(false);
    setSelectedAssignmentId(null);
  };

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handleCreate = () => {
    const nextId = Math.max(0, ...assignments.map(a => a.id)) + 1;
    const newItem: Assignment = {
      id: nextId,
      courseId,
      title: newTitle.trim() || "새 과제",
      dueDate: newDueDate || new Date().toISOString().slice(0, 10),
      submissions: 0,
      total: 30,
      status: "진행 중",
      description: newDescription.trim(),
    };
    setAssignments([newItem, ...assignments]);
    setNewTitle("");
    setNewDueDate("");
    setNewDescription("");
    setIsCreateOpen(false);
  };

  return (
    <CoursePageLayout currentPageTitle="과제 관리">
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" aria-hidden />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="과제 제목 검색"
                  className="pl-8 pr-3 py-2 border rounded-lg text-sm w-64"
                  aria-label="과제 검색"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" aria-hidden />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="border rounded-lg px-2 py-2 text-sm"
                  aria-label="상태 필터"
                >
                  <option value="ALL">전체</option>
                  <option value="진행 중">진행 중</option>
                  <option value="마감">마감</option>
                </select>
              </div>
            </div>
            <Button variant="primary" className="flex items-center gap-2" onClick={openCreate}>
              <PlusCircle className="h-4 w-4" aria-hidden />
              새 과제 만들기
            </Button>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-xs text-gray-500 bg-gray-50">
            <div className="col-span-6">제목</div>
            <div className="col-span-2">마감일</div>
            <div className="col-span-2">제출/총원</div>
            <div className="col-span-2 text-right">동작</div>
          </div>
          <ul className="divide-y">
            {filtered.map((a) => (
              <li key={a.id} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
                <div className="col-span-6 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" aria-hidden />
                  <div>
                    <div className="text-gray-900">{a.title}</div>
                    <div className="text-xs text-gray-500">상태: {a.status}</div>
                  </div>
                </div>
                <div className="col-span-2 text-gray-700">{a.dueDate}</div>
                <div className="col-span-2 text-gray-700">{a.submissions} / {a.total}</div>
                <div className="col-span-2 flex justify-end">
                  <Button size="sm" variant="secondary" className="flex items-center gap-1" onClick={() => openSubmissions(a.id)}>
                    <Eye className="h-4 w-4" aria-hidden />
                    제출 확인
                  </Button>
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-gray-500">조건에 맞는 과제가 없습니다.</li>
            )}
          </ul>
        </Card>

        {/* 제출 목록 모달 */}
        <ModalBase open={isSubmissionsOpen} onClose={closeSubmissions} title="제출 목록">
          <div className="space-y-4">
            {selectedAssignmentId != null ? (
              <>
                <div className="text-sm text-gray-600">
                  과제 ID: {selectedAssignmentId}
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 bg-gray-50 text-xs text-gray-500 px-4 py-2">
                    <div className="col-span-5">수강생</div>
                    <div className="col-span-4">제출 시간</div>
                    <div className="col-span-2">상태</div>
                    <div className="col-span-1 text-right">점수</div>
                  </div>
                  <ul className="divide-y max-h-72 overflow-auto">
                    {(mockSubmissionsByAssignment[selectedAssignmentId] || []).map(s => (
                      <li key={s.id} className="grid grid-cols-12 px-4 py-2 text-sm items-center">
                        <div className="col-span-5 text-gray-900">{s.studentName}</div>
                        <div className="col-span-4 text-gray-700">{s.submittedAt.replace('T', ' ')}</div>
                        <div className="col-span-2">
                          <span className={`px-2 py-1 rounded text-xs ${s.status === '제출' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                        </div>
                        <div className="col-span-1 text-right text-gray-900">{s.score ?? '-'}</div>
                      </li>
                    ))}
                    {(mockSubmissionsByAssignment[selectedAssignmentId] || []).length === 0 && (
                      <li className="px-4 py-8 text-center text-sm text-gray-500">제출이 없습니다.</li>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">과제를 선택하세요.</div>
            )}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={closeSubmissions}>닫기</Button>
            </div>
          </div>
        </ModalBase>

        {/* 과제 생성 모달 */}
        <ModalBase open={isCreateOpen} onClose={closeCreate} title="새 과제 만들기">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">제목</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="과제 제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">마감일</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">설명</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm h-28"
                placeholder="과제 설명을 입력하세요"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeCreate}>취소</Button>
              <Button variant="primary" onClick={handleCreate}>생성</Button>
            </div>
          </div>
        </ModalBase>
      </div>
    </CoursePageLayout>
  );
}


