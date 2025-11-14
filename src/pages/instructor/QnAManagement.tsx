import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare, Search, Lock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import { getCourseQnAs, type CourseQnA } from '../../core/api/courses'

export default function QnAManagement() {
  const { id } = useParams()
  const navigate = useNavigate()
  const courseId = Number(id) || 1
  const [qnaList, setQnaList] = useState<CourseQnA[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const loadQnAs = async () => {
      try {
        setLoading(true)
        const data = await getCourseQnAs(courseId)
        setQnaList(data)
      } catch (error) {
        console.error('QnA 목록 로드 실패:', error)
        setQnaList([])
      } finally {
        setLoading(false)
      }
    }
    loadQnAs()
  }, [courseId])

  const filteredQnA = qnaList.filter(qna =>
    (qna.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    qna.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (qna.user.name || qna.user.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredQnA.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedQnA = filteredQnA.slice(startIndex, endIndex)

  // 검색어 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const getUserName = (qnaUser: { name?: string; username?: string }) => {
    return qnaUser.name || qnaUser.username || '알 수 없음'
  }

  const rightActions = (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
        <Input
          type="text"
          placeholder="질문 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
        />
      </div>
    </>
  )

  return (
    <CoursePageLayout
      currentPageTitle="Q&A 관리"
      rightActions={rightActions}
    >
      {/* Info Message */}
      <div className="mb-4">
        <p className="text-sm text-base-content/70">
          학생들의 질문을 확인하고 답변할 수 있습니다. 빠른 답변으로 학생들의 학습을 도와주세요.
        </p>
      </div>

      {/* QnA 게시판 테이블 */}
      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="text-base-content/70">로딩 중...</div>
          </div>
        </Card>
      ) : filteredQnA.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-16 w-16 text-base-content/30 mb-4" />
            <h3 className="text-lg font-medium text-base-content mb-2">
              등록된 질문이 없습니다
            </h3>
            <p className="text-sm text-base-content/70">
              학생들이 질문을 등록하면 여기에 표시됩니다
            </p>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-16">번호</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">제목</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">작성자</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">작성일</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedQnA.map((qna, index) => (
                  <tr
                    key={qna.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      navigate(`/instructor/course/${courseId}/qna/${qna.id}`)
                    }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {filteredQnA.length - (startIndex + index)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        {!qna.isPublic && (
                          <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        )}
                        <span className="text-gray-900 font-medium truncate">
                          {qna.title || '제목 없음'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {getUserName(qna.user)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(qna.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                {startIndex + 1} - {Math.min(endIndex, filteredQnA.length)} / {filteredQnA.length}개
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(page)}
                          className={`rounded-xl ${currentPage === page ? 'bg-primary text-primary-content' : ''}`}
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 3 || page === currentPage + 3) {
                      return <span key={page} className="px-2">...</span>
                    }
                    return null
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

    </CoursePageLayout>
  )
}
