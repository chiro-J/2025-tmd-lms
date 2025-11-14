import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Edit3, Save, X, Upload } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useProfile } from '../../contexts/ProfileContext'

export default function PersonalInfoTab() {
  const { profileData, updateProfile, saveToLocalStorage } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profileData)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  // profileData가 변경될 때 formData 동기화
  useEffect(() => {
    setFormData(profileData)
  }, [profileData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    updateProfile(formData)
    saveToLocalStorage()
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(profileData)
    setIsEditing(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Card */}
      <div className="lg:col-span-1 space-y-8">
        <Card className="p-6 text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center overflow-hidden">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-base-content/50" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary text-primary-content rounded-full p-2 cursor-pointer hover:bg-primary-focus">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
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
      </div>
    </div>
  )
}



