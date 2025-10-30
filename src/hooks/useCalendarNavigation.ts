import { useState } from 'react'

export function useCalendarNavigation() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [expandedWeekDate, setExpandedWeekDate] = useState<string | null>(null)
  const [showDateSelector, setShowDateSelector] = useState(false)

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 7)
      } else {
        newDate.setDate(prev.getDate() + 7)
      }
      return newDate
    })
  }

  const handleDateClick = (dateStr: string) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null)
    } else {
      setSelectedDate(dateStr)
    }
  }

  const handleWeekDateClick = (dateStr: string) => {
    if (expandedWeekDate === dateStr) {
      setExpandedWeekDate(null)
    } else {
      setExpandedWeekDate(dateStr)
    }
    setSelectedDate(dateStr)
  }

  const handleViewChange = (newView: 'month' | 'week') => {
    setView(newView)
    setCurrentDate(new Date())
    setSelectedDate(null)
  }

  return {
    currentDate,
    view,
    selectedDate,
    expandedWeekDate,
    showDateSelector,
    setCurrentDate,
    setShowDateSelector,
    navigateMonth,
    navigateWeek,
    handleDateClick,
    handleWeekDateClick,
    handleViewChange,
  }
}





