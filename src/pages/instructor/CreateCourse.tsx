import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles, Info, Check, Eye } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useCourseCreation } from '../../contexts/CourseCreationContext'

export default function CreateCourse() {
  const { courseData, updateCourseData } = useCourseCreation()

  const [formData, setFormData] = useState({
    title: courseData.title,
    isPublic: courseData.isPublic,
    isSkeleton: false,
    difficulty: courseData.difficulty,
    hasApplicationPeriod: !!(courseData.applicationStartDate || courseData.applicationEndDate),
    applicationStartDate: courseData.applicationStartDate,
    applicationEndDate: courseData.applicationEndDate
  })

  // Sync local state to context when form changes
  useEffect(() => {
    updateCourseData({
      title: formData.title,
      isPublic: formData.isPublic,
      difficulty: formData.difficulty,
      applicationStartDate: formData.applicationStartDate,
      applicationEndDate: formData.applicationEndDate
    })
  }, [formData])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const difficultyOptions = [
    {
      value: '쉬움',
      label: '쉬움',
      description: '초보자도 쉽게 따라할 수 있어요',
      selectedClass: 'border-emerald-500 bg-emerald-50/50',
      checkClass: 'text-emerald-600'
    },
    {
      value: '보통',
      label: '보통',
      description: '기본 지식이 필요해요',
      selectedClass: 'border-blue-500 bg-blue-50/50',
      checkClass: 'text-blue-600'
    },
    {
      value: '어려움',
      label: '어려움',
      description: '전문적인 내용을 다뤄요',
      selectedClass: 'border-purple-500 bg-purple-50/50',
      checkClass: 'text-purple-600'
    }
  ]

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
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
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

            {/* Visibility */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                공개 설정 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('isPublic', true)}
                  className={`relative px-5 py-4 rounded-xl border-2 transition-all ${
                    formData.isPublic
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {formData.isPublic && (
                    <Check className="absolute top-3 right-3 h-5 w-5 text-blue-600" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-gray-900">공개</div>
                    <div className="text-xs text-gray-500 mt-1">누구나 검색 가능</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('isPublic', false)}
                  className={`relative px-5 py-4 rounded-xl border-2 transition-all ${
                    !formData.isPublic
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {!formData.isPublic && (
                    <Check className="absolute top-3 right-3 h-5 w-5 text-blue-600" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-gray-900">비공개</div>
                    <div className="text-xs text-gray-500 mt-1">초대받은 사람만</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                난이도 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('difficulty', option.value)}
                    className={`relative px-4 py-4 rounded-xl border-2 transition-all ${
                      formData.difficulty === option.value
                        ? option.selectedClass
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {formData.difficulty === option.value && (
                      <Check className={`absolute top-2 right-2 h-4 w-4 ${option.checkClass}`} />
                    )}
                    <div className="text-center">
                      <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Skeleton Course Toggle */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    뼈대 강좌로 설정
                  </label>
                  <p className="text-xs text-gray-600">
                    다른 강의자가 이 강좌를 템플릿으로 사용할 수 있어요
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('isSkeleton', !formData.isSkeleton)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    formData.isSkeleton ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                      formData.isSkeleton ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {formData.isSkeleton && (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>• 채널의 모든 강의자가 이 강좌를 기반으로 새 강좌를 만들 수 있어요</p>
                      <p>• 뼈대 강좌는 검색 결과에 표시되지 않아요</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Application Period */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    신청 기간 설정
                  </label>
                  <p className="text-xs text-gray-600">
                    특정 기간에만 수강 신청을 받을 수 있어요
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('hasApplicationPeriod', !formData.hasApplicationPeriod)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    formData.hasApplicationPeriod ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                      formData.hasApplicationPeriod ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {formData.hasApplicationPeriod && (
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      시작일
                    </label>
                    <input
                      type="date"
                      value={formData.applicationStartDate}
                      onChange={(e) => handleInputChange('applicationStartDate', e.target.value)}
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
                      value={formData.applicationEndDate}
                      onChange={(e) => handleInputChange('applicationEndDate', e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center space-x-2 text-white">
                  <Eye className="h-5 w-5" />
                  <h3 className="font-semibold">실시간 미리보기</h3>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 space-y-4">
                {/* Title Preview */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">강좌 제목</label>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {formData.title || '제목을 입력해주세요'}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    formData.isPublic
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {formData.isPublic ? '공개 강좌' : '비공개 강좌'}
                  </span>

                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    formData.difficulty === '쉬움'
                      ? 'bg-emerald-100 text-emerald-700'
                      : formData.difficulty === '보통'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    난이도: {formData.difficulty}
                  </span>

                  {formData.isSkeleton && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      뼈대 강좌
                    </span>
                  )}
                </div>

                {/* Application Period */}
                {formData.hasApplicationPeriod && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-xs font-medium text-blue-900 mb-2">신청 기간</p>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>시작: {formData.applicationStartDate || '선택 안함'}</p>
                      <p>종료: {formData.applicationEndDate || '선택 안함'}</p>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!formData.title && !formData.hasApplicationPeriod && (
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
                <li>• 제목은 강좌의 핵심 내용이 드러나도록 작성하세요</li>
                <li>• 공개 강좌는 모든 사용자가 검색할 수 있습니다</li>
                <li>• 난이도는 수강생의 사전 지식 수준을 고려하세요</li>
              </ul>
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
  )
}