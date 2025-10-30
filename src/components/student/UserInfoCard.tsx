import { Link } from 'react-router-dom'
import { User, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import type { UserInfoCardProps } from '../../types'

export default function UserInfoCard({ user }: UserInfoCardProps) {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="h-full border border-gray-300">
      <div className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.name} profile`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{getInitials(user.name)}</span>
          )}
        </div>

        {/* User Info */}
        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold text-base-content">
            {user.name}
          </h2>
          <p className="text-sm text-base-content/70 break-all">
            {user.email}
          </p>
        </div>

        {/* Profile Edit Button */}
        <Link
          to="/student/profile"
          className="w-full inline-flex items-center justify-center space-x-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-3 py-2 hover:bg-primary/10 border border-primary/20"
          aria-label="프로필 수정 페이지로 이동"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          <span>프로필 수정</span>
        </Link>
      </div>
    </Card>
  )
}
