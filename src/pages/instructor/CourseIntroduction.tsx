import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles, Upload, Tag, Image as ImageIcon, X, Check, Clock, Video, Eye, Info, HelpCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import StableLexicalEditor from '../../components/editor/StableLexicalEditor'
import { safeHtml } from '../../utils/safeHtml'

export default function CourseIntroduction() {

  const [formData, setFormData] = useState({
    thumbnail: "",
    tags: [] as string[],
    category1: "",
    category2: "",
    durationStartDate: "",
    durationEndDate: "",
    description: "",
    videoUrl: "",
    content: "<p>강좌 소개를 작성하세요.</p>"
  })

  const [newTag, setNewTag] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Sync local state to context when form changes
  useEffect(() => {
    console.log("Form data updated:", formData)
    // updateCourseData(formData)
  }, [formData])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('파일 크기는 2MB를 초과할 수 없습니다.')
      return
    }

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        thumbnail: reader.result as string
      }))
      setThumbnailFile(file)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveThumbnail = () => {
    setFormData(prev => ({
      ...prev,
      thumbnail: ""
    }))
    setThumbnailFile(null)
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && formData.tags.length < 10) {
      e.preventDefault()
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Minimalist Top Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link
                to="/instructor/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                강의자 홈
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">강좌 만들기</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/instructor/create">
                <Button
                  variant="outline"
                  className="text-sm px-4 py-2 border-gray-200 hover:border-gray-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  이전
                </Button>
              </Link>
              <Link to="/instructor/create/preview">
                <Button className="text-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm">
                  다음
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Progress Indicator */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2 opacity-60">
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-600">필수 설정</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                2
              </div>
              <span className="text-sm font-medium text-gray-900">강좌 소개</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center space-x-2 opacity-30">
              <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-gray-400">미리 보기</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-base-content mb-3">
                강좌를 소개해주세요
              </h1>
              <p className="text-gray-600">
                수강생들이 강좌의 내용과 목표를 명확히 이해할 수 있도록 작성해주세요
              </p>
            </div>

            {/* Skip Option */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-700 mb-3">
                이 단계는 나중에도 작성할 수 있어요
              </p>
              <Link to="/instructor/create/preview">
                <Button variant="outline" className="text-sm px-6 py-2 border-amber-200 hover:border-amber-300 hover:bg-amber-50">
                  건너뛰고 미리보기
                </Button>
              </Link>
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                강좌 썸네일
              </label>

              {formData.thumbnail ? (
                <div className="relative group">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full aspect-video object-cover rounded-xl border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <button
                      onClick={handleRemoveThumbnail}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>삭제</span>
                    </button>
                  </div>
                  {thumbnailFile && (
                    <div className="mt-2 text-xs text-gray-500">
                      파일명: {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(1)}KB)
                    </div>
                  )}
                </div>
              ) : (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
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

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                태그
              </label>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleAddTag}
                placeholder="태그를 입력하고 Enter를 눌러주세요"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
              <div className="flex items-center space-x-2 mt-3">
                <Tag className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-gray-600">최대 10개까지 추가 가능 ({formData.tags.length}/10)</span>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(index)}
                        className="hover:text-blue-900"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                강좌 카테고리
              </label>
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
                  <option value="기타">기타</option>
                  <option value="웹개발">웹개발</option>
                  <option value="모바일">모바일</option>
                  <option value="데이터">데이터</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                강좌 진행 기간
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={formData.durationStartDate}
                    onChange={(e) => handleInputChange('durationStartDate', e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none [&::-webkit-calendar-picker-indicator]:opacity-100"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={formData.durationEndDate}
                    onChange={(e) => handleInputChange('durationEndDate', e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none [&::-webkit-calendar-picker-indicator]:opacity-100"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>
            </div>

            {/* Study Time Info */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-2xl border border-indigo-100 p-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">학습 소요 시간</h3>
                  <p className="text-xs text-gray-700">
                    총 학습 시간은 교육 과정 편집 페이지에서 업로드한 영상들의 시간을 자동으로 합산하여 계산됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                한 줄 설명
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="강좌를 한 문장으로 요약해주세요"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Video URL */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                소개 영상
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="YouTube 또는 Vimeo 영상 URL을 입력해주세요"
                  className="w-full px-4 py-3 pr-10 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
                <Video className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <label className="text-sm font-semibold text-gray-900">
                  강좌 소개
                </label>
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
              <StableLexicalEditor
                value={formData.content}
                onChange={(html) => handleInputChange('content', html)}
                placeholder="강좌의 목표, 커리큘럼, 대상 수강생 등을 자세히 작성해주세요..."
                className=""
              />
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center space-x-2 text-white">
                  <Eye className="h-5 w-5" />
                  <h3 className="font-semibold">강좌 소개 미리보기</h3>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 space-y-4">
                {/* Thumbnail Preview */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">썸네일 미리보기</p>
                    </div>
                  )}
                </div>

                {/* Tags Preview */}
                {formData.tags.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">태그</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Preview */}
                {(formData.category1 || formData.category2) && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">카테고리</label>
                    <p className="mt-1 text-sm text-gray-900">{formData.category1} &gt; {formData.category2}</p>
                  </div>
                )}

                {/* Duration Preview */}
                {(formData.durationStartDate || formData.durationEndDate) && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">진행 기간</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formData.durationStartDate || '미정'} ~ {formData.durationEndDate || '미정'}
                    </p>
                  </div>
                )}

                {/* Description Preview */}
                {formData.description && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">한 줄 설명</label>
                    <p className="mt-1 text-sm text-gray-900">{formData.description}</p>
                  </div>
                )}

                {/* Video Preview */}
                {formData.videoUrl && getYouTubeVideoId(formData.videoUrl) && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">소개 영상</label>
                    <div className="mt-2 aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(formData.videoUrl)}`}
                        title="YouTube video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}


                {/* Content Preview */}
                {formData.content && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">강좌 소개</label>
                    <div
                      className="mt-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: safeHtml(formData.content) }}
                    />
                  </div>
                )}

                {/* Empty State */}
                {!formData.tags.length && !formData.description && !formData.content && (
                  <div className="py-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <Sparkles className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500">
                      왼쪽 폼을 작성하면<br />여기에 실시간으로 반영됩니다
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl border border-amber-100 p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2 text-amber-600" />
                작성 팁
              </h4>
              <ul className="space-y-2 text-xs text-gray-700">
                <li>• 태그는 강좌의 주요 키워드를 입력하세요</li>
                <li>• 한 줄 설명은 강좌의 핵심 가치를 전달하세요</li>
                <li>• 강좌 소개는 목표, 대상, 커리큘럼을 포함하세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-8 flex items-center justify-between">
          <Link to="/instructor/create">
            <Button variant="outline" className="px-6 py-3 text-sm border-gray-200 hover:border-gray-300">
              <ChevronLeft className="h-4 w-4 mr-2" />
              이전 단계
            </Button>
          </Link>
          <Link to="/instructor/create/preview">
            <Button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
              다음 단계로
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
