import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CoursePageLayout from "../../components/instructor/CoursePageLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { FileText, PlusCircle, Search, Filter, Eye, Trash2, Edit, ChevronDown } from "lucide-react";
import ModalBase from "../../components/modals/ModalBase";
import AssignmentCreateModal from "../../components/instructor/AssignmentCreateModal";
import { getAssignments, createAssignment, getSubmissionsByAssignment, deleteAssignment, updateAssignment, getAssignment } from "../../core/api/assignments";
import type { Assignment, AssignmentSubmission } from "../../types/assignment";

export default function AssignmentManagement() {
  const params = useParams();
  const courseId = Number(params.id) || 1;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | "진행 중" | "마감">("ALL");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewAssignment, setPreviewAssignment] = useState<Assignment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 과제 목록 로드
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoading(true);
        const data = await getAssignments(courseId);
        setAssignments(data);
      } catch (error) {
        // 에러는 사용자에게 알림을 표시하거나 로깅 시스템으로 전송
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, [courseId]);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const okText = a.title.toLowerCase().includes(query.toLowerCase());
      const okStatus = status === "ALL" ? true : a.status === status;
      return okText && okStatus;
    });
  }, [assignments, query, status]);

  const openSubmissions = async (assignmentId: number) => {
    try {
      setSelectedAssignmentId(assignmentId);
      const submissions = await getSubmissionsByAssignment(courseId, assignmentId);
      setSelectedSubmissions(submissions);
      setIsSubmissionsOpen(true);
    } catch (error) {
      alert('제출물을 불러오는데 실패했습니다.');
    }
  };

  const closeSubmissions = () => {
    setIsSubmissionsOpen(false);
    setSelectedAssignmentId(null);
    setSelectedSubmissions([]);
  };

  const openCreate = () => {
    setEditingAssignment(null);
    setIsCreateOpen(true);
  };
  const closeCreate = () => setIsCreateOpen(false);

  const openEdit = async (assignmentId: number) => {
    try {
      // 과제 상세 정보 가져오기
      const assignment = await getAssignment(courseId, assignmentId);
      setEditingAssignment(assignment);
      setIsEditOpen(true);
    } catch (error) {
      alert('과제 정보를 불러오는데 실패했습니다.');
    }
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingAssignment(null);
  };

  const openPreview = async (assignmentId: number) => {
    try {
      const assignment = await getAssignment(courseId, assignmentId);
      setPreviewAssignment(assignment);
      setIsPreviewOpen(true);
    } catch (error) {
      alert('과제 정보를 불러오는데 실패했습니다.');
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewAssignment(null);
  };

  const handleCreate = async (data: {
    title: string;
    description?: string;
    dueDate: string;
    maxScore?: number;
    instructions?: string[];
    contentBlocks?: any[];
  }) => {
    try {
      setIsCreating(true);
      await createAssignment(courseId, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        maxScore: data.maxScore,
        instructions: data.instructions,
        contentBlocks: data.contentBlocks,
      });

      // 목록 새로고침
      const assignmentsData = await getAssignments(courseId);
      setAssignments(assignmentsData);
      closeCreate();
    } catch (error) {
      alert('과제 생성에 실패했습니다.');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (data: {
    title: string;
    description?: string;
    dueDate: string;
    maxScore?: number;
    instructions?: string[];
    contentBlocks?: any[];
  }) => {
    if (!editingAssignment) return;

    try {
      setIsUpdating(true);
      const updated = await updateAssignment(courseId, editingAssignment.id, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        maxScore: data.maxScore,
        instructions: data.instructions,
        contentBlocks: data.contentBlocks,
      });

      // 즉시 목록에 반영 (optimistic update)
      setAssignments(prev => prev.map(a =>
        a.id === editingAssignment.id
          ? { ...a, ...updated, submissions: a.submissions, total: a.total, status: a.status }
          : a
      ));

      // 목록 새로고침 (DB에서 최신 데이터 가져오기)
      const assignmentsData = await getAssignments(courseId);
      setAssignments(assignmentsData);

      closeEdit();
      alert('과제가 성공적으로 수정되었습니다.');
    } catch (error) {
      alert('과제 수정에 실패했습니다.');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (assignmentId: number) => {
    if (!confirm('정말 이 과제를 삭제하시겠습니까?\n삭제된 과제의 제출물도 함께 삭제됩니다.')) {
      return;
    }

    try {
      setDeletingId(assignmentId);
      await deleteAssignment(courseId, assignmentId);

      // 목록 새로고침
      const assignmentsData = await getAssignments(courseId);
      setAssignments(assignmentsData);
    } catch (error) {
      alert('과제 삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <CoursePageLayout currentPageTitle="과제 관리">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </CoursePageLayout>
    );
  }

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
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="border rounded-lg px-2 py-2 pr-8 text-sm appearance-none"
                    aria-label="상태 필터"
                  >
                    <option value="ALL">전체</option>
                    <option value="진행 중">진행 중</option>
                    <option value="마감">마감</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
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
            <div className="col-span-5">제목</div>
            <div className="col-span-2">마감일</div>
            <div className="col-span-2">제출/총원</div>
            <div className="col-span-3 text-right">동작</div>
          </div>
          <ul className="divide-y">
            {filtered.map((a) => (
              <li key={a.id} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
                <div className="col-span-5 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" aria-hidden />
                  <div>
                    <div className="text-gray-900">{a.title}</div>
                    <div className="text-xs text-gray-500">상태: {a.status}</div>
                  </div>
                </div>
                <div className="col-span-2 text-gray-700">{a.dueDate}</div>
                <div className="col-span-2 text-gray-700">{a.submissions} / {a.total}</div>
                <div className="col-span-3 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => openPreview(a.id)}
                  >
                    <Eye className="h-4 w-4" aria-hidden />
                    미리보기
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-1"
                    onClick={() => openSubmissions(a.id)}
                  >
                    <Eye className="h-4 w-4" aria-hidden />
                    제출 확인
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => openEdit(a.id)}
                  >
                    <Edit className="h-4 w-4" aria-hidden />
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(a.id)}
                    disabled={deletingId === a.id}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    {deletingId === a.id ? '삭제 중...' : '삭제'}
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
                    {selectedSubmissions.map(s => (
                      <li key={s.id} className="grid grid-cols-12 px-4 py-2 text-sm items-center">
                        <div className="col-span-5 text-gray-900">{s.studentName || '이름 없음'}</div>
                        <div className="col-span-4 text-gray-700">
                          {s.submittedAt ? new Date(s.submittedAt).toLocaleString('ko-KR') : '-'}
                        </div>
                        <div className="col-span-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            s.status === '제출' ? 'bg-green-100 text-green-700' :
                            s.status === '지연' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>{s.status}</span>
                        </div>
                        <div className="col-span-1 text-right text-gray-900">{s.score ?? '-'}</div>
                      </li>
                    ))}
                    {selectedSubmissions.length === 0 && (
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
        <AssignmentCreateModal
          isOpen={isCreateOpen}
          onClose={closeCreate}
          onCreate={handleCreate}
          isCreating={isCreating}
        />

        {/* 과제 수정 모달 */}
        {editingAssignment && (
          <AssignmentCreateModal
            isOpen={isEditOpen}
            onClose={closeEdit}
            onCreate={handleUpdate}
            isCreating={isUpdating}
            isEditMode={true}
            initialData={{
              title: editingAssignment.title,
              description: editingAssignment.description,
              dueDate: editingAssignment.dueDate.includes('T')
                ? editingAssignment.dueDate.split('T')[0]
                : editingAssignment.dueDate,
              maxScore: editingAssignment.maxScore,
              instructions: editingAssignment.instructions,
              contentBlocks: editingAssignment.contentBlocks,
            }}
          />
        )}

        {/* 과제 미리보기 모달 */}
        <ModalBase open={isPreviewOpen} onClose={closePreview} title="과제 미리보기">
          {previewAssignment ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{previewAssignment.title}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>마감일: {new Date(previewAssignment.dueDate).toLocaleDateString('ko-KR')}</p>
                  <p>만점: {previewAssignment.maxScore ?? 100}점</p>
                </div>
              </div>

              {previewAssignment.description && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">과제 설명</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{previewAssignment.description}</p>
                </div>
              )}

              {previewAssignment.instructions && previewAssignment.instructions.length > 0 && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">제출 안내</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {previewAssignment.instructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}


              {previewAssignment.contentBlocks && Array.isArray(previewAssignment.contentBlocks) && previewAssignment.contentBlocks.length > 0 && (
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">과제 내용</h4>
                  <div className="space-y-2">
                    {previewAssignment.contentBlocks.map((block: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-sm whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {block.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="secondary" onClick={closePreview}>닫기</Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">과제 정보를 불러오는 중...</div>
          )}
        </ModalBase>
      </div>
    </CoursePageLayout>
  );
}


