import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useParams, useNavigate } from 'react-router-dom'

export default function NoticeEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  return (
    <div className="min-h-screen bg-base-200 text-base-content p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">공지사항 작성</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-xl"
            >
              취소
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
              disabled={!title.trim() || content.trim().length < 5}
              onClick={() => {
                console.log('공지 등록', { courseId: id, title, content })
                navigate(-1)
              }}
            >
              등록
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">제목</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="공지 제목" />
        </Card>

        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용을 입력하세요."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={15}
          />
          <p className="text-xs text-base-content/70 mt-2">
            {content.length}자 / 최소 5자 이상 입력해주세요.
          </p>
        </Card>
      </div>
    </div>
  )
}


