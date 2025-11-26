import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Upload, X, Video, Edit3, ChevronDown } from 'lucide-react'
import { normalizeThumbnailUrl } from '../../utils/thumbnail'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StableLexicalEditor from '../../components/editor/StableLexicalEditor'
import { safeHtml } from '../../utils/safeHtml'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import { getCourse, updateCourse } from '../../core/api/courses'
import { useAuth } from '../../contexts/AuthContext'
import ThumbnailCropModal from '../../components/common/ThumbnailCropModal'

// cspell:words youtu

interface FormDataShape {
  title: string
  thumbnail: string
  category1: string
  category2: string
  durationStartDate: string
  durationEndDate: string
  videoUrl: string
  content: string
  isPublic: boolean
  // 새로운 필드들
  lecturePeriodStart: string // 강의 시작일
  lecturePeriodEnd: string // 강의 종료일
  educationSchedule: string // 교육시간
  instructors: string // 강사 이름 (자동 또는 수동 입력)
}

export default function CourseInfoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const courseId = Number(id) || 1
  // 강사 정보는 현재 로그인한 사용자 정보 사용 (기본값)
  const defaultInstructorName = user?.name || user?.email || '강의자'

  // 강사 입력 모드 상태 (자동/수동)
  const [isInstructorManual, setIsInstructorManual] = useState(false)

  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<FormDataShape>({
    title: '',
    thumbnail: '',
    category1: '',
    category2: '',
    durationStartDate: '2025-01-10',
    durationEndDate: '2025-12-31',
    videoUrl: '',
    content: '',
    isPublic: true,
    lecturePeriodStart: '',
    lecturePeriodEnd: '',
    educationSchedule: '',
    instructors: defaultInstructorName, // 강사 이름 (기본값: 현재 로그인한 사용자)
  })

  const [originalFormData, setOriginalFormData] = useState<FormDataShape | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [previewImageSrc, setPreviewImageSrc] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // DB에서 강좌 정보 로드
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        const course = await getCourse(courseId)
        if (course) {
          // status를 isPublic으로 변환 ('공개'면 true)
          const isPublic = course.status === '공개'
          const loadedData = {
            title: course.title || '',
            thumbnail: course.thumbnail || '',
            category1: '', // 나중에 구현
            category2: '', // 나중에 구현
            durationStartDate: '2025-01-10', // 나중에 구현
            durationEndDate: '2025-12-31', // 나중에 구현
            videoUrl: course.videoUrl || '',
            content: course.content || '<p>강좌의 목표, 커리큘럼, 대상 수강생 등을 작성해주세요.</p>',
            isPublic,
            lecturePeriodStart: (course as any).lecturePeriodStart ? new Date((course as any).lecturePeriodStart).toISOString().split('T')[0] : '',
            lecturePeriodEnd: (course as any).lecturePeriodEnd ? new Date((course as any).lecturePeriodEnd).toISOString().split('T')[0] : '',
            educationSchedule: (course as any).educationSchedule || '',
            instructors: (course as any).instructors || defaultInstructorName,
          }

          // DB에 저장된 강사 이름이 기본값과 다르면 수동 입력 모드로 설정
          if ((course as any).instructors && (course as any).instructors !== defaultInstructorName) {
            setIsInstructorManual(true)
          }
          setFormData(loadedData)
          setOriginalFormData(loadedData) // 원본 데이터 저장
        }
      } catch (error) {
        console.error('강좌 정보 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [courseId])

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

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return }
    if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB를 초과할 수 없습니다.'); return }

    // 파일을 읽어서 크롭 모달에 표시
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewImageSrc(reader.result as string)
      setCropModalOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = '' // input 초기화
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      // 크롭된 이미지를 File 객체로 변환
      const croppedFile = new File([croppedBlob], 'thumbnail.jpg', { type: 'image/jpeg' })

      const { uploadFile } = await import('../../core/api/upload')
      const result = await uploadFile(croppedFile, 'image', 'thumbnail')
      // 백엔드에서 절대 URL을 반환하므로 그대로 DB에 저장
      setFormData(prev => ({ ...prev, thumbnail: result.url }))
      setThumbnailFile(croppedFile)
    } catch (error) {
      console.error('썸네일 업로드 실패:', error)
      alert('썸네일 업로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: '' }))
    setThumbnailFile(null)
  }

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancel = () => {
    if (originalFormData) {
      setFormData(originalFormData)
    }
    setIsEditMode(false)
    setThumbnailFile(null)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('강좌 제목을 입력해주세요.')
      return
    }

    setSaving(true)
    try {
      const updatedCourse = await updateCourse(courseId, {
        title: formData.title,
        videoUrl: formData.videoUrl,
        content: formData.content,
        thumbnail: formData.thumbnail,
        status: formData.isPublic ? '공개' : '비공개',
        lecturePeriodStart: formData.lecturePeriodStart || undefined,
        lecturePeriodEnd: formData.lecturePeriodEnd || undefined,
        educationSchedule: formData.educationSchedule || undefined,
        instructors: isInstructorManual ? formData.instructors : defaultInstructorName, // 자동 또는 수동 입력
        // category1, category2, durationStartDate 등은 나중에 구현
      })

      // 원본 데이터 업데이트
      const isPublic = updatedCourse.status === '공개'
      const course = updatedCourse as any
      const updatedData = {
        ...formData,
        title: updatedCourse.title || formData.title,
        thumbnail: updatedCourse.thumbnail || formData.thumbnail,
        videoUrl: updatedCourse.videoUrl || formData.videoUrl,
        content: updatedCourse.content || formData.content,
        isPublic,
        lecturePeriodStart: course.lecturePeriodStart ? new Date(course.lecturePeriodStart).toISOString().split('T')[0] : formData.lecturePeriodStart,
        lecturePeriodEnd: course.lecturePeriodEnd ? new Date(course.lecturePeriodEnd).toISOString().split('T')[0] : formData.lecturePeriodEnd,
        educationSchedule: course.educationSchedule || formData.educationSchedule,
        instructors: (course as any).instructors || formData.instructors || defaultInstructorName,
      }
      setOriginalFormData(updatedData)
      setFormData(updatedData)
      setIsEditMode(false)
      setThumbnailFile(null)

      alert('강좌 정보가 저장되었습니다!')
    } catch (error) {
      console.error('강좌 정보 저장 실패:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const rightActions = (
    <>
      {!isEditMode ? (
        <Button
          onClick={handleEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <Edit3 className="h-4 w-4 mr-1" /> 편집하기
        </Button>
      ) : (
        <>
          <Button
            onClick={handleCancel}
            disabled={saving}
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-xl disabled:opacity-50 mr-2"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/90 text-primary-content rounded-xl disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-1" /> {saving ? '저장 중...' : '저장하기'}
          </Button>
        </>
      )}
    </>
  )

  if (loading) {
    return (
      <CoursePageLayout currentPageTitle="강좌 정보" rightActions={rightActions}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </CoursePageLayout>
    )
  }

  return (
    <CoursePageLayout currentPageTitle="강좌 정보" rightActions={rightActions}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1) 강좌 제목 */}
          <Card>
            <div className="p-4">
              <label className="block text-base font-bold text-gray-900 mb-4">강좌 제목 *</label>
              {isEditMode ? (
                <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="강좌 제목을 입력하세요" className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
              ) : (
                <p className="px-5 py-4 text-base text-gray-900 bg-gray-50 rounded-xl">{formData.title || '제목 없음'}</p>
              )}
            </div>
          </Card>

          {/* 2) 썸네일 추가 */}
          <Card>
            <div className="p-4">
              <label className="block text-base font-bold text-gray-900 mb-4">썸네일</label>
              {formData.thumbnail ? (
                <div className="relative group">
                  <img src={normalizeThumbnailUrl(formData.thumbnail)} alt="Thumbnail preview" className="w-full aspect-video object-cover rounded-xl border border-gray-200" />
                  {isEditMode && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <button onClick={handleRemoveThumbnail} className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white text-base font-semibold rounded-lg flex items-center space-x-2 transition-colors">
                        <X className="h-5 w-5" /> <span>삭제</span>
                      </button>
                    </div>
                  )}
                  {isEditMode && thumbnailFile && (
                    <div className="mt-3 text-sm text-gray-600 font-medium">파일명: {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(1)}KB)</div>
                  )}
                </div>
              ) : (
                isEditMode ? (
                  <label className="block">
                    <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer group">
                      <Upload className="h-14 w-14 text-gray-400 group-hover:text-blue-500 mx-auto mb-5 transition-colors" />
                      <p className="text-base font-medium text-gray-700 mb-3">클릭하거나 파일을 드래그하여 업로드</p>
                      <div className="text-sm text-gray-500 space-y-1.5">
                        <p>• 최대 2MB까지 업로드 가능</p>
                        <p>• 권장 크기: 697×365px</p>
                        <p>• JPG, PNG, GIF 형식 지원</p>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="w-full aspect-video bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                    <p className="text-gray-400">썸네일 없음</p>
                  </div>
                )
              )}
            </div>
          </Card>

          {/* 3) 카테고리(대/소) */}
          <Card>
            <div className="p-4">
              <label className="block text-base font-bold text-gray-900 mb-5">강좌 카테고리</label>
              {isEditMode ? (
                <div className="grid grid-cols-2 gap-5">
                  <div className="relative">
                    <select value={formData.category1} onChange={(e) => handleInputChange('category1', e.target.value)} className="w-full px-5 py-4 pr-10 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none">
                      <option value="">카테고리 선택</option>
                      <option value="비즈니스">비즈니스</option>
                      <option value="기술">기술</option>
                      <option value="디자인">디자인</option>
                      <option value="마케팅">마케팅</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select value={formData.category2} onChange={(e) => handleInputChange('category2', e.target.value)} className="w-full px-5 py-4 pr-10 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none">
                      <option value="">세부 카테고리</option>
                      <option value="웹개발">웹개발</option>
                      <option value="모바일">모바일</option>
                      <option value="데이터">데이터</option>
                      <option value="기타">기타</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              ) : (
                <p className="px-5 py-4 text-base text-gray-900 bg-gray-50 rounded-xl">
                  {formData.category1 || '미정'} {formData.category2 ? `> ${formData.category2}` : ''}
                </p>
              )}
            </div>
          </Card>

          {/* 4) 강좌 소개 */}
          <Card>
            <div className="p-4">
              <label className="block text-base font-bold text-gray-900 mb-5">강좌 소개 *</label>
              {isEditMode ? (
                <StableLexicalEditor value={formData.content} onChange={(html) => handleInputChange('content', html)} placeholder="강좌의 목표, 커리큘럼, 대상 수강생 등을 자세히 작성해주세요..." />
              ) : (
                <div className="px-5 py-4 text-base text-gray-900 bg-gray-50 rounded-xl min-h-[200px]" dangerouslySetInnerHTML={{ __html: safeHtml(formData.content || '<p>강좌 소개 내용이 없습니다.</p>') }} />
              )}
            </div>
          </Card>

          {/* 5) 강의 기간, 교육시간, 강사 */}
          <Card>
            <div className="p-4">
              <label className="block text-base font-bold text-gray-900 mb-5">강의 정보</label>
              {isEditMode ? (
                <div className="space-y-5">
                  {/* 강의 기간 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">강의 기간</label>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">시작일</label>
                        <input type="date" value={formData.lecturePeriodStart} onChange={(e) => handleInputChange('lecturePeriodStart', e.target.value)} className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" style={{ colorScheme: 'light' }} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">종료일</label>
                        <input type="date" value={formData.lecturePeriodEnd} onChange={(e) => handleInputChange('lecturePeriodEnd', e.target.value)} className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" style={{ colorScheme: 'light' }} />
                      </div>
                    </div>
                  </div>

                  {/* 교육시간 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">교육시간</label>
                    <input type="text" value={formData.educationSchedule} onChange={(e) => handleInputChange('educationSchedule', e.target.value)} placeholder="예: 매주 월~금 (공휴일 제외) 09:00 ~ 18:00" className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                  </div>

                  {/* 강사 정보 */}
                  {user && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-gray-700">강사</label>
                        {!isInstructorManual ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsInstructorManual(true)
                              setFormData(prev => ({ ...prev, instructors: defaultInstructorName }))
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            직접 입력
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsInstructorManual(false)
                              setFormData(prev => ({ ...prev, instructors: defaultInstructorName }))
                            }}
                            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                          >
                            자동 설정
                          </button>
                        )}
                      </div>
                      {isInstructorManual ? (
                        <input
                          type="text"
                          value={formData.instructors}
                          onChange={(e) => handleInputChange('instructors', e.target.value)}
                          placeholder="강사 이름을 입력하세요"
                          className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                      ) : (
                        <div className="px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-xl">
                          <span className="text-gray-900">{defaultInstructorName}</span>
                          <span className="ml-2 text-sm text-gray-500">(자동 설정됨)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* 강의 기간 */}
                  {(formData.lecturePeriodStart || formData.lecturePeriodEnd) && (
                    <div>
                      <span className="text-lg font-semibold text-blue-600">강의 기간:</span>{' '}
                      <span className="text-base text-gray-900">
                        {formData.lecturePeriodStart || '미정'} ~ {formData.lecturePeriodEnd || '미정'}
                      </span>
                    </div>
                  )}

                  {/* 교육시간 */}
                  {formData.educationSchedule && (
                    <div>
                      <span className="text-lg font-semibold text-blue-600">교육시간:</span>{' '}
                      <span className="text-base text-gray-900">{formData.educationSchedule}</span>
                    </div>
                  )}

                  {/* 강사 정보 */}
                  {user && (
                    <div>
                      <span className="text-lg font-semibold text-blue-600">강사:</span>{' '}
                      <span className="text-base text-gray-900">
                        {formData.instructors || defaultInstructorName}
                      </span>
                    </div>
                  )}

                  {!formData.lecturePeriodStart && !formData.lecturePeriodEnd && !formData.educationSchedule && !user && (
                    <p className="text-gray-500">강의 정보 없음</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 6) 소개 영상 */}
          <Card>
            <div className="p-4">
              <label className="block text-base font-bold text-gray-900 mb-4">소개 영상</label>
              {isEditMode ? (
                <div className="relative">
                  <input type="url" value={formData.videoUrl} onChange={(e) => handleInputChange('videoUrl', e.target.value)} placeholder="YouTube 또는 Vimeo 영상 URL을 입력해주세요" className="w-full px-5 py-4 pr-12 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                  <Video className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              ) : (
                <p className="px-5 py-4 text-base text-gray-900 bg-gray-50 rounded-xl">
                  {formData.videoUrl || '소개 영상 없음'}
                </p>
              )}
            </div>
          </Card>

          {/* 10) 공개/비공개 설정 */}
          <Card>
            <div className="p-4">
              <label className="block text-base font-bold text-gray-900 mb-5">공개 설정</label>
              {isEditMode ? (
                <div className="flex items-center space-x-6">
                  <Button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                    className={`px-5 py-4 rounded-xl border-2 transition-all ${
                      formData.isPublic
                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {formData.isPublic && '✓ '}공개
                    <span className="text-sm ml-2 opacity-80">(수강 코드 입력 시 수강 신청 가능)</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                    className={`px-5 py-4 rounded-xl border-2 transition-all ${
                      !formData.isPublic
                        ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {!formData.isPublic && '✓ '}비공개
                    <span className="text-sm ml-2 opacity-80">(수강 코드 입력해도 수강 신청 불가)</span>
                  </Button>
                </div>
              ) : (
                <div className="px-5 py-4 text-base text-gray-900 bg-gray-50 rounded-xl">
                  <span className={`px-3 py-1 rounded-lg font-semibold ${
                    formData.isPublic ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {formData.isPublic ? '공개' : '비공개'}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    {formData.isPublic ? '(수강 코드 입력 시 수강 신청 가능)' : '(수강 코드 입력해도 수강 신청 불가)'}
                  </span>
                </div>
              )}
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
                    <img src={normalizeThumbnailUrl(formData.thumbnail)} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
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

              {/* 강의 정보 (기간, 시간, 강사) */}
              {((formData.lecturePeriodStart || formData.lecturePeriodEnd) || formData.educationSchedule || user) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">강의 정보</label>
                  <div className="mt-1 space-y-1">
                    {(formData.lecturePeriodStart || formData.lecturePeriodEnd) && (
                      <p className="text-sm text-gray-900">
                        <span className="text-lg font-semibold text-blue-600">강의 기간:</span>{' '}
                        {formData.lecturePeriodStart || '미정'} ~ {formData.lecturePeriodEnd || '미정'}
                      </p>
                    )}
                    {formData.educationSchedule && (
                      <p className="text-sm text-gray-900">
                        <span className="text-lg font-semibold text-blue-600">교육시간:</span>{' '}
                        {formData.educationSchedule}
                      </p>
                    )}
                    {user && (
                      <p className="text-sm text-gray-900">
                        <span className="text-lg font-semibold text-blue-600">강사:</span>{' '}
                        {formData.instructors || defaultInstructorName}
                      </p>
                    )}
                  </div>
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

      {/* 썸네일 크롭 모달 */}
      <ThumbnailCropModal
        isOpen={cropModalOpen}
        imageSrc={previewImageSrc}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={16 / 9}
      />
    </CoursePageLayout>
  )
}

