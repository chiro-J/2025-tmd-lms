import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { User, Mail, Phone, MapPin, Edit3, Save, X, BookOpen, Users, Award, Calendar, Loader2 } from 'lucide-react'

// 알림 설정 카드 컴포넌트
interface NotificationSettingsCardProps {
  userId: number
  blockNotifications: boolean
  setBlockNotifications: (value: boolean) => void
}

function NotificationSettingsCard({ userId, blockNotifications, setBlockNotifications }: NotificationSettingsCardProps) {
  const handleToggle = () => {
    const newValue = !blockNotifications
    setBlockNotifications(newValue)
    localStorage.setItem(`block_system_notifications_${userId}`, JSON.stringify(newValue))
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-base-content mb-2">시스템 공지사항 알림 설정</h3>
      <p className="text-sm text-base-content/70 mb-4">
        중요도가 "높음"인 공지사항은 무조건 알림을 받습니다.
        토글을 활성화하면 그 외 공지사항의 알림을 받지 않습니다.
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-base-content">
            {blockNotifications ? '일반 공지사항 알림 수신 거부' : '모든 공지사항 알림 수신'}
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            blockNotifications ? 'bg-gray-300' : 'bg-primary'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              blockNotifications ? 'translate-x-1' : 'translate-x-6'
            }`}
          />
        </button>
      </div>
    </Card>
  )
}

export default function InstructorProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const userId = typeof user?.id === 'number' ? user.id : (typeof user?.id === 'string' ? parseInt(user.id, 10) : 1)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    bio: '',
    specialties: [] as string[],
    experience: '',
    education: '',
    totalCourses: 0,
    totalStudents: 0,
    averageRating: 0,
    joinDate: ''
  })

  const [blockNotifications, setBlockNotifications] = useState(false)

  // 로그인 체크 및 데이터 로드
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    }))

    // localStorage에서 추가 정보 로드
    const savedAddress = localStorage.getItem(`instructor_address_${userId}`)
    const savedBio = localStorage.getItem(`instructor_bio_${userId}`)
    const savedSpecialties = localStorage.getItem(`instructor_specialties_${userId}`)
    const savedExperience = localStorage.getItem(`instructor_experience_${userId}`)
    const savedEducation = localStorage.getItem(`instructor_education_${userId}`)
    const savedPhone = localStorage.getItem(`instructor_phone_${userId}`)
    const savedBlockNotifications = localStorage.getItem(`block_system_notifications_${userId}`)

    setFormData(prev => ({
      ...prev,
      address: savedAddress || '',
      bio: savedBio || '',
      specialties: savedSpecialties ? JSON.parse(savedSpecialties) : [],
      experience: savedExperience || '',
      education: savedEducation || '',
      phone: user.phone || savedPhone || ''
    }))

    if (savedBlockNotifications) {
      setBlockNotifications(JSON.parse(savedBlockNotifications))
    }

    setLoading(false)
  }, [user, userId])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // 모든 프로필 정보를 localStorage에 저장
    if (formData.address) {
      localStorage.setItem(`instructor_address_${userId}`, formData.address)
    } else {
      localStorage.removeItem(`instructor_address_${userId}`)
    }

    if (formData.bio) {
      localStorage.setItem(`instructor_bio_${userId}`, formData.bio)
    } else {
      localStorage.removeItem(`instructor_bio_${userId}`)
    }

    if (formData.specialties.length > 0) {
      localStorage.setItem(`instructor_specialties_${userId}`, JSON.stringify(formData.specialties))
    } else {
      localStorage.removeItem(`instructor_specialties_${userId}`)
    }

    if (formData.experience) {
      localStorage.setItem(`instructor_experience_${userId}`, formData.experience)
    } else {
      localStorage.removeItem(`instructor_experience_${userId}`)
    }

    if (formData.education) {
      localStorage.setItem(`instructor_education_${userId}`, formData.education)
    } else {
      localStorage.removeItem(`instructor_education_${userId}`)
    }

    if (formData.phone) {
      localStorage.setItem(`instructor_phone_${userId}`, formData.phone)
    } else {
      localStorage.removeItem(`instructor_phone_${userId}`)
    }

    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // 취소 시 user 데이터 우선 사용, localStorage에서 추가 정보 로드
    const savedAddress = localStorage.getItem(`instructor_address_${userId}`)
    const savedBio = localStorage.getItem(`instructor_bio_${userId}`)
    const savedSpecialties = localStorage.getItem(`instructor_specialties_${userId}`)
    const savedExperience = localStorage.getItem(`instructor_experience_${userId}`)
    const savedEducation = localStorage.getItem(`instructor_education_${userId}`)
    const savedPhone = localStorage.getItem(`instructor_phone_${userId}`)

    setFormData(prev => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || savedPhone || '',
      address: savedAddress || '',
      bio: savedBio || '',
      specialties: savedSpecialties ? JSON.parse(savedSpecialties) : [],
      experience: savedExperience || '',
      education: savedEducation || ''
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">로그인이 필요합니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-base-content">강의자 프로필</h1>
          <p className="text-gray-600 mt-2">강의자 정보를 관리하고 통계를 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{formData.name}</h2>
              <p className="text-gray-600 mb-4">강사</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {formData.email}
                </div>
                <div className="flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {formData.phone}
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {formData.address}
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">강의 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">총 강의 수</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formData.totalCourses}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">총 수강생</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formData.totalStudents}명</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-gray-600">평균 평점</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formData.averageRating}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm text-gray-600">가입일</span>
                  </div>
                  <span className="font-semibold text-gray-900">{formData.joinDate}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">기본 정보</h3>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>편집</span>
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>저장</span>
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>취소</span>
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="이름을 입력하세요"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    {isEditing ? (
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="이메일을 입력하세요"
                        type="email"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="전화번호를 입력하세요"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="주소를 입력하세요"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.address}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">소개</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="자기소개를 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-900">{formData.bio}</p>
                  )}
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">전문 분야</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience & Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">경력</label>
                    <p className="text-gray-900">{formData.experience}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">학력</label>
                    <p className="text-gray-900">{formData.education}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}











