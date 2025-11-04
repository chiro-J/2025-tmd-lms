// 알림 읽음 상태를 localStorage로 관리하는 유틸리티

const STORAGE_KEY = 'lms_notification_read_status'

export interface NotificationReadStatus {
  [notificationId: number]: boolean
}

export const getReadStatus = (): NotificationReadStatus => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return {}
  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export const markAsRead = (notificationId: number): void => {
  const status = getReadStatus()
  status[notificationId] = true
  localStorage.setItem(STORAGE_KEY, JSON.stringify(status))
}

export const markAllAsRead = (notificationIds: number[]): void => {
  const status = getReadStatus()
  notificationIds.forEach(id => {
    status[id] = true
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(status))
}

export const isNotificationRead = (notificationId: number): boolean => {
  const status = getReadStatus()
  return status[notificationId] || false
}
