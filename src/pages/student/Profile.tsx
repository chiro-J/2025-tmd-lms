import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const userId = 1 // mockUser.id를 사용해야 하지만 여기서는 하드코딩

  const [formData, setFormData] = useState({
    name: 'Alex Kim',
    email: 'alex@example.com',
    phone: '010-1234-5678',
    address: '서울특별시 강남구',
    job: '프론트엔드 개발자',
    language: '한국어',
    bio: '열정적인 개발자로서 지속적인 학습과 성장을 추구합니다.',
    languages: ['C/C++', 'PYTHON', 'JAVASCRIPT'],
    githubUrl: '',
    notionUrl: ''
  })

  // localStorage에서 소셜 링크 로드
  useEffect(() => {
    const savedGithub = localStorage.getItem(`github_url_${userId}`)
    const savedNotion = localStorage.getItem(`notion_url_${userId}`)

    if (savedGithub || savedNotion) {
      setFormData(prev => ({
        ...prev,
        githubUrl: savedGithub || '',
        notionUrl: savedNotion || ''
      }))
    }
  }, [userId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // 실제로는 API 호출
    // localStorage에 소셜 링크 저장
    if (formData.githubUrl) {
      localStorage.setItem(`github_url_${userId}`, formData.githubUrl)
    } else {
      localStorage.removeItem(`github_url_${userId}`)
    }

    if (formData.notionUrl) {
      localStorage.setItem(`notion_url_${userId}`, formData.notionUrl)
    } else {
      localStorage.removeItem(`notion_url_${userId}`)
    }

    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // 취소 시 localStorage에서 다시 로드
    const savedGithub = localStorage.getItem(`github_url_${userId}`)
    const savedNotion = localStorage.getItem(`notion_url_${userId}`)

    setFormData({
      name: 'Alex Kim',
      email: 'alex@example.com',
      phone: '010-1234-5678',
      address: '서울특별시 강남구',
      job: '프론트엔드 개발자',
      language: '한국어',
      bio: '열정적인 개발자로서 지속적인 학습과 성장을 추구합니다.',
      languages: ['C/C++', 'PYTHON', 'JAVASCRIPT'],
      githubUrl: savedGithub || '',
      notionUrl: savedNotion || ''
    })
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">마이페이지</h1>
          <p className="text-base-content/70 mt-2">프로필 정보를 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-base-content/50" />
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
                  {formData.phone}
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {formData.address}
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
                <div>
                  <h4 className="text-sm font-medium text-base-content/80 mb-3">기본 정보</h4>
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
                    <p className="text-base-content py-2">{formData.email}</p> {/* 이메일은 편집 불가 */}
                  </div>
                </div>
                {/* close grid */}
                </div>

                {/* Contact */}
                <div>
                  <div className="border-t border-base-300 my-2" />
                  <h4 className="text-sm font-medium text-base-content/80 mb-3">연락처</h4>
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
                        />
                      ) : (
                        <p className="text-base-content py-2">{formData.phone}</p>
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
                        />
                      ) : (
                        <p className="text-base-content py-2">{formData.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <div className="border-t border-base-300 my-2" />
                  <h4 className="text-sm font-medium text-base-content/80 mb-3">학습 선호</h4>
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
                        />
                      ) : (
                        <p className="text-base-content py-2">{formData.job}</p>
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
                </div>

                {/* Bio */}
                <div>
                  <div className="border-t border-base-300 my-2" />
                  <h4 className="text-sm font-medium text-base-content/80 mb-3">자기소개</h4>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="input"
                    />
                  ) : (
                    <p className="text-base-content py-2 whitespace-pre-wrap">{formData.bio}</p>
                  )}
                </div>

                {/* Programming Languages */}
                <div>
                  <div className="border-t border-base-300 my-2" />
                  <h4 className="text-sm font-medium text-base-content/80 mb-3">보유 기술</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="badge badge-primary"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
