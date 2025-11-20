import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Search, Lock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { getCourses, getCourseQnAs, type CourseQnA } from '../../core/api/courses'

function UnansweredQnAs() {
  const navigate = useNavigate()
  const [allQnAs, setAllQnAs] = useState<Array<CourseQnA & { courseId: number; courseTitle: string }>>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const loadUnansweredQnAs = async () => {
      try {
        setLoading(true)
        const courses = await getCourses()
        const qnaList: Array<CourseQnA & { courseId: number; courseTitle: string }> = []

        // 모든 강좌의 미답변 QnA 가져오기
        for (const course of courses) {
          try {
            const qnas = await getCourseQnAs(Number(course.id))
            // 미답변 QnA만 필터링 (answers가 없거나 빈 배열인 경우)
            const unansweredQnas = qnas.filter(qna => !qna.answers || qna.answers.length === 0)
            unansweredQnas.forEach(qna => {
              qnaList.push({
                ...qna,
                courseId: Number(course.id),
                courseTitle: course.title
              })
            })
          } catch (error) {
            console.error(`강좌 ${course.id} QnA 로드 실패:`, error)
          }
        }

        // 최신순으로 정렬
        qnaList.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        setAllQnAs(qnaList)
      } catch (error) {
        console.error('미답변 QnA 목록 로드 실패:', error)
        setAllQnAs([])
      } finally {
        setLoading(false)
      }
    }
    loadUnansweredQnAs()
  }, [])

  const filteredQnA = allQnAs.filter(qna =>
    (qna.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    qna.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (qna.user.name || qna.user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    qna.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="container-page py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/instructor/dashboard')}
                className="rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로가기
              </Button>
              <h1 className="text-2xl font-bold text-base-content">미답변 QnA</h1>
            </div>
          </div>

          {/* Search */}
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
              <Input
                type="text"
                placeholder="질문, 작성자, 강의명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
          </Card>

          {/* QnA List */}
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
                  미답변 QnA가 없습니다
                </h3>
                <p className="text-sm text-base-content/70">
                  {searchQuery ? '검색 결과가 없습니다' : '모든 질문에 답변이 완료되었습니다'}
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-48">강의명</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">작성자</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">작성일</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedQnA.map((qna, index) => (
                      <tr
                        key={`${qna.courseId}-${qna.id}`}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          navigate(`/instructor/course/${qna.courseId}/qna/${qna.id}`)
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
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                              {qna.courseTitle}
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
                              variant={currentPage === page ? 'primary' : 'outline'}
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
        </div>
      </main>
    </div>
  )
}

export default UnansweredQnAs




