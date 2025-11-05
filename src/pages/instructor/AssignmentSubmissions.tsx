import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import SubmissionDetailModal from '../../components/instructor/SubmissionDetailModal'
import { Search, Filter, Download, FileText, CheckCircle, Clock, XCircle, Edit2 } from 'lucide-react'
import { mockAssignments, mockSubmissionsByAssignment } from '../../data/assignments'
import type { AssignmentSubmission } from '../../types/assignment'

export default function AssignmentSubmissions() {
  const params = useParams()
  const courseId = Number(params.id) || 1

  const assignments = mockAssignments.filter(a => a.courseId === courseId)

  // 모든 제출물을 하나의 배열로 합치기
  const allSubmissions = useMemo(() => {
    const submissions: (AssignmentSubmission & { assignmentTitle: string })[] = []
    assignments.forEach(assignment => {
      const assignmentSubmissions = mockSubmissionsByAssignment[assignment.id] || []
      assignmentSubmissions.forEach(sub => {
        submissions.push({
          ...sub,
          assignmentTitle: assignment.title
        })
      })
    })
    return submissions
  }, [assignments])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | '제출' | '지각' | '미제출'>('all')
  const [editingScoreId, setEditingScoreId] = useState<number | null>(null)
  const [tempScore, setTempScore] = useState<string>('')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<(AssignmentSubmission & { assignmentTitle: string }) | null>(null)

  const filteredSubmissions = useMemo(() => {
    return allSubmissions.filter(sub => {
      const matchesSearch = sub.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesAssignment = selectedAssignmentId === 'all' || sub.assignmentId === selectedAssignmentId
      const matchesStatus = selectedStatus === 'all' || sub.status === selectedStatus
      return matchesSearch && matchesAssignment && matchesStatus
    })
  }, [allSubmissions, searchQuery, selectedAssignmentId, selectedStatus])

  const handleEditScore = (submissionId: number, currentScore?: number) => {
    setEditingScoreId(submissionId)
    setTempScore(currentScore?.toString() || '')
  }

  const handleSaveScore = (submissionId: number) => {
    // 실제로는 API 호출
    // TODO: API 호출 구현
    setEditingScoreId(null)
    setTempScore('')
  }

  const handleCancelEdit = () => {
    setEditingScoreId(null)
    setTempScore('')
  }

  const handleViewDetail = (submission: AssignmentSubmission & { assignmentTitle: string }) => {
    setSelectedSubmission(submission)
    setIsDetailModalOpen(true)
  }

  const handleSaveScoreFromModal = (submissionId: number, score: number, feedback: string) => {
    // 실제로는 API 호출
    // TODO: API 호출 구현 및 allSubmissions 업데이트
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '제출':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            제출
          </span>
        )
      case '지각':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            지각
          </span>
        )
      case '미제출':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            미제출
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: allSubmissions.length,
    submitted: allSubmissions.filter(s => s.status === '제출').length,
    late: allSubmissions.filter(s => s.status === '지각').length,
    pending: allSubmissions.filter(s => s.status === '미제출').length
  }

  return (
    <CoursePageLayout currentPageTitle="제출물 조회">
      <div className="space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 제출물</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">정상 제출</p>
                <p className="text-2xl font-bold text-green-600">{stats.submitted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">지각 제출</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">미제출</p>
                <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="학생 이름 검색"
                  className="pl-8 pr-3 py-2 border rounded-lg text-sm w-48"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="border rounded-lg px-2 py-2 text-sm"
                >
                  <option value="all">전체 과제</option>
                  {assignments.map(assignment => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="border rounded-lg px-2 py-2 text-sm"
              >
                <option value="all">전체 상태</option>
                <option value="제출">제출</option>
                <option value="지각">지각</option>
                <option value="미제출">미제출</option>
              </select>
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              내보내기
            </Button>
          </div>
        </Card>

        {/* 제출물 목록 */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    학생 이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    과제명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제출 일시
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    점수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      제출물이 없습니다
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.studentName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{submission.assignmentTitle}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(submission.submittedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingScoreId === submission.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tempScore}
                              onChange={(e) => setTempScore(e.target.value)}
                              className="w-16 px-2 py-1 border rounded text-sm"
                              min="0"
                              max="100"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleSaveScore(submission.id)}
                              className="px-2 py-1 text-xs"
                            >
                              저장
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="px-2 py-1 text-xs"
                            >
                              취소
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {submission.score !== undefined ? `${submission.score}점` : '-'}
                            </span>
                            <button
                              onClick={() => handleEditScore(submission.id, submission.score)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleViewDetail(submission)}
                        >
                          <FileText className="h-3 w-3" />
                          상세보기
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 제출물 상세 모달 */}
      <SubmissionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        submission={selectedSubmission}
        onSaveScore={handleSaveScoreFromModal}
      />
    </CoursePageLayout>
  )
}

