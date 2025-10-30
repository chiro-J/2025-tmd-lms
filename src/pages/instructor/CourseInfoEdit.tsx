import { useState } from 'react'
import { Save, Upload, X, Video } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StableLexicalEditor from '../../components/editor/StableLexicalEditor'
import { safeHtml } from '../../utils/safeHtml'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

// cspell:words youtu

interface FormDataShape {
  title: string
  thumbnail: string
  category1: string
  category2: string
  durationStartDate: string
  durationEndDate: string
  applicationStartDate: string
  applicationEndDate: string
  videoUrl: string
  content: string
}

export default function CourseInfoEdit() {
  const [formData, setFormData] = useState<FormDataShape>({
    title: '(1회차) 풀스택 과정',
    thumbnail: '',
    category1: '',
    category2: '',
    durationStartDate: '2025-01-10',
    durationEndDate: '2025-12-31',
    applicationStartDate: '2025-01-01',
    applicationEndDate: '2025-01-20',
    videoUrl: '',
    content: '<p>강좌의 목표, 커리큘럼, 대상 수강생 등을 작성해주세요.</p>',
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleInputChange = <T extends keyof FormDataShape>(
    field: T,
    value: FormDataShape[T]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return }
    if (file.size > 2 * 1024 * 1024) { alert('파일 크기는 2MB를 초과할 수 없습니다.'); return }
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, thumbnail: reader.result as string }))
      setThumbnailFile(file)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: '' }))
    setThumbnailFile(null)
  }

  const handleSave = () => {
    // TODO: API 연동
    console.log('강좌 정보 저장:', formData)
    alert('강좌 정보가 저장되었습니다!')
  }

  const rightActions = (
    <>
      <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl">
        <Save className="h-4 w-4 mr-1" /> 저장하기
      </Button>
    </>
  )

  return (
    <CoursePageLayout currentPageTitle="강좌 정보 편집" rightActions={rightActions}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1) 강좌 제목 */}
          <Card>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">강좌 제목 *</label>
              <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="강좌 제목을 입력하세요" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
            </div>
          </Card>

          {/* 2) 썸네일 추가 */}
          <Card>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">썸네일 추가</label>
              {formData.thumbnail ? (
                <div className="relative group">
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full aspect-video object-cover rounded-xl border border-gray-200" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <button onClick={handleRemoveThumbnail} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg flex items-center space-x-2 transition-colors">
                      <X className="h-4 w-4" /> <span>삭제</span>
                    </button>
                  </div>
                  {thumbnailFile && (
                    <div className="mt-2 text-xs text-gray-500">파일명: {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(1)}KB)</div>
                  )}
                </div>
              ) : (
                <label className="block">
                  <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer group">
                    <Upload className="h-12 w-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
                    <p className="text-sm text-gray-700 mb-2">클릭하거나 파일을 드래그하여 업로드</p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• 최대 2MB까지 업로드 가능</p>
                      <p>• 권장 크기: 697×365px</p>
                      <p>• JPG, PNG, GIF 형식 지원</p>
                    </div>
                  </div>
                </label>
              )}
            </div>
          </Card>

          {/* 3) 카테고리(대/소) */}
          <Card>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">강좌 카테고리</label>
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.category1} onChange={(e) => handleInputChange('category1', e.target.value)} className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none">
                  <option value="">카테고리 선택</option>
                  <option value="비즈니스">비즈니스</option>
                  <option value="기술">기술</option>
                  <option value="디자인">디자인</option>
                  <option value="마케팅">마케팅</option>
                </select>
                <select value={formData.category2} onChange={(e) => handleInputChange('category2', e.target.value)} className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none">
                  <option value="">세부 카테고리</option>
                  <option value="웹개발">웹개발</option>
                  <option value="모바일">모바일</option>
                  <option value="데이터">데이터</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
          </Card>

          {/* 4) 진행기간 */}
          <Card>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">강좌 진행 기간 *</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">시작일</label>
                  <input type="date" value={formData.durationStartDate} onChange={(e) => handleInputChange('durationStartDate', e.target.value)} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" style={{ colorScheme: 'light' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">종료일</label>
                  <input type="date" value={formData.durationEndDate} onChange={(e) => handleInputChange('durationEndDate', e.target.value)} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" style={{ colorScheme: 'light' }} />
                </div>
              </div>
            </div>
          </Card>

          {/* 5) 신청기간 */}
          <Card>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">신청 기간</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">시작일</label>
                  <input type="date" value={formData.applicationStartDate} onChange={(e) => handleInputChange('applicationStartDate', e.target.value)} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" style={{ colorScheme: 'light' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">종료일</label>
                  <input type="date" value={formData.applicationEndDate} onChange={(e) => handleInputChange('applicationEndDate', e.target.value)} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" style={{ colorScheme: 'light' }} />
                </div>
              </div>
            </div>
          </Card>

          {/* 6) 소개영상 */}
          <Card>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">소개 영상</label>
              <div className="relative">
                <input type="url" value={formData.videoUrl} onChange={(e) => handleInputChange('videoUrl', e.target.value)} placeholder="YouTube 또는 Vimeo 영상 URL을 입력해주세요" className="w-full px-4 py-3 pr-10 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </Card>

          {/* 7) 강좌 소개 */}
          <Card>
            <div className="p-6">
              <label className="text-sm font-semibold text-gray-900 mb-4">강좌 소개 *</label>
              <StableLexicalEditor value={formData.content} onChange={(html) => handleInputChange('content', html)} placeholder="강좌의 목표, 커리큘럼, 대상 수강생 등을 자세히 작성해주세요..." />
            </div>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-32 h-fit">
          <Card className="overflow-hidden">
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">미리보기</h3>

              {/* 제목 */}
              {formData.title && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">강좌 제목</label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">{formData.title}</p>
                </div>
              )}

              {/* 썸네일 */}
              {formData.thumbnail && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">썸네일</label>
                  <div className="mt-2 aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>
              )}

              {/* 카테고리 */}
              {(formData.category1 || formData.category2) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">카테고리</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.category1 || '미정'} {formData.category2 ? `> ${formData.category2}` : ''}</p>
                </div>
              )}

              {/* 진행기간 */}
              {(formData.durationStartDate || formData.durationEndDate) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">진행 기간</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.durationStartDate || '미정'} ~ {formData.durationEndDate || '미정'}</p>
                </div>
              )}

              {/* 신청기간 */}
              {(formData.applicationStartDate || formData.applicationEndDate) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">신청 기간</label>
                  <p className="mt-1 text-sm text-gray-900">{formData.applicationStartDate || '미정'} ~ {formData.applicationEndDate || '미정'}</p>
                </div>
              )}

              {/* 소개 영상 */}
              {formData.videoUrl && getYouTubeVideoId(formData.videoUrl) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">소개 영상</label>
                  <div className="mt-2 aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(formData.videoUrl)}`}
                      title="YouTube video preview"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* 소개 내용 */}
              {formData.content && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">강좌 소개</label>
                  <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto" dangerouslySetInnerHTML={{ __html: safeHtml(formData.content) }} />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </CoursePageLayout>
  )
}

