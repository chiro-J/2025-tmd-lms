import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { getCourseQnAs, createCourseQnAAnswer, type CourseQnA } from '../../core/api/courses'
import { useAuth } from '../../contexts/AuthContext'

function QnADetail() {
  const { id, qnaId } = useParams()
  const navigate = useNavigate()
  const courseId = Number(id) || 1
  const qnaIdNum = Number(qnaId) || 0
  const { user } = useAuth()
  const [qna, setQna] = useState<CourseQnA | null>(null)
  const [loading, setLoading] = useState(true)
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadQnA = async () => {
      try {
        setLoading(true)
        const data = await getCourseQnAs(courseId)
        const foundQnA = data.find(q => q.id === qnaIdNum)
        if (!foundQnA) {
          alert('QnA를 찾을 수 없습니다.')
          navigate(-1)
          return
        }
        // 비공개 QnA 접근 제어: 작성자 본인 또는 강의자만 조회 가능
        if (!foundQnA.isPublic) {
          const isAuthor = foundQnA.userId === user?.id
          const isInstructor = user?.role === 'instructor' || user?.role === 'admin' || user?.role === 'sub-admin'
          if (!isAuthor && !isInstructor) {
            alert('비공개 질문은 작성자와 강의자만 조회할 수 있습니다.')
            navigate(-1)
            return
          }
        }
        setQna(foundQnA)
      } catch (error) {
        console.error('QnA 로드 실패:', error)
        alert('QnA를 불러오는데 실패했습니다.')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    loadQnA()
  }, [courseId, qnaIdNum, navigate, user])

  const handleAnswerSubmit = async () => {
    if (!qna || !answerText.trim() || !user?.id) return

    try {
      setSubmitting(true)
      await createCourseQnAAnswer(courseId, qna.id, typeof user.id === 'number' ? user.id : Number(user.id), answerText)
      // QnA 목록 새로고침
      const data = await getCourseQnAs(courseId)
      const updatedQnA = data.find(q => q.id === qnaIdNum)
      if (updatedQnA) {
        setQna(updatedQnA)
      }
      setAnswerText('')
      alert('댓글이 등록되었습니다.')
    } catch (error) {
      console.error('댓글 등록 실패:', error)
      alert('댓글 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const getUserName = (qnaUser: { name?: string; username?: string }) => {
    return qnaUser.name || qnaUser.username || '알 수 없음'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content">
        <main className="container-page py-8">
          <Card>
            <div className="flex items-center justify-center py-12">
              <div className="text-base-content/70">로딩 중...</div>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  if (!qna) {
    return (
      <div className="min-h-screen bg-base-200 text-base-content">
        <main className="container-page py-8">
          <Card>
            <div className="flex items-center justify-center py-12">
              <div className="text-base-content/70">QnA를 찾을 수 없습니다.</div>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="container-page py-8">
        <div className="space-y-6">
          {/* 뒤로가기 버튼 */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>

          {/* 질문 본문 */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                {!qna.isPublic && (
                  <Lock className="h-5 w-5 text-gray-500" />
                )}
                <h1 className="text-3xl font-bold text-gray-900">
                  {qna.title || '제목 없음'}
                </h1>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 pb-4 border-b border-gray-200">
                <span>작성자: {getUserName(qna.user)}</span>
                <span>작성일: {new Date(qna.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              <div className="pt-4">
                <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {qna.question}
                </p>
              </div>
            </div>
          </Card>

          {/* 댓글 목록 - 티켓 형식으로 시간순 정렬 */}
          {(() => {
            // 모든 댓글과 답글을 하나의 배열로 평탄화
            const allComments: Array<{ id: number; content: string; user: { name?: string; username?: string }; createdAt: string; isReply: boolean; parentId?: number }> = []

            if (qna.answers) {
              qna.answers.forEach((answer) => {
                // 댓글 추가
                allComments.push({
                  id: answer.id,
                  content: answer.content,
                  user: answer.user,
                  createdAt: answer.createdAt,
                  isReply: false
                })

                // 답글 추가
                if (answer.replies && answer.replies.length > 0) {
                  answer.replies.forEach((reply) => {
                    allComments.push({
                      id: reply.id,
                      content: reply.content,
                      user: reply.user,
                      createdAt: reply.createdAt,
                      isReply: true,
                      parentId: answer.id
                    })
                  })
                }
              })
            }

            // 시간순으로 정렬
            allComments.sort((a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )

            return (
              <div className="space-y-4">
                {allComments.length > 0 && (
                  <h2 className="text-xl font-semibold text-gray-900">답변 기록 ({allComments.length})</h2>
                )}
                {allComments.map((comment) => (
                  <Card
                    key={comment.id}
                    className="p-6 rounded-2xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-gray-300"
                  >
                    <div className="space-y-4">
                      <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 pt-4 border-t border-gray-200">
                        <span className="font-medium">{getUserName(comment.user)}</span>
                        <span>{new Date(comment.createdAt).toLocaleString('ko-KR')}</span>
                        {comment.isReply && (
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">답글</span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          })()}

          {/* 추가 질문 작성 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">추가 질문 작성</h2>
            <div className="space-y-4">
              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={8}
                placeholder="댓글을 입력하세요..."
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAnswerSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8"
                  disabled={submitting || !answerText.trim()}
                >
                  {submitting ? '등록 중...' : '질문 등록'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default QnADetail

