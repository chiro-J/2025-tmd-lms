import { Link } from 'react-router-dom'
import { User, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import type { UserInfoCardProps } from '../../types'

export default function UserInfoCard({ user, stats }: UserInfoCardProps) {
  return (
    <Card className="h-full border border-gray-300">
      <div className="p-6 h-full flex items-center justify-between">
        {/* User Info - Simple */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              user.name.split(' ').map(n => n[0]).join('').toUpperCase()
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-base-content">{user.name}</h2>
            <p className="text-sm text-base-content/70">{user.email}</p>
          </div>
        </div>

        {/* Profile Edit Link */}
        <Link
          to="/student/profile"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-4 py-2 hover:bg-primary/10 border border-primary/20"
        >
          <User className="h-4 w-4" />
          <span>프로필 수정</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Card>
  )
}