import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { mockNotifications, mockInstructorNotifications } from '../../mocks'
import type { Notification } from '../../types'
import * as adminApi from '../../core/api/admin'
import Card from '../../components/ui/Card'

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
    // 알림 목록 새로고침을 위해 페이지 리로드
    window.location.reload()
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">시스템 공지사항 알림 설정</h3>
      <p className="text-sm text-gray-600 mb-4">
        중요도가 "높음"인 공지사항은 항상 알림을 받습니다.
        토글을 활성화(파란색)하면 모든 공지사항 알림을 받고, 비활성화(회색)하면 중요 공지사항만 받습니다.
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {blockNotifications ? '일반 공지사항 알림 수신 거부 (중요 공지사항만 수신)' : '모든 공지사항 알림 수신 허용'}
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            blockNotifications ? 'bg-gray-300' : 'bg-blue-600'
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

export default function Notifications() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const userId = typeof user?.id === 'number' ? user.id : (typeof user?.id === 'string' ? parseInt(user.id, 10) : 0)
  const [blockNotifications, setBlockNotifications] = useState(false)

  // 알림 설정 로드
  useEffect(() => {
    if (user) {
      const savedBlockNotifications = localStorage.getItem(`block_system_notifications_${userId}`)
      if (savedBlockNotifications) {
        setBlockNotifications(JSON.parse(savedBlockNotifications))
      }
    }
  }, [user, userId])

  // 알림 데이터 로드
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // 기본 알림 로드
        let baseNotifications: Notification[] = []
        if (user.role === 'instructor') {
          baseNotifications = mockInstructorNotifications
        } else {
          baseNotifications = mockNotifications
        }

        // 시스템 공지사항 로드 (수강생과 강의자만)
        if (user.role === 'student' || user.role === 'instructor') {
          const userId = typeof user.id === 'number' ? user.id : (typeof user.id === 'string' ? parseInt(user.id, 10) : 1)
          const savedBlockNotifications = localStorage.getItem(`block_system_notifications_${userId}`)
          const blockNotifications = savedBlockNotifications
            ? JSON.parse(savedBlockNotifications)
            : false

          const systemNotices = await adminApi.getNotices()

          // 활성 상태인 공지사항만 필터링
          // blockNotifications가 true(회색, 비활성화)면 "높음" 중요도만, false(파란색, 활성화)면 모두 포함
          const filteredNotices = systemNotices.filter(notice => {
            if (notice.status !== 'active') return false
            if (blockNotifications) {
              // 알림 차단 활성화(회색) → 높음 중요도만
              return notice.priority === 'high'
            }
            // 알림 차단 비활성화(파란색) → 모두 포함
            return true
          })

          // 시스템 공지사항을 Notification 타입으로 변환
          const systemNotifications: Notification[] = filteredNotices.map(notice => ({
            id: notice.id + 10000, // 시스템 공지사항 ID는 10000 이상으로 구분
            type: 'announcement',
            title: notice.title,
            message: notice.content.length > 100
              ? notice.content.substring(0, 100) + '...'
              : notice.content,
            createdAt: notice.createdDate || new Date().toISOString(),
            read: false,
            link: '/student/notice',
            courseId: undefined,
            courseTitle: undefined
          }))

          // 기본 알림과 시스템 공지사항 합치기 (최신순으로 정렬)
          const allNotifications = [...baseNotifications, ...systemNotifications]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

          setNotifications(allNotifications)
        } else {
          // 관리자는 기본 알림만
          setNotifications(baseNotifications)
        }
      } catch (error) {
        console.error('알림 로드 실패:', error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [user])

  const handleNotificationClick = (notification: Notification) => {
    // 읽음 처리
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )

    // 링크로 이동
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return '📝'
      case 'exam':
        return '📋'
      case 'question':
        return '❓'
      case 'review':
        return '⭐'
      case 'notice':
        return '📢'
      case 'announcement':
        return '🔔'
      default:
        return '🔔'
    }
  }

  const getNotificationTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return '과제'
      case 'exam':
        return '시험'
      case 'question':
        return '질문'
      case 'review':
        return '리뷰'
      case 'notice':
        return '공지'
      case 'announcement':
        return '시스템 공지'
      default:
        return '알림'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">알림을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          {/* 알림 설정 카드 */}
          {user && (user.role === 'student' || user.role === 'instructor') && (
            <NotificationSettingsCard
              userId={userId}
              blockNotifications={blockNotifications}
              setBlockNotifications={setBlockNotifications}
            />
          )}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>뒤로가기</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">알림 전체 보기</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 읽었습니다'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <CheckCircle className="h-4 w-4" />
                <span>모두 읽음 처리</span>
              </button>
            )}
          </div>
        </div>

        {/* 알림 목록 */}
        <Card className="p-0 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">알림이 없습니다</p>
              <p className="text-gray-400 text-sm mt-2">새로운 알림이 오면 여기에 표시됩니다</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            notification.type === 'announcement'
                              ? 'bg-red-100 text-red-700'
                              : notification.type === 'assignment'
                              ? 'bg-blue-100 text-blue-700'
                              : notification.type === 'exam'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <h3 className={`text-base font-semibold mb-1 ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.courseTitle && (
                        <p className="text-xs text-gray-400 mt-1">
                          강좌: {notification.courseTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

