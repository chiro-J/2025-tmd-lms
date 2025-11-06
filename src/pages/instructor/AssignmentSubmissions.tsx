import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import SubmissionDetailModal from '../../components/instructor/SubmissionDetailModal'
import { Search, Filter, Download, FileText, CheckCircle, Clock, XCircle, Edit2 } from 'lucide-react'
import { getAllSubmissionsByCourse, getAssignments, updateSubmissionScore } from '../../core/api/assignments'
import type { AssignmentSubmission, Assignment } from '../../types/assignment'

export default function AssignmentSubmissions() {
  const params = useParams()
  const courseId = Number(params.id) || 1

  const [allSubmissions, setAllSubmissions] = useState<(AssignmentSubmission & { assignmentTitle: string })[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [submissionsData, assignmentsData] = await Promise.all([
          getAllSubmissionsByCourse(courseId),
          getAssignments(courseId)
        ])
        setAllSubmissions(submissionsData)
        setAssignments(assignmentsData)
      } catch (error) {
        console.error('데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [courseId])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | '제출' | '지연' | '미제출'>('all')
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

  const handleSaveScore = async (submissionId: number) => {
    const score = parseInt(tempScore)
    if (isNaN(score) || score < 0) {
      alert('올바른 점수를 입력해주세요.')
      return
    }

    try {
      await updateSubmissionScore(courseId, submissionId, { score })
      // 목록 새로고침
      const submissionsData = await getAllSubmissionsByCourse(courseId)
      setAllSubmissions(submissionsData)
      setEditingScoreId(null)
      setTempScore('')
    } catch (error) {
      console.error('점수 저장 실패:', error)
      alert('점수 저장에 실패했습니다.')
    }
  }

  const handleCancelEdit = () => {
    setEditingScoreId(null)
    setTempScore('')
  }

  const handleViewDetail = (submission: AssignmentSubmission & { assignmentTitle: string }) => {
    setSelectedSubmission(submission)
    setIsDetailModalOpen(true)
  }

  const handleSaveScoreFromModal = async (submissionId: number, score: number, feedback: string) => {
    try {
      await updateSubmissionScore(courseId, submissionId, { score, feedback })
      // 목록 새로고침
      const submissionsData = await getAllSubmissionsByCourse(courseId)
      setAllSubmissions(submissionsData)
      setIsDetailModalOpen(false)
      setSelectedSubmission(null)
    } catch (error) {
      console.error('점수 저장 실패:', error)
      alert('점수 저장에 실패했습니다.')
    }
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
      case '지연':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            지연
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

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '-'
    const date = dateString instanceof Date ? dateString : new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 과제별 통계 계산
  const assignmentStats = useMemo(() => {
    return assignments.map(assignment => {
      const assignmentSubmissions = allSubmissions.filter(s => s.assignmentId === assignment.id)
      return {
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        total: assignmentSubmissions.length,
        submitted: assignmentSubmissions.filter(s => s.status === '제출').length,
        late: assignmentSubmissions.filter(s => s.status === '지연').length,
        pending: assignmentSubmissions.filter(s => s.status === '미제출').length
      }
    })
  }, [assignments, allSubmissions])

  // 전체 통계
  const stats = {
    total: allSubmissions.length,
    submitted: allSubmissions.filter(s => s.status === '제출').length,
    late: allSubmissions.filter(s => s.status === '지연').length,
    pending: allSubmissions.filter(s => s.status === '미제출').length
  }

  // 선택된 과제의 제출물만 필터링
  const selectedAssignmentSubmissions = useMemo(() => {
    if (selectedAssignmentId === 'all') {
      return filteredSubmissions
    }
    return filteredSubmissions.filter(sub => sub.assignmentId === selectedAssignmentId)
  }, [filteredSubmissions, selectedAssignmentId])

  if (loading) {
    return (
      <CoursePageLayout currentPageTitle="제출물 조회">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </CoursePageLayout>
    )
  }

  return (
    <CoursePageLayout currentPageTitle="제출물 조회">
      <div className="space-y-6">
        {/* 전체 통계 카드 */}
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
                <p className="text-sm text-gray-600">지연 제출</p>
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

        {/* 과제별 통계 카드 */}
        {assignmentStats.length > 0 && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">과제별 제출 현황</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {assignmentStats.map((stat) => (
                <div
                  key={stat.assignmentId}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedAssignmentId === stat.assignmentId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAssignmentId(stat.assignmentId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {stat.assignmentTitle}
                    </h4>
                    {selectedAssignmentId === stat.assignmentId && (
                      <span className="text-xs text-blue-600 font-semibold">선택됨</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-600">
                      전체: <span className="font-semibold text-gray-900">{stat.total}</span>
                    </span>
                    <span className="text-green-600">
                      제출: <span className="font-semibold">{stat.submitted}</span>
                    </span>
                    <span className="text-yellow-600">
                      지연: <span className="font-semibold">{stat.late}</span>
                    </span>
                    <span className="text-red-600">
                      미제출: <span className="font-semibold">{stat.pending}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

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
                  className="border rounded-lg px-2 py-2 text-sm min-w-[200px]"
                >
                  <option value="all">전체 과제</option>
                  {assignments.map(assignment => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </option>
                  ))}
                </select>
                {selectedAssignmentId !== 'all' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAssignmentId('all')}
                    className="text-xs"
                  >
                    전체 보기
                  </Button>
                )}
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="border rounded-lg px-2 py-2 text-sm"
              >
                <option value="all">전체 상태</option>
                <option value="제출">제출</option>
                <option value="지연">지연</option>
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
          {selectedAssignmentId !== 'all' && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">
                    {assignments.find(a => a.id === selectedAssignmentId)?.title}
                  </h3>
                  <p className="text-xs text-blue-700 mt-1">
                    {selectedAssignmentSubmissions.length}개의 제출물
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAssignmentId('all')}
                  className="text-xs"
                >
                  전체 보기
                </Button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    학생 이름
                  </th>
                  {selectedAssignmentId === 'all' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      과제명
                    </th>
                  )}
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
                {selectedAssignmentSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={selectedAssignmentId === 'all' ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                      {selectedAssignmentId === 'all'
                        ? '제출물이 없습니다'
                        : '선택한 과제의 제출물이 없습니다'}
                    </td>
                  </tr>
                ) : (
                  selectedAssignmentSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.studentName}
                        </div>
                      </td>
                      {selectedAssignmentId === 'all' && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{submission.assignmentTitle}</div>
                        </td>
                      )}
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

