import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Upload, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useCourseCreation } from '../../contexts/CourseCreationContext'

export default function CreateCourse() {
  const { courseData, updateCourseData } = useCourseCreation()

  const [formData, setFormData] = useState({
    title: courseData.title || '',
    thumbnail: '',
    durationStartDate: '',
    durationEndDate: ''
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  // Sync local state to context when form changes
  useEffect(() => {
    updateCourseData({
      title: formData.title
    })
  }, [formData, updateCourseData])

  const handleInputChange = (field: string, value: string) => {
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
      thumbnail: ''
    }))
    setThumbnailFile(null)
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
                <span className="text-sm font-semibold text-blue-600">강좌 만들기</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="text-sm px-4 py-2 border-gray-200 hover:border-gray-300"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                이전
              </Button>
              <Link to="/instructor/create/introduction">
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                1
              </div>
              <span className="text-sm font-medium text-gray-900">필수 설정</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center space-x-2 opacity-40">
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm text-gray-500">강좌 소개</span>
            </div>
          </div>
        </div>
      </div>

      {/* Single Column Layout */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-base-content mb-3">
              강좌의 기본 정보를 설정해주세요
            </h1>
            <p className="text-gray-600">
              수강생들이 강좌를 쉽게 이해할 수 있도록 명확하게 작성해주세요
            </p>
          </div>

          {/* Title Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              강좌 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="예: 풀스택 개발자 양성과정"
              className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              수업 내용을 명확히 알 수 있는 제목을 권장합니다
            </p>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              썸네일 추가
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

          {/* Duration */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              강좌 진행 기간 <span className="text-red-500">*</span>
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
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
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
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  style={{ colorScheme: 'light' }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-8 text-center">
            <Link to="/instructor/create/introduction">
              <Button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                다음 단계로
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
