import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { useParams, useNavigate } from 'react-router-dom'
import { getCourseNotices, updateCourseNotice, type CourseNotice } from '../../core/api/courses'

function NoticeEdit() {
  const { id, noticeId } = useParams()
  const navigate = useNavigate()
  const courseId = Number(id) || 1
  const noticeIdNum = Number(noticeId) || 0
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingNotice, setLoadingNotice] = useState(true)

  useEffect(() => {
    const loadNotice = async () => {
      try {
        setLoadingNotice(true)
        const notices = await getCourseNotices(courseId)
        const notice = notices.find(n => n.id === noticeIdNum)
        if (notice) {
          setTitle(notice.title)
          setContent(notice.content)
        } else {
          alert('공지사항을 찾을 수 없습니다.')
          navigate(-1)
        }
      } catch (error) {
        console.error('공지사항 로드 실패:', error)
        alert('공지사항을 불러오는데 실패했습니다.')
        navigate(-1)
      } finally {
        setLoadingNotice(false)
      }
    }
    loadNotice()
  }, [courseId, noticeIdNum, navigate])

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(-1)
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!title.trim() || !content.trim()) {
      return
    }

    try {
      setLoading(true)
      await updateCourseNotice(courseId, noticeIdNum, {
        title: title.trim(),
        content: content.trim(),
      })
      alert('수정되었습니다.')
      navigate(-1)
    } catch (error) {
      console.error('공지사항 수정 실패:', error)
      alert('공지사항 수정에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingNotice) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between relative z-10">
          <h1 className="text-xl font-semibold text-gray-900">공지사항 수정</h1>
          <div className="space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleCancel(e)
              }}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer relative z-20"
            >
              취소
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSubmit(e)
              }}
              disabled={!title.trim() || !content.trim() || loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer relative z-20"
            >
              {loading ? '수정 중...' : '수정'}
            </button>
          </div>
        </div>

        <Card className="p-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">제목</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="공지 제목" />
        </Card>

        <Card className="p-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용을 입력하세요."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={15}
          />
          <p className="text-xs text-gray-500 mt-2">
            {content.length}자
          </p>
        </Card>
      </div>
    </div>
  )
}

export default NoticeEdit





