import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { mockNotifications, mockInstructorNotifications } from '../mocks'
import { markAsRead, markAllAsRead, isNotificationRead } from '../utils/notificationStorage'
import type { Notification } from '../types'

const ITEMS_PER_PAGE = 10

export default function Notifications() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE)

  // 알림 데이터 로드 (읽음 상태 반영)
  useEffect(() => {
    if (user) {
      const baseNotifications = user.role === 'instructor'
        ? mockInstructorNotifications
        : mockNotifications

      // localStorage의 읽음 상태를 반영
      const notificationsWithReadStatus = baseNotifications.map(notification => ({
        ...notification,
        read: isNotificationRead(notification.id)
      }))

      setNotifications(notificationsWithReadStatus)
    }
  }, [user])

  const handleNotificationClick = (notification: Notification) => {
    // localStorage에 읽음 상태 저장
    markAsRead(notification.id)

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
    // localStorage에 모든 알림을 읽음 처리
    markAllAsRead(notifications.map(n => n.id))
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleLoadMore = () => {
    setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, notifications.length))
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
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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

  const displayedNotifications = notifications.slice(0, displayedCount)
  const hasMore = displayedCount < notifications.length
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">알림</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500">{unreadCount}개의 읽지 않은 알림</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                모두 읽음 처리
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">알림이 없습니다</h3>
            <p className="text-gray-500">새로운 알림이 도착하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
            {displayedNotifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <span className="text-2xl flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`text-sm font-semibold ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1.5"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span>{formatTimeAgo(notification.createdAt)}</span>
                      {notification.courseTitle && (
                        <>
                          <span>•</span>
                          <span className="text-gray-500">{notification.courseTitle}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
            >
              더 보기 ({notifications.length - displayedCount}개 남음)
            </button>
          </div>
        )}

        {/* 모두 로드됨 메시지 */}
        {!hasMore && notifications.length > ITEMS_PER_PAGE && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">모든 알림을 확인했습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
