import { useState } from 'react'
import { User, FileText, Eye, Loader2, BarChart3 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { ProfileProvider, useProfile } from '../../contexts/ProfileContext'
import PersonalInfoTab from '../../components/student/PersonalInfoTab'
import ResumeTab from '../../components/student/ResumeTab'
import PreviewTab from '../../components/student/PreviewTab'

type TabType = 'personal' | 'resume' | 'preview'

// 완성도 계산 함수
const calculateCompleteness = (profileData: any) => {
  let total = 0
  let filled = 0

  // 기본 정보 (30%)
  total += 6
  if (profileData.name) filled++
  if (profileData.email) filled++
  if (profileData.phone) filled++
  if (profileData.address) filled++
  if (profileData.bio) filled++
  if (profileData.job) filled++

  // 학력 (15%)
  total += 1
  if (profileData.education.length > 0) filled++

  // 경력 (20%)
  total += 1
  if (profileData.experience.length > 0) filled++

  // 프로젝트 (20%)
  total += 1
  if (profileData.projects.length > 0) filled++

  // 자격증 (10%)
  total += 1
  if (profileData.certificates.length > 0) filled++

  // 기술 스택 (5%)
  total += 1
  if (profileData.languages.length > 0) filled++

  return Math.round((filled / total) * 100)
}

function ProfileContent() {
  const { user } = useAuth()
  const { profileData } = useProfile()
  const [activeTab, setActiveTab] = useState<TabType>('personal')

  const completeness = calculateCompleteness(profileData)

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">로그인이 필요합니다.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'personal' as TabType, label: '개인정보', icon: User },
    { id: 'resume' as TabType, label: '이력서', icon: FileText },
    { id: 'preview' as TabType, label: '미리보기', icon: Eye }
  ]

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <main className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">마이페이지</h1>
          <p className="text-base-content/70 mt-2">프로필 정보와 이력서를 관리하세요</p>
        </div>

        {/* Sticky Tab Navigation and Progress Bar */}
        <div className="sticky top-16 z-10 bg-base-200 pb-4 pt-4">
          {/* Tab Navigation */}
          <div className="bg-base-100 rounded-lg mb-4 p-2 shadow-sm">
            <div className="flex gap-2 border-b border-base-300">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-content font-semibold'
                        : 'text-base-content/70 hover:bg-base-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className={`rounded-lg px-4 py-3 shadow-sm ${completeness === 100 ? 'bg-success/10' : 'bg-base-100'}`}>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${completeness === 100 ? 'text-success' : 'text-base-content/70'}`}>
                {completeness === 100 ? '완료!' : '완성도'}
              </span>
              <div className="flex-1 bg-base-300 rounded-full h-2">
                <div
                  className={`rounded-full h-2 transition-all duration-500 ${
                    completeness === 100 ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <span className={`text-xs font-bold min-w-[3rem] text-right ${
                completeness === 100 ? 'text-success' : 'text-primary'
              }`}>
                {completeness}%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'personal' && <PersonalInfoTab />}
          {activeTab === 'resume' && <ResumeTab />}
          {activeTab === 'preview' && <PreviewTab />}
        </div>
      </main>
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">로그인이 필요합니다.</p>
        </div>
      </div>
    )
  }

  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  )
}
