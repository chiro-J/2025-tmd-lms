import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Edit3, Save, X, AlertTriangle } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useProfile } from '../../contexts/ProfileContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import AccountDeleteModal from './AccountDeleteModal'
import * as authApi from '../../core/api/auth'

export default function PersonalInfoTab() {
  const { profileData, updateProfile, saveToLocalStorage } = useProfile()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profileData)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // profileData가 변경될 때 formData 동기화
  useEffect(() => {
    setFormData(profileData)
  }, [profileData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    updateProfile(formData)
    await saveToLocalStorage()
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profileData)
    setIsEditing(false)
  }

  const handleSocialLink = async (provider: 'google' | 'kakao') => {
    // 실제로는 OAuth 인증 프로세스를 거쳐야 함
    // 여기서는 모의로 연동 처리
    const field = provider === 'google' ? 'googleLinked' : 'kakaoLinked'
    const dateField = provider === 'google' ? 'googleLinkedDate' : 'kakaoLinkedDate'

    // 현재 날짜를 YY.MM.DD 형식으로 저장
    const today = new Date()
    const formattedDate = `${String(today.getFullYear()).slice(2)}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

    updateProfile({
      [field]: true,
      [dateField]: formattedDate
    })
    await saveToLocalStorage()
  }

  const handleDeleteAccount = async () => {
    try {
      // 서버에 회원탈퇴 요청
      await authApi.deleteAccount()

      // 로컬 스토리지의 모든 데이터 삭제
      localStorage.clear()

      // 로그아웃 처리
      logout()

      // 로그인 페이지로 리다이렉트
      navigate('/login')
    } catch (error) {
      console.error('회원 탈퇴 실패:', error)

      // API 실패해도 로컬에서는 처리
      localStorage.clear()
      logout()
      navigate('/login')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Card */}
      <div className="lg:col-span-1 space-y-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-base-content mb-2">{formData.name}</h2>
          <p className="text-base-content/70 mb-4">수강생</p>
          <div className="space-y-2 text-sm text-base-content/70">
            <div className="flex items-center justify-center">
              <Mail className="h-4 w-4 mr-2" />
              {formData.email}
            </div>
            <div className="flex items-center justify-center">
              <Phone className="h-4 w-4 mr-2" />
              {formData.phone || '미등록'}
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-2" />
              {formData.address || '미등록'}
            </div>
          </div>
        </Card>

        {/* Social Links Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-base-content mb-4">소셜 링크</h3>
          <div className="border-t border-base-300 mb-4" />
          <div className="space-y-4">
            <div>
              <label className="label">GitHub URL</label>
              {isEditing ? (
                <Input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="https://github.com/username"
                />
              ) : (
                <p className="text-base-content py-2 break-all">{formData.githubUrl || '미등록'}</p>
              )}
            </div>
            <div>
              <label className="label">Notion URL</label>
              {isEditing ? (
                <Input
                  type="url"
                  name="notionUrl"
                  value={formData.notionUrl}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="https://notion.so/..."
                />
              ) : (
                <p className="text-base-content py-2 break-all">{formData.notionUrl || '미등록'}</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Details */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-base-content">개인 정보</h3>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="btn-outline"
              >
                <Edit3 className="h-4 w-4" />
                편집
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  className="btn-primary"
                >
                  <Save className="h-4 w-4" />
                  저장
                </Button>
                <Button
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  <X className="h-4 w-4" />
                  취소
                </Button>
              </div>
            )}
          </div>
          <div className="border-t border-base-300 mb-4" />

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">이름</label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                  />
                ) : (
                  <p className="text-base-content py-2">{formData.name}</p>
                )}
              </div>
              <div>
                <label className="label">이메일</label>
                <p className="text-base-content py-2">{formData.email}</p>
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">전화번호</label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="010-0000-0000"
                  />
                ) : (
                  <p className="text-base-content py-2">{formData.phone || '미등록'}</p>
                )}
              </div>
              <div>
                <label className="label">주소</label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="서울특별시..."
                  />
                ) : (
                  <p className="text-base-content py-2">{formData.address || '미등록'}</p>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">직업</label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="job"
                    value={formData.job}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="개발자, 학생 등"
                  />
                ) : (
                  <p className="text-base-content py-2">{formData.job || '미등록'}</p>
                )}
              </div>
              <div>
                <label className="label">선호 언어</label>
                {isEditing ? (
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="한국어">한국어</option>
                    <option value="English">English</option>
                    <option value="日本語">日本語</option>
                  </select>
                ) : (
                  <p className="text-base-content py-2">{formData.language}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="label">자기소개</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="input"
                  placeholder="자신을 소개해주세요..."
                />
              ) : (
                <p className="text-base-content py-2 whitespace-pre-wrap">{formData.bio || '미등록'}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Social Login Integration Card */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-base-content mb-4">소셜 로그인 연동</h3>
          <div className="border-t border-base-300 mb-4" />

          <div className="grid grid-cols-2 gap-4">
            {/* Google */}
            <div className="border border-base-300 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-base-content">Google</h4>
                </div>
                {profileData.googleLinked ? (
                  <div className="px-3 py-1 bg-base-200 rounded-full border border-base-300">
                    <p className="text-xs text-base-content/70">
                      {profileData.googleLinkedDate ? `${profileData.googleLinkedDate} 연결됨` : '연동됨'}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleSocialLink('google')}
                    className="btn-primary btn-sm"
                  >
                    연결하기
                  </Button>
                )}
              </div>
            </div>

            {/* Kakao */}
            <div className="border border-base-300 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                      <path fill="#000000" d="M12 3C6.486 3 2 6.262 2 10.29c0 2.546 1.691 4.79 4.232 6.135-.184.68-.603 2.255-.689 2.611-.105.434.158.428.332.311.137-.093 2.223-1.477 3.152-2.098.486.065.986.099 1.494.099 5.514 0 9.979-3.262 9.979-7.29C21.979 6.262 17.514 3 12 3z"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold text-base-content">카카오톡</h4>
                </div>
                {profileData.kakaoLinked ? (
                  <div className="px-3 py-1 bg-base-200 rounded-full border border-base-300">
                    <p className="text-xs text-base-content/70">
                      {profileData.kakaoLinkedDate ? `${profileData.kakaoLinkedDate} 연결됨` : '연동됨'}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleSocialLink('kakao')}
                    className="btn-primary btn-sm"
                  >
                    연결하기
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Account Deletion Section */}
        <Card className="p-6 border-error">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-error" />
            <h3 className="text-lg font-semibold text-error">회원 탈퇴</h3>
          </div>
          <div className="border-t border-base-300 mb-4" />

          <div className="space-y-4">
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <h4 className="font-semibold text-base-content mb-2">탈퇴 전 유의사항</h4>
              <ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
                <li>회원 탈퇴 시 모든 개인정보 및 학습 데이터가 삭제됩니다.</li>
                <li>수강 중인 강의 정보가 모두 삭제되며 복구할 수 없습니다.</li>
                <li>작성한 게시글, 댓글 등은 삭제되지 않으며 '탈퇴 회원'으로 표시됩니다.</li>
                <li>동일한 이메일로 재가입이 가능하나, 기존 데이터는 복구되지 않습니다.</li>
              </ul>
            </div>

            <Button
              onClick={() => setShowDeleteModal(true)}
              className="btn-outline btn-error w-full"
            >
              회원 탈퇴 신청
            </Button>
          </div>
        </Card>
      </div>

      {/* Account Delete Modal */}
      <AccountDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}



