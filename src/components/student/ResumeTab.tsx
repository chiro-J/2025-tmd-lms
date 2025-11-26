import { useState, useRef, useEffect } from 'react'
import { GraduationCap, Briefcase, FolderGit2, Award, Code, Plus, Edit2, Trash2, X, Save, User, Upload, ChevronDown, Mail } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useProfile } from '../../contexts/ProfileContext'
import ProfilePhotoModal from './ProfilePhotoModal'
import type { Education, Experience, Project, Certificate, Language, Training } from '../../contexts/ProfileContext'

export default function ResumeTab() {
  const {
    profileData,
    updateProfile,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addLanguageSkill,
    updateLanguageSkill,
    deleteLanguageSkill,
    addTraining,
    updateTraining,
    deleteTraining,
    saveToLocalStorage
  } = useProfile()

  const [skillInput, setSkillInput] = useState('')
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)

  const handleApplyPhoto = (imageData: string) => {
    updateProfile({ resumePhoto: imageData })
    saveToLocalStorage()
  }

  const handleRemovePhoto = () => {
    updateProfile({ resumePhoto: '' })
    saveToLocalStorage()
  }

  const addSkill = () => {
    if (skillInput.trim() && !profileData.languages.includes(skillInput.trim())) {
      updateProfile({ languages: [...profileData.languages, skillInput.trim()] })
      saveToLocalStorage()
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    updateProfile({ languages: profileData.languages.filter(s => s !== skill) })
    saveToLocalStorage()
  }

  const [editingEducation, setEditingEducation] = useState<string | null>(null)
  const [editingExperience, setEditingExperience] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editingCertificate, setEditingCertificate] = useState<string | null>(null)
  const [editingLanguage, setEditingLanguage] = useState<string | null>(null)
  const [editingTraining, setEditingTraining] = useState<string | null>(null)

  const [showEducationForm, setShowEducationForm] = useState(false)
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showCertificateForm, setShowCertificateForm] = useState(false)
  const [showLanguageForm, setShowLanguageForm] = useState(false)
  const [showTrainingForm, setShowTrainingForm] = useState(false)

  // Auto-resize textarea
  const bioTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (bioTextareaRef.current) {
      bioTextareaRef.current.style.height = 'auto'
      bioTextareaRef.current.style.height = bioTextareaRef.current.scrollHeight + 'px'
    }
  }, [profileData.bio])

  // Education Form
  const EducationForm = ({ education, onSave, onCancel }: {
    education?: Education
    onSave: (data: Education) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Education>(education || {
      id: Date.now().toString(),
      school: '',
      major: '',
      degree: '',
      startDate: '',
      endDate: '',
      status: 'enrolled',
      gpa: ''
    })

    return (
      <Card className="p-4 bg-base-100 border border-base-300">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="학교명"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            />
            <Input
              placeholder="전공"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <select
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="input appearance-none pr-10"
              >
                <option value="">학위 선택</option>
                <option value="고등학교">고등학교</option>
                <option value="전문학사">전문학사</option>
                <option value="학사">학사</option>
                <option value="석사">석사</option>
                <option value="박사">박사</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="input appearance-none pr-10"
              >
                <option value="enrolled">재학 중</option>
                <option value="graduated">졸업</option>
                <option value="dropped">중퇴</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="month"
              placeholder="시작일"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              type="month"
              placeholder="종료일"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
            <Input
              placeholder="학점 (선택)"
              value={formData.gpa || ''}
              onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} className="btn-outline">
              <X className="h-4 w-4" />
              취소
            </Button>
            <Button onClick={() => onSave(formData)} className="btn-primary">
              <Save className="h-4 w-4" />
              저장
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Experience Form
  const ExperienceForm = ({ experience, onSave, onCancel }: {
    experience?: Experience
    onSave: (data: Experience) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Experience>(experience || {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    })

    return (
      <Card className="p-4 bg-base-100 border border-base-300">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="회사명"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
            <Input
              placeholder="직책/직위"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="month"
              placeholder="시작일"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              type="month"
              placeholder="종료일"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              disabled={formData.current}
            />
            <label className="flex items-center space-x-2 px-3 py-2">
              <input
                type="checkbox"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                className="checkbox checkbox-primary"
              />
              <span className="text-sm">재직 중</span>
            </label>
          </div>
          <textarea
            placeholder="업무 설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="input"
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} className="btn-outline">
              <X className="h-4 w-4" />
              취소
            </Button>
            <Button onClick={() => onSave(formData)} className="btn-primary">
              <Save className="h-4 w-4" />
              저장
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Project Form
  const ProjectForm = ({ project, onSave, onCancel }: {
    project?: Project
    onSave: (data: Project) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Project>(project || {
      id: Date.now().toString(),
      name: '',
      description: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      techStack: [],
      url: ''
    })

    const [techInput, setTechInput] = useState('')

    const addTech = () => {
      if (techInput.trim()) {
        setFormData({ ...formData, techStack: [...formData.techStack, techInput.trim()] })
        setTechInput('')
      }
    }

    const removeTech = (index: number) => {
      setFormData({ ...formData, techStack: formData.techStack.filter((_, i) => i !== index) })
    }

    return (
      <Card className="p-4 bg-base-100 border border-base-300">
        <div className="space-y-4">
          <Input
            placeholder="프로젝트명"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="역할"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
            <Input
              type="url"
              placeholder="URL (선택)"
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="month"
              placeholder="시작일"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              type="month"
              placeholder="종료일"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              disabled={formData.current}
            />
            <label className="flex items-center space-x-2 px-3 py-2">
              <input
                type="checkbox"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })}
                className="checkbox checkbox-primary"
              />
              <span className="text-sm">진행 중</span>
            </label>
          </div>
          <textarea
            placeholder="프로젝트 설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="input"
          />
          <div>
            <label className="label">기술 스택</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="기술 입력 후 Enter"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              />
              <Button onClick={addTech} className="btn-outline">추가</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, index) => (
                <span key={index} className="badge badge-primary gap-2">
                  {tech}
                  <button onClick={() => removeTech(index)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} className="btn-outline">
              <X className="h-4 w-4" />
              취소
            </Button>
            <Button onClick={() => onSave(formData)} className="btn-primary">
              <Save className="h-4 w-4" />
              저장
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Certificate Form
  const CertificateForm = ({ certificate, onSave, onCancel }: {
    certificate?: Certificate
    onSave: (data: Certificate) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Certificate>(certificate || {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: ''
    })

    return (
      <Card className="p-4 bg-base-100 border border-base-300">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="자격증명"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="발급기관"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="month"
              placeholder="취득일"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            />
            <Input
              type="month"
              placeholder="만료일 (선택)"
              value={formData.expiryDate || ''}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
            <Input
              placeholder="자격번호 (선택)"
              value={formData.credentialId || ''}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} className="btn-outline">
              <X className="h-4 w-4" />
              취소
            </Button>
            <Button onClick={() => onSave(formData)} className="btn-primary">
              <Save className="h-4 w-4" />
              저장
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Language Form
  const LanguageForm = ({ language, onSave, onCancel }: {
    language?: Language
    onSave: (data: Language) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Language>(language || {
      id: Date.now().toString(),
      language: '',
      certificate: '',
      certificateDate: '',
      level: 'conversational'
    })

    return (
      <Card className="p-4 bg-base-100 border border-base-300">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">언어</label>
              <Input
                placeholder="예: English"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              />
            </div>
            <div>
              <label className="label">수준</label>
              <div className="relative">
                <select
                  className="input appearance-none pr-10"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as Language['level'] })}
                >
                  <option value="basic">기초</option>
                  <option value="conversational">일상회화</option>
                  <option value="business">비즈니스</option>
                  <option value="native">원어민</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">자격증 (선택)</label>
              <Input
                placeholder="예: TOEIC"
                value={formData.certificate || ''}
                onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
              />
            </div>
            <div>
              <label className="label">취득일 (선택)</label>
              <Input
                type="month"
                value={formData.certificateDate || ''}
                onChange={(e) => setFormData({ ...formData, certificateDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} className="btn-outline">
              <X className="h-4 w-4" />
              취소
            </Button>
            <Button onClick={() => onSave(formData)} className="btn-primary">
              <Save className="h-4 w-4" />
              저장
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // Training Form
  const TrainingForm = ({ training, onSave, onCancel }: {
    training?: Training
    onSave: (data: Training) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Training>(training || {
      id: Date.now().toString(),
      institution: '',
      content: '',
      startDate: '',
      endDate: ''
    })

    return (
      <Card className="p-4 bg-base-100 border border-base-300">
        <div className="space-y-4">
          <div>
            <label className="label">교육 기관</label>
            <Input
              placeholder="예: 패스트캠퍼스"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>
          <div>
            <label className="label">교육 내용</label>
            <Input
              placeholder="예: 프론트엔드 부트캠프"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">시작일</label>
              <Input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label">종료일</label>
              <Input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onCancel} className="btn-outline">
              <X className="h-4 w-4" />
              취소
            </Button>
            <Button onClick={() => onSave(formData)} className="btn-primary">
              <Save className="h-4 w-4" />
              저장
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Profile Photo & Contact Section - Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Photo Section */}
          <Card className="p-6 w-fit">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">이력서 사진</h3>
            </div>
            <div className="border-t border-base-300 mb-4" />

            {/* Photo Display with Hover Controls */}
            <div className="relative group">
              <div className="w-48 h-64 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-base-300">
                {profileData.resumePhoto ? (
                  <img
                    src={profileData.resumePhoto}
                    alt="이력서 사진"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center px-4">
                    <User className="h-16 w-16 text-base-content/30 mx-auto mb-2" />
                    <p className="text-sm text-base-content/50">사진 없음</p>
                    <p className="text-xs text-base-content/30 mt-1">720x960</p>
                  </div>
                )}
              </div>

              {/* Hover Overlay with Buttons */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="btn-primary btn-sm flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {profileData.resumePhoto ? '사진 변경' : '사진 업로드'}
                  </Button>
                  {profileData.resumePhoto && (
                    <Button
                      onClick={handleRemovePhoto}
                      className="btn-primary btn-sm flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      사진 제거
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Basic Information Section */}
          <Card className="p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">기본정보</h3>
              </div>
            </div>
            <div className="border-t border-base-300 mb-4" />

            <div className="space-y-4">
              {/* 이메일 & 홈페이지 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm font-medium">이메일</label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => {
                      updateProfile({ email: e.target.value })
                      saveToLocalStorage()
                    }}
                    className="input"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="label text-sm font-medium">홈페이지</label>
                  <Input
                    type="url"
                    value={profileData.portfolioUrl || ''}
                    onChange={(e) => {
                      updateProfile({ portfolioUrl: e.target.value })
                      saveToLocalStorage()
                    }}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* 전화번호 & 관심 직군 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label text-sm font-medium">전화번호</label>
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => {
                      updateProfile({ phone: e.target.value })
                      saveToLocalStorage()
                    }}
                    className="input"
                    placeholder="010-0000-0000"
                  />
                </div>

                <div>
                  <label className="label text-sm font-medium">관심 직군</label>
                  <Input
                    type="text"
                    value={profileData.job}
                    onChange={(e) => {
                      updateProfile({ job: e.target.value })
                      saveToLocalStorage()
                    }}
                    className="input"
                    placeholder="프론트엔드 개발자, 백엔드 개발자 등"
                  />
                </div>
              </div>

              {/* 거주지 */}
              <div>
                <label className="label text-sm font-medium">거주지</label>
                <Input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => {
                    updateProfile({ address: e.target.value })
                    saveToLocalStorage()
                  }}
                  className="input"
                  placeholder="서울특별시 강남구..."
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Bio Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">자기소개</h3>
            </div>
          </div>
          <div className="border-t border-base-300 mb-4" />

          <div>
            <textarea
              ref={bioTextareaRef}
              placeholder="자신을 소개하는 글을 작성해주세요..."
              value={profileData.bio}
              onChange={(e) => {
                updateProfile({ bio: e.target.value })
                saveToLocalStorage()
              }}
              className="input w-full resize-none overflow-hidden min-h-[120px] text-lg"
              style={{ height: 'auto' }}
            />
            {profileData.bio && (
              <div className="mt-2 text-sm text-base-content/70">
                {profileData.bio.length} / 1000자
              </div>
            )}
          </div>
        </Card>

        {/* Language & Training Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Language Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">외국어</h3>
              </div>
              <Button
                onClick={() => setShowLanguageForm(true)}
                className="btn-primary btn-sm"
              >
                <Plus className="h-4 w-4" />
                추가
              </Button>
            </div>
            <div className="border-t border-base-300 mb-4" />

            <div className="space-y-3">
              {profileData.languageSkills.map((lang) => (
                <div key={lang.id} className="border border-base-300 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{lang.language}</p>
                      <p className="text-sm text-base-content/70">
                        수준: {lang.level === 'native' ? '원어민' : lang.level === 'business' ? '비즈니스' : lang.level === 'conversational' ? '일상회화' : '기초'}
                      </p>
                      {lang.certificate && (
                        <p className="text-sm text-base-content/70">
                          자격증: {lang.certificate} {lang.certificateDate && `(${lang.certificateDate})`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingLanguage(lang.id)
                          setShowLanguageForm(true)
                        }}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteLanguageSkill(lang.id)
                          saveToLocalStorage()
                        }}
                        className="text-error hover:text-error-focus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {profileData.languageSkills.length === 0 && (
                <p className="text-sm text-base-content/50 text-center py-4">등록된 외국어가 없습니다</p>
              )}
            </div>

            {showLanguageForm && (
              <LanguageForm
                language={editingLanguage ? profileData.languageSkills.find(l => l.id === editingLanguage) : undefined}
                onSave={(data) => {
                  if (editingLanguage) {
                    updateLanguageSkill(editingLanguage, data)
                    setEditingLanguage(null)
                  } else {
                    addLanguageSkill(data)
                  }
                  saveToLocalStorage()
                  setShowLanguageForm(false)
                }}
                onCancel={() => {
                  setShowLanguageForm(false)
                  setEditingLanguage(null)
                }}
              />
            )}
          </Card>

          {/* Training Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">교육</h3>
              </div>
              <Button
                onClick={() => setShowTrainingForm(true)}
                className="btn-primary btn-sm"
              >
                <Plus className="h-4 w-4" />
                추가
              </Button>
            </div>
            <div className="border-t border-base-300 mb-4" />

            <div className="space-y-3">
              {profileData.trainings.map((training) => (
                <div key={training.id} className="border border-base-300 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{training.institution}</p>
                      <p className="text-sm text-base-content/70">{training.content}</p>
                      {training.startDate && training.endDate && (
                        <p className="text-sm text-base-content/60">
                          {training.startDate} ~ {training.endDate}
                          {(() => {
                            const start = new Date(training.startDate + '-01')
                            const end = new Date(training.endDate + '-01')
                            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                            return months > 0 ? ` (${months}개월)` : ''
                          })()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTraining(training.id)
                          setShowTrainingForm(true)
                        }}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteTraining(training.id)
                          saveToLocalStorage()
                        }}
                        className="text-error hover:text-error-focus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {profileData.trainings.length === 0 && (
                <p className="text-sm text-base-content/50 text-center py-4">등록된 교육이 없습니다</p>
              )}
            </div>

            {showTrainingForm && (
              <TrainingForm
                training={editingTraining ? profileData.trainings.find(t => t.id === editingTraining) : undefined}
                onSave={(data) => {
                  if (editingTraining) {
                    updateTraining(editingTraining, data)
                    setEditingTraining(null)
                  } else {
                    addTraining(data)
                  }
                  saveToLocalStorage()
                  setShowTrainingForm(false)
                }}
                onCancel={() => {
                  setShowTrainingForm(false)
                  setEditingTraining(null)
                }}
              />
            )}
          </Card>
        </div>

        {/* Education Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">학력</h3>
          </div>
          <Button onClick={() => setShowEducationForm(true)} className="btn-primary btn-sm">
            <Plus className="h-4 w-4" />
            추가
          </Button>
        </div>
        <div className="border-t border-base-300 mb-4" />

        <div className="space-y-4">
          {showEducationForm && (
            <EducationForm
              onSave={(data) => {
                addEducation(data)
                saveToLocalStorage()
                setShowEducationForm(false)
              }}
              onCancel={() => setShowEducationForm(false)}
            />
          )}

          {profileData.education.map((edu) => (
            <div key={edu.id}>
              {editingEducation === edu.id ? (
                <EducationForm
                  education={edu}
                  onSave={(data) => {
                    updateEducation(edu.id, data)
                    saveToLocalStorage()
                    setEditingEducation(null)
                  }}
                  onCancel={() => setEditingEducation(null)}
                />
              ) : (
                <Card className="p-4 bg-base-100 border border-base-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base-content">{edu.school}</h4>
                      <p className="text-sm text-base-content/70">{edu.major} · {edu.degree}</p>
                      <p className="text-sm text-base-content/70">
                        {edu.startDate} ~ {edu.endDate} · {edu.status === 'graduated' ? '졸업' : edu.status === 'enrolled' ? '재학 중' : '중퇴'}
                      </p>
                      {edu.gpa && <p className="text-sm text-base-content/70">학점: {edu.gpa}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingEducation(edu.id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteEducation(edu.id)
                          saveToLocalStorage()
                        }}
                        className="text-error hover:text-error-focus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ))}

          {profileData.education.length === 0 && !showEducationForm && (
            <p className="text-center text-base-content/50 py-8">학력 정보를 추가해주세요</p>
          )}
        </div>
      </Card>

      {/* Experience Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">경력</h3>
          </div>
          <Button onClick={() => setShowExperienceForm(true)} className="btn-primary btn-sm">
            <Plus className="h-4 w-4" />
            추가
          </Button>
        </div>
        <div className="border-t border-base-300 mb-4" />

        <div className="space-y-4">
          {showExperienceForm && (
            <ExperienceForm
              onSave={(data) => {
                addExperience(data)
                saveToLocalStorage()
                setShowExperienceForm(false)
              }}
              onCancel={() => setShowExperienceForm(false)}
            />
          )}

          {profileData.experience.map((exp) => (
            <div key={exp.id}>
              {editingExperience === exp.id ? (
                <ExperienceForm
                  experience={exp}
                  onSave={(data) => {
                    updateExperience(exp.id, data)
                    saveToLocalStorage()
                    setEditingExperience(null)
                  }}
                  onCancel={() => setEditingExperience(null)}
                />
              ) : (
                <Card className="p-4 bg-base-100 border border-base-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base-content">{exp.company}</h4>
                      <p className="text-sm text-base-content/70">{exp.position}</p>
                      <p className="text-sm text-base-content/70">
                        {exp.startDate} ~ {exp.current ? '재직 중' : exp.endDate}
                      </p>
                      <p className="text-sm text-base-content/70 mt-2 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingExperience(exp.id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteExperience(exp.id)
                          saveToLocalStorage()
                        }}
                        className="text-error hover:text-error-focus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ))}

          {profileData.experience.length === 0 && !showExperienceForm && (
            <p className="text-center text-base-content/50 py-8">경력 정보를 추가해주세요</p>
          )}
        </div>
      </Card>

      {/* Projects Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">프로젝트</h3>
          </div>
          <Button onClick={() => setShowProjectForm(true)} className="btn-primary btn-sm">
            <Plus className="h-4 w-4" />
            추가
          </Button>
        </div>
        <div className="border-t border-base-300 mb-4" />

        <div className="space-y-4">
          {showProjectForm && (
            <ProjectForm
              onSave={(data) => {
                addProject(data)
                saveToLocalStorage()
                setShowProjectForm(false)
              }}
              onCancel={() => setShowProjectForm(false)}
            />
          )}

          {profileData.projects.map((proj) => (
            <div key={proj.id}>
              {editingProject === proj.id ? (
                <ProjectForm
                  project={proj}
                  onSave={(data) => {
                    updateProject(proj.id, data)
                    saveToLocalStorage()
                    setEditingProject(null)
                  }}
                  onCancel={() => setEditingProject(null)}
                />
              ) : (
                <Card className="p-4 bg-base-100 border border-base-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base-content">{proj.name}</h4>
                      <p className="text-sm text-base-content/70">{proj.role}</p>
                      <p className="text-sm text-base-content/70">
                        {proj.startDate} ~ {proj.current ? '진행 중' : proj.endDate}
                      </p>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {proj.url}
                        </a>
                      )}
                      <p className="text-sm text-base-content/70 mt-2 whitespace-pre-wrap">{proj.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proj.techStack.map((tech, idx) => (
                          <span key={idx} className="badge badge-primary badge-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProject(proj.id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteProject(proj.id)
                          saveToLocalStorage()
                        }}
                        className="text-error hover:text-error-focus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ))}

          {profileData.projects.length === 0 && !showProjectForm && (
            <p className="text-center text-base-content/50 py-8">프로젝트 정보를 추가해주세요</p>
          )}
        </div>
      </Card>

      {/* Certificates Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">자격증</h3>
          </div>
          <Button onClick={() => setShowCertificateForm(true)} className="btn-primary btn-sm">
            <Plus className="h-4 w-4" />
            추가
          </Button>
        </div>
        <div className="border-t border-base-300 mb-4" />

        <div className="space-y-4">
          {showCertificateForm && (
            <CertificateForm
              onSave={(data) => {
                addCertificate(data)
                saveToLocalStorage()
                setShowCertificateForm(false)
              }}
              onCancel={() => setShowCertificateForm(false)}
            />
          )}

          {profileData.certificates.map((cert) => (
            <div key={cert.id}>
              {editingCertificate === cert.id ? (
                <CertificateForm
                  certificate={cert}
                  onSave={(data) => {
                    updateCertificate(cert.id, data)
                    saveToLocalStorage()
                    setEditingCertificate(null)
                  }}
                  onCancel={() => setEditingCertificate(null)}
                />
              ) : (
                <Card className="p-4 bg-base-100 border border-base-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base-content">{cert.name}</h4>
                      <p className="text-sm text-base-content/70">{cert.issuer}</p>
                      <p className="text-sm text-base-content/70">
                        취득일: {cert.issueDate}
                        {cert.expiryDate && ` · 만료일: ${cert.expiryDate}`}
                      </p>
                      {cert.credentialId && (
                        <p className="text-sm text-base-content/70">자격번호: {cert.credentialId}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCertificate(cert.id)}
                        className="text-primary hover:text-primary-focus"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteCertificate(cert.id)
                          saveToLocalStorage()
                        }}
                        className="text-error hover:text-error-focus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ))}

          {profileData.certificates.length === 0 && !showCertificateForm && (
            <p className="text-center text-base-content/50 py-8">자격증 정보를 추가해주세요</p>
          )}
        </div>
      </Card>

      {/* Skills Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">보유 기술</h3>
          </div>
        </div>
        <div className="border-t border-base-300 mb-4" />

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="기술 스택 입력 (예: React, TypeScript, Node.js)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="flex-1"
            />
            <Button onClick={addSkill} className="btn-primary">
              <Plus className="h-4 w-4" />
              추가
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profileData.languages.length > 0 ? (
              profileData.languages.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-primary gap-2 py-3 px-4"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            ) : (
              <p className="text-center text-base-content/50 py-8 w-full">보유 기술을 추가해주세요</p>
            )}
          </div>
        </div>
      </Card>
      </div>

      {/* Profile Photo Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onApply={handleApplyPhoto}
        currentPhoto={profileData.resumePhoto}
      />
    </>
  )
}



