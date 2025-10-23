import { useState } from 'react'
import { Clock, User, FileText, MessageSquare, Settings, Filter } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function ActivityHistory() {
  const [filter, setFilter] = useState('all')

  // Mock data
  const activities = [
    {
      id: 1,
      type: 'course_created',
      title: '강좌 생성',
      description: '(1회차) 풀스택 과정 강좌를 생성했습니다.',
      user: '김강사',
      timestamp: '2024-10-20 14:30',
      icon: FileText
    },
    {
      id: 2,
      type: 'exam_created',
      title: '시험 생성',
      description: '중간고사 시험을 생성했습니다.',
      user: '김강사',
      timestamp: '2024-10-19 10:15',
      icon: FileText
    },
    {
      id: 3,
      type: 'student_enrolled',
      title: '학생 수강',
      description: '김학생님이 강좌에 수강 신청했습니다.',
      user: '김학생',
      timestamp: '2024-10-18 16:45',
      icon: User
    },
    {
      id: 4,
      type: 'notice_created',
      title: '공지사항 작성',
      description: '중간고사 일정 공지사항을 작성했습니다.',
      user: '김강사',
      timestamp: '2024-10-17 09:20',
      icon: MessageSquare
    },
    {
      id: 5,
      type: 'settings_updated',
      title: '설정 변경',
      description: '강좌 설정을 수정했습니다.',
      user: '김강사',
      timestamp: '2024-10-16 11:30',
      icon: Settings
    }
  ]

  const rightActions = (
    <>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Filter className="h-4 w-4 mr-1" />
        필터
      </Button>
    </>
  )

  const getActivityIcon = (activity: any) => {
    const IconComponent = activity.icon
    return <IconComponent className="h-5 w-5 text-primary" />
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'course_created':
        return 'bg-primary/10 text-primary'
      case 'exam_created':
        return 'bg-success/10 text-success'
      case 'student_enrolled':
        return 'bg-info/10 text-info'
      case 'notice_created':
        return 'bg-warning/10 text-warning'
      case 'settings_updated':
        return 'bg-base-300 text-base-content/70'
      default:
        return 'bg-base-300 text-base-content/70'
    }
  }

  return (
    <CoursePageLayout 
      currentPageTitle="활동 내역"
      rightActions={rightActions}
    >
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">총 활동</p>
              <p className="text-2xl font-bold text-base-content">{activities.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success/10 rounded-lg">
              <User className="h-6 w-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">오늘 활동</p>
              <p className="text-2xl font-bold text-base-content">
                {activities.filter(a => a.timestamp.includes('2024-10-20')).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning/10 rounded-lg">
              <FileText className="h-6 w-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">이번 주</p>
              <p className="text-2xl font-bold text-base-content">
                {activities.filter(a => {
                  const date = new Date(a.timestamp)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return date > weekAgo
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 활동 목록 */}
      <Card>
        <div className="px-3 py-2 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-base-content">활동 내역</h2>
          <div className="flex space-x-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-base-300 rounded-lg px-3 py-1 bg-base-100 text-base-content"
            >
              <option value="all">전체</option>
              <option value="course_created">강좌 생성</option>
              <option value="exam_created">시험 생성</option>
              <option value="student_enrolled">학생 수강</option>
              <option value="notice_created">공지사항</option>
              <option value="settings_updated">설정 변경</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-base-300">
          {activities
            .filter(activity => filter === 'all' || activity.type === filter)
            .map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-base-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-base-content">{activity.title}</h3>
                      <p className="text-sm text-base-content/70 mt-1">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-base-content/70">{activity.timestamp}</p>
                      <p className="text-xs text-base-content/70 mt-1">by {activity.user}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="bg-base-100 px-3 py-2 flex items-center justify-between border-t border-base-300">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-base-content/70">1-5 of {activities.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" disabled>
              이전
            </Button>
            <Button size="sm" variant="outline">
              다음
            </Button>
          </div>
        </div>
      </Card>
    </CoursePageLayout>
  )
}




