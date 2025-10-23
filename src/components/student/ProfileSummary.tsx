import { User, Upload } from 'lucide-react'
import Card from '../ui/Card'

interface ProfileSummaryProps {
  name: string
  email: string
  totalCourses: number
  inProgress: number
  avgProgress: number
}

export default function ProfileSummary({ 
  name, 
  email, 
  totalCourses, 
  inProgress, 
  avgProgress 
}: ProfileSummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Avatar + Name/Email */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <button 
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              aria-label="프로필 사진 업로드"
            >
              <Upload className="w-3 h-3 text-white" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
        </div>
      </Card>

      {/* Middle: KPI Stats */}
      <Card>
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-600">학습 현황</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{totalCourses}</div>
              <div className="text-xs text-neutral-500">총 강좌</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{inProgress}</div>
              <div className="text-xs text-neutral-500">진행 중</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">{avgProgress}%</div>
              <div className="text-xs text-neutral-500">평균 진행률</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Right: CTA Card */}
      <Card>
        <div className="text-center space-y-4">
          <h4 className="text-sm font-medium text-gray-600">빠른 액션</h4>
          <button 
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
            aria-label="대시보드로 이동"
          >
            대시보드로 →
          </button>
        </div>
      </Card>
    </div>
  )
}
