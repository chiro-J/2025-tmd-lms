import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Upload, FileText, Download, Trash2, Eye } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import {
  getCourseResources,
  createCourseResource,
  deleteCourseResource,
  updateCourseResourceDownloadAllowed,
  type CourseResource
} from '../../core/api/courses'

export default function ResourceManagement() {
  const { id } = useParams()
  const courseId = Number(id) || 1
  const [resources, setResources] = useState<CourseResource[]>([])
  const [loading, setLoading] = useState(true)

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true)
        const data = await getCourseResources(courseId)
        setResources(data)
      } catch (error) {
        console.error('강의 자료 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadResources()
  }, [courseId])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
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
      {loading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="text-base-content/70">로딩 중...</div>
          </div>
        </Card>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {resources.map((resource) => (
              <Card key={resource.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-base-content">{resource.title}</h3>
                      <p className="text-sm text-base-content/70">
                        {resource.fileSize ? `${(resource.fileSize / 1024 / 1024).toFixed(2)} MB` : '-'} • {new Date(resource.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {resource.fileUrl && (
                      <Button
                        variant="outline"
                        className="text-base-content/70 rounded-xl"
                        onClick={() => window.open(resource.fileUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        미리보기
                      </Button>
                    )}
                    {resource.linkUrl && (
                      <Button
                        variant="outline"
                        className="text-base-content/70 rounded-xl"
                        onClick={() => window.open(resource.linkUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        링크 열기
                      </Button>
                    )}
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
                        onClick={async (e) => {
                          e.preventDefault()
                          try {
                            await updateCourseResourceDownloadAllowed(
                              courseId,
                              resource.id,
                              !resource.downloadAllowed
                            )
                            setResources(prev =>
                              prev.map(r =>
                                r.id === resource.id
                                  ? { ...r, downloadAllowed: !r.downloadAllowed }
                                  : r
                              )
                            )
                          } catch (error) {
                            console.error('다운로드 허용/금지 수정 실패:', error)
                            alert('수정에 실패했습니다.')
                          }
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloadAllowed ? '다운로드 허용' : '다운로드 금지'}
                      </Button>
                    </label>
                    <Button
                      variant="outline"
                      className="text-error rounded-xl"
                      onClick={async () => {
                        if (!confirm('정말 삭제하시겠습니까?')) return
                        try {
                          await deleteCourseResource(courseId, resource.id)
                          setResources(prev => prev.filter(r => r.id !== resource.id))
                        } catch (error) {
                          console.error('강의 자료 삭제 실패:', error)
                          alert('삭제에 실패했습니다.')
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
          ))}
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
            <h3 className="text-lg font-semibold text-base-content mb-6">강의 자료 업로드</h3>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="자료 제목을 입력하세요"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-base-content mb-2">파일 선택</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-base-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  >
                    <Upload className="h-8 w-8 text-base-content/50 mb-2" />
                    <span className="text-sm font-medium text-base-content">
                      {selectedFile ? selectedFile.name : '클릭하여 파일 선택'}
                    </span>
                    <span className="text-xs text-base-content/50 mt-1">
                      모든 파일 형식 지원
                    </span>
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-2 p-3 bg-base-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-base-content">{selectedFile.name}</span>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-xs text-error hover:text-error/80"
                      >
                        제거
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-base-300">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUploadModal(false)
                    setSelectedFile(null)
                    setNewTitle('')
                  }}
                  className="rounded-xl"
                >
                  취소
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl"
                  onClick={async () => {
                    try {
                      setUploading(true)
                      const newResource = await createCourseResource(courseId, {
                        title: newTitle || selectedFile?.name || '자료',
                        type: 'pdf', // 기본값으로 설정 (백엔드에서 처리)
                        file: selectedFile || undefined,
                      })
                      setResources([newResource, ...resources])
                      alert('강의 자료가 등록되었습니다.')
                      // reset
                      setShowUploadModal(false)
                      setSelectedFile(null)
                      setNewTitle('')
                    } catch (error) {
                      console.error('강의 자료 업로드 실패:', error)
                      alert('업로드에 실패했습니다.')
                    } finally {
                      setUploading(false)
                    }
                  }}
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? '업로드 중...' : '업로드'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </CoursePageLayout>
  )
}
