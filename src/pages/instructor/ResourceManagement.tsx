import { useState } from 'react'
import { Plus, Upload, FileText, Image, Download, Trash2, Eye } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

interface Resource {
  id: number
  title: string
  type: 'pdf' | 'slide' | 'code' | 'link'
  fileUrl?: string
  linkUrl?: string
  code?: string
  uploadedAt: string
  size: string
  downloadAllowed: boolean
}

export default function ResourceManagement() {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      title: '강의 자료 예시.pdf',
      type: 'pdf',
      fileUrl: '/resources/example.pdf',
      uploadedAt: '2025-01-15',
      size: '2.3 MB',
      downloadAllowed: true
    }
  ])

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newType, setNewType] = useState<Resource['type']>('pdf')
  const [newTitle, setNewTitle] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newCode, setNewCode] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // TODO: 실제 업로드 구현
    }
  }

  const getFileIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf':
        return FileText
      case 'slide':
        return Image
      case 'code':
        return FileText
      case 'link':
        return FileText
      default:
        return FileText
    }
  }

  const rightActions = (
    <>
      <Button
        onClick={() => setShowUploadModal(true)}
        className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
      >
        <Plus className="h-4 w-4 mr-1" />
        강의 자료 추가
      </Button>
    </>
  )

  return (
    <CoursePageLayout
      currentPageTitle="강의 자료 관리"
      rightActions={rightActions}
    >
      {/* Info Message */}
      <div className="mb-4">
        <p className="text-sm text-base-content/70">
          강의 자료를 업로드하고 관리할 수 있습니다. 학생들은 이 자료들을 다운로드하여 학습에 활용할 수 있습니다.
        </p>
      </div>

      {/* Resources List */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {resources.map((resource) => {
            const Icon = getFileIcon(resource.type)
            return (
              <Card key={resource.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base-content">{resource.title}</h3>
                      <p className="text-sm text-base-content/70">
                        {resource.size} • {resource.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="text-base-content/70 rounded-xl">
                      <Eye className="h-4 w-4 mr-1" />
                      미리보기
                    </Button>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={resource.downloadAllowed}
                        onChange={(e) => {
                          setResources(prev =>
                            prev.map(r =>
                              r.id === resource.id
                                ? { ...r, downloadAllowed: e.target.checked }
                                : r
                            )
                          )
                        }}
                        className="sr-only"
                      />
                      <Button
                        variant="outline"
                        className={`rounded-xl ${
                          resource.downloadAllowed
                            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                            : 'text-base-content/70'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          setResources(prev =>
                            prev.map(r =>
                              r.id === resource.id
                                ? { ...r, downloadAllowed: !r.downloadAllowed }
                                : r
                            )
                          )
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloadAllowed ? '다운로드 허용' : '다운로드 금지'}
                      </Button>
                    </label>
                    <Button variant="outline" className="text-error rounded-xl">
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <div className="flex flex-col items-center justify-center py-12">
            <Upload className="h-16 w-16 text-base-content/30 mb-4" />
            <h3 className="text-lg font-medium text-base-content mb-2">
              등록된 강의 자료가 없습니다
            </h3>
            <p className="text-sm text-base-content/70 mb-4">
              첫 번째 강의 자료를 업로드해보세요
            </p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
            >
              <Plus className="h-4 w-4 mr-1" />
              강의 자료 추가
            </Button>
          </div>
        </Card>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6">
            <h3 className="text-lg font-semibold text-base-content mb-4">강의 자료 업로드</h3>
            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">자료 유형</label>
                <div className="flex flex-wrap gap-2">
                  {(['pdf','slide','code','link'] as Resource['type'][]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`px-3 py-1 rounded-lg text-sm border ${newType === t ? 'bg-primary text-white border-primary' : 'border-base-300 text-base-content/80 hover:bg-base-200'}`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 border border-base-300 rounded-lg"
                  placeholder="자료 제목을 입력하세요"
                />
              </div>

              {/* By type inputs */}
              {newType === 'pdf' && (
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">PDF 파일</label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full p-3 border border-base-300 rounded-lg"
                    accept=".pdf"
                  />
                </div>
              )}
              {newType === 'slide' && (
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">슬라이드 이미지</label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="w-full p-3 border border-base-300 rounded-lg"
                    accept=".jpg,.jpeg,.png,.webp"
                  />
                </div>
              )}
              {newType === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">링크 URL</label>
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full p-3 border border-base-300 rounded-lg"
                    placeholder="https://example.com/resource"
                  />
                </div>
              )}
              {newType === 'code' && (
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">코드 스니펫</label>
                  <textarea
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full p-3 border border-base-300 rounded-lg font-mono text-sm"
                    rows={6}
                    placeholder={`// 예시\nconst greet = (name) => console.log('Hello', name);`}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl"
                >
                  취소
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
                  onClick={() => {
                    const now = new Date()
                    const item: Resource = {
                      id: Math.max(0, ...resources.map(r => r.id)) + 1,
                      title: newTitle || (selectedFile?.name || (newType === 'link' ? '링크 자료' : newType === 'code' ? '코드 자료' : '자료')),
                      type: newType,
                      fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
                      linkUrl: newType === 'link' ? newLinkUrl : undefined,
                      code: newType === 'code' ? newCode : undefined,
                      uploadedAt: now.toISOString().slice(0,10),
                      size: selectedFile ? `${(selectedFile.size/1024/1024).toFixed(2)} MB` : '-',
                      downloadAllowed: true
                    }
                    setResources([item, ...resources])
                    // reset
                    setShowUploadModal(false)
                    setSelectedFile(null)
                    setNewTitle('')
                    setNewLinkUrl('')
                    setNewCode('')
                    setNewType('pdf')
                  }}
                  disabled={
                    (newType === 'pdf' && !selectedFile) ||
                    (newType === 'slide' && !selectedFile) ||
                    (newType === 'link' && !newLinkUrl) ||
                    (newType === 'code' && !newCode)
                  }
                >
                  추가
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </CoursePageLayout>
  )
}
