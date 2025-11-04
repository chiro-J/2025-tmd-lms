import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface EventInfo {
  day: number
  title: string
  description: string
  type: 'assignment' | 'exam' | 'class' | 'deadline'
}

export default function StudentCalendar() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; preferTop: boolean } | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  // Sample events data (days with events/deadlines)
  const events: EventInfo[] = [
    { day: 4, title: '과제 제출', description: '웹 개발 기초 과제', type: 'assignment' },
    { day: 11, title: '중간고사', description: '프로그래밍 기초', type: 'exam' },
    { day: 18, title: '실시간 강의', description: 'React 심화 학습', type: 'class' },
    { day: 24, title: '프로젝트 마감', description: '팀 프로젝트 최종 제출', type: 'deadline' },
    { day: 26, title: '과제 제출', description: '데이터베이스 설계', type: 'assignment' },
  ]

  const highlightedDates = events.map(e => e.day)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
  }

  const handleDateClick = (day: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (highlightedDates.includes(day)) {
      const rect = event.currentTarget.getBoundingClientRect()
      const calendarRect = calendarRef.current?.getBoundingClientRect()

      if (calendarRect) {
        // Calculate position relative to calendar container
        const x = rect.left - calendarRect.left + rect.width / 2
        const y = rect.bottom - calendarRect.top

        // Check if there's enough space below, otherwise show above
        const spaceBelow = window.innerHeight - rect.bottom
        const preferTop = spaceBelow < 250

        setTooltipPosition({
          x,
          y: preferTop ? rect.top - calendarRect.top : y,
          preferTop
        })
      }
      setSelectedDate(day)
    }
  }

  const closeTooltip = () => {
    setSelectedDate(null)
    setTooltipPosition(null)
  }

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        closeTooltip()
      }
    }

    if (selectedDate !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedDate])

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]

  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const selectedEvent = selectedDate ? events.find(e => e.day === selectedDate) : null

  const getEventTypeColor = (type: EventInfo['type']) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-500'
      case 'exam':
        return 'bg-red-500'
      case 'class':
        return 'bg-green-500'
      case 'deadline':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getEventTypeLabel = (type: EventInfo['type']) => {
    switch (type) {
      case 'assignment':
        return '과제'
      case 'exam':
        return '시험'
      case 'class':
        return '강의'
      case 'deadline':
        return '마감'
      default:
        return '이벤트'
    }
  }

  // Generate calendar days - Always show 6 weeks (42 days)
  const calendarDays = []
  const totalCells = 42 // 6 weeks * 7 days

  // Previous month's days
  const prevMonthDays = new Date(year, month, 0).getDate()

  // Empty cells for days before month starts (show previous month's dates)
  for (let i = 0; i < firstDay; i++) {
    const prevDay = prevMonthDays - firstDay + i + 1
    const dayOfWeek = i % 7
    const isSunday = dayOfWeek === 0
    const isSaturday = dayOfWeek === 6

    calendarDays.push(
      <div
        key={`prev-${i}`}
        className={`
          aspect-square flex items-center justify-center text-sm font-medium rounded-lg
          ${isSunday ? 'text-red-400' : ''}
          ${isSaturday ? 'text-blue-400' : ''}
          ${!isSunday && !isSaturday ? 'text-neutral-400' : ''}
        `}
      >
        {prevDay}
      </div>
    )
  }

  // Days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    const isHighlighted = highlightedDates.includes(day)
    const isSunday = (firstDay + day - 1) % 7 === 0
    const isSaturday = (firstDay + day - 1) % 7 === 6

    calendarDays.push(
      <div
        key={day}
        onClick={(e) => handleDateClick(day, e)}
        className={`
          aspect-square flex items-center justify-center text-sm font-medium rounded-lg
          ${isToday ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-300' : ''}
          ${!isToday && isHighlighted ? 'bg-blue-100 text-blue-700' : ''}
          ${!isToday && !isHighlighted && isSunday ? 'text-red-500' : ''}
          ${!isToday && !isHighlighted && isSaturday ? 'text-blue-500' : ''}
          ${!isToday && !isHighlighted && !isSunday && !isSaturday ? 'text-neutral-700' : ''}
          ${isHighlighted ? 'hover:bg-blue-200 cursor-pointer' : 'hover:bg-neutral-100'}
          transition-colors
        `}
      >
        {day}
      </div>
    )
  }

  // Fill remaining cells with next month's days
  const remainingCells = totalCells - calendarDays.length
  for (let i = 1; i <= remainingCells; i++) {
    const dayOfWeek = (firstDay + daysInMonth + i - 1) % 7
    const isSunday = dayOfWeek === 0
    const isSaturday = dayOfWeek === 6

    calendarDays.push(
      <div
        key={`next-${i}`}
        className={`
          aspect-square flex items-center justify-center text-sm font-medium rounded-lg
          ${isSunday ? 'text-red-400' : ''}
          ${isSaturday ? 'text-blue-400' : ''}
          ${!isSunday && !isSaturday ? 'text-neutral-400' : ''}
        `}
      >
        {i}
      </div>
    )
  }

  return (
    <div ref={calendarRef} className="card-panel p-4 md:p-6 relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          onClick={() => navigate('/student/calendar')}
          className="text-base md:text-lg font-semibold text-neutral-900 cursor-pointer hover:text-blue-600 hover:underline transition-colors"
        >
          {year}년 {monthNames[month]}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="이전 달"
          >
            <ChevronLeft className="h-4 w-4 text-neutral-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="다음 달"
          >
            <ChevronRight className="h-4 w-4 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`
              text-center text-xs font-semibold py-2
              ${index === 0 ? 'text-red-500' : ''}
              ${index === 6 ? 'text-blue-500' : ''}
              ${index !== 0 && index !== 6 ? 'text-neutral-600' : ''}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>

      {/* Full Calendar Button */}
      <button
        onClick={() => navigate('/student/calendar')}
        className="w-full mt-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <span>학습 일정 전체 보기</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Tooltip Popup */}
      {selectedDate !== null && selectedEvent && tooltipPosition && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 bg-white rounded-lg shadow-xl border border-neutral-200 w-64 ${
            tooltipPosition.preferTop ? 'mb-2' : 'mt-2'
          }`}
          style={{
            left: `${tooltipPosition.x}px`,
            top: tooltipPosition.preferTop ? 'auto' : `${tooltipPosition.y}px`,
            bottom: tooltipPosition.preferTop ? `calc(100% - ${tooltipPosition.y}px)` : 'auto',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-neutral-200 rotate-45 ${
              tooltipPosition.preferTop
                ? 'bottom-[-6px] border-r border-b'
                : 'top-[-6px] border-l border-t'
            }`}
          />

          {/* Tooltip Header */}
          <div className="relative flex items-start justify-between p-3 border-b border-neutral-200">
            <div className="flex items-center space-x-2">
              <div className={`w-2.5 h-2.5 rounded-full ${getEventTypeColor(selectedEvent.type)}`} />
              <div>
                <div className="text-xs text-neutral-500 font-medium">
                  {year}년 {monthNames[month]} {selectedDate}일
                </div>
                <div className="text-sm font-semibold text-neutral-900 mt-0.5">
                  {selectedEvent.title}
                </div>
              </div>
            </div>
            <button
              onClick={closeTooltip}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Tooltip Body */}
          <div className="p-3 space-y-2.5">
            <div>
              <div className="text-xs font-semibold text-neutral-500 mb-1">유형</div>
              <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${getEventTypeColor(selectedEvent.type)}`}>
                {getEventTypeLabel(selectedEvent.type)}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-500 mb-1">설명</div>
              <div className="text-sm text-neutral-700">
                {selectedEvent.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

