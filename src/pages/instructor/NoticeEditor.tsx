import { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, XCircle, File, Image as ImageIcon } from 'lucide-react'
import { createCourseNotice } from '../../core/api/courses'
import { uploadFile } from '../../core/api/upload'

function NoticeEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [attachments, setAttachments] = useState<Array<{ url: string; filename: string; originalname: string; mimetype: string; size: number }>>([])
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 제한 (100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('파일 크기는 100MB를 초과할 수 없습니다.')
      return
    }

    setUploading(true)
    try {
      // 파일 타입 결정
      let fileType: 'pdf' | 'image' | 'video' = 'image'
      if (file.type === 'application/pdf') {
        fileType = 'pdf'
      } else if (file.type.startsWith('video/')) {
        fileType = 'video'
      } else if (file.type.startsWith('image/')) {
        fileType = 'image'
      }

      const result = await uploadFile(file, fileType, 'notice')
      setAttachments(prev => [...prev, result])
    } catch (error) {
      console.error('파일 업로드 실패:', error)
      alert('파일 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      // input 초기화
      e.target.value = ''
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(-1)
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!title.trim() || !content.trim() || !id) {
      return
    }

    try {
      setLoading(true)
      await createCourseNotice(Number(id), {
        title: title.trim(),
        content: content.trim(),
        attachments: attachments.length > 0 ? attachments : null
      })
      alert('등록되었습니다.')
      navigate(-1)
    } catch (error) {
      console.error('공지사항 등록 실패:', error)
      alert('공지사항 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between relative z-10">
          <h1 className="text-xl font-semibold text-gray-900">공지사항 작성</h1>
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
              {loading ? '등록 중...' : '등록'}
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

        {/* 파일 첨부 */}
        <Card className="p-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">첨부파일</label>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                <Upload className="h-4 w-4" />
                <span className="text-sm">파일 선택</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {uploading && <span className="text-sm text-gray-500">업로드 중...</span>}
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {attachment.mimetype.startsWith('image/') ? (
                        <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <File className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                      <span className="text-sm text-gray-700 truncate">{attachment.originalname}</span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({(attachment.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="ml-2 p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default NoticeEditor
