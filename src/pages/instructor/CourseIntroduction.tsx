import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Upload, X, Video, HelpCircle, Check } from 'lucide-react'
import Button from '../../components/ui/Button'
import StableLexicalEditor from '../../components/editor/StableLexicalEditor'
import { useCourseCreation } from '../../contexts/CourseCreationContext'
import { createCourse } from '../../core/api/courses'

export default function CourseIntroduction() {
  const { courseData, resetCourseData } = useCourseCreation()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: courseData.title || "",
    thumbnail: courseData.thumbnail || "",
    category1: courseData.category1 || "",
    category2: courseData.category2 || "",
    durationStartDate: courseData.durationStartDate || "",
    durationEndDate: courseData.durationEndDate || "",
    applicationStartDate: courseData.applicationStartDate || "",
    applicationEndDate: courseData.applicationEndDate || "",
    videoUrl: courseData.videoUrl || "",
    content: courseData.content || "<p>강좌 소개를 작성하세요.</p>",
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const handleCreateCourse = async () => {
    if (!formData.title.trim()) {
      alert('강좌 제목을 입력해주세요.')
      return
    }

    setSaving(true)
    try {
      // CourseCreationData를 DB Course 타입으로 변환
      const courseDataToSave = {
        title: formData.title,
        thumbnail: formData.thumbnail || undefined,
        videoUrl: formData.videoUrl || undefined,
        content: formData.content || undefined,
        instructor: '김강사', // TODO: 실제 로그인한 강사 정보 사용
        status: '공개' as const, // TODO: isPublic 필드 사용
        progress: 0,
      }

      const createdCourse = await createCourse(courseDataToSave)

      // 컨텍스트 초기화
      resetCourseData()

      // 생성된 강좌의 홈 페이지로 리다이렉트
      navigate(`/instructor/course/${createdCourse.id}/home`)
    } catch (error) {
      console.error('강좌 생성 실패:', error)
      alert('강좌 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
    setFormData(prev => ({ ...prev, thumbnail: "" }))
    setThumbnailFile(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/instructor/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">강의자 홈</Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">강의 만들기</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Column Layout */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {/* 안내 */}
          <div>
            <h1 className="text-2xl font-bold text-base-content mb-3">강의를 생성해주세요</h1>
            <p className="text-gray-600">강의의 기본 정보를 입력하고 소개 내용을 작성해주세요</p>
          </div>

          {/* 1) 강좌 제목 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">강좌 제목 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="예: 풀스택 개발자 양성과정"
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">수업 내용을 명확히 알 수 있는 제목을 권장합니다</p>
          </div>

          {/* 2) 썸네일 추가 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">강좌 썸네일</label>
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

          {/* 3) 카테고리(대/소) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-4">강좌 카테고리</label>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.category1}
                onChange={(e) => handleInputChange('category1', e.target.value)}
                className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              >
                <option value="">카테고리 선택</option>
                <option value="비즈니스">비즈니스</option>
                <option value="기술">기술</option>
                <option value="디자인">디자인</option>
                <option value="마케팅">마케팅</option>
              </select>
              <select
                value={formData.category2}
                onChange={(e) => handleInputChange('category2', e.target.value)}
                className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              >
                <option value="">세부 카테고리</option>
                <option value="웹개발">웹개발</option>
                <option value="모바일">모바일</option>
                <option value="데이터">데이터</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          {/* 4) 진행기간 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-4">강좌 진행 기간</label>
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

          {/* 5) 신청기간 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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

          {/* 6) 소개영상 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">소개 영상</label>
            <div className="relative">
              <input type="url" value={formData.videoUrl} onChange={(e) => handleInputChange('videoUrl', e.target.value)} placeholder="YouTube 또는 Vimeo 영상 URL을 입력해주세요" className="w-full px-4 py-3 pr-10 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
              <Video className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 7) 강좌 소개 (Rich Text) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <label className="text-sm font-semibold text-gray-900">강좌 소개</label>
              <div className="relative group">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                    Rich Text Editor로 작성됩니다
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>
            <StableLexicalEditor value={formData.content} onChange={(html) => handleInputChange('content', html)} placeholder="강좌의 목표, 커리큘럼, 대상 수강생 등을 자세히 작성해주세요..." />
          </div>

          {/* Bottom Action */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleCreateCourse}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? '저장 중...' : '강좌 생성 완료'}
              <Check className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
