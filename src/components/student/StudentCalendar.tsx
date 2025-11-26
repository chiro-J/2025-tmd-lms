import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMemos } from '../../hooks/useMemos'

interface EventInfo {
  day: number
  title: string
  description: string
  type: 'assignment' | 'exam' | 'class' | 'deadline' | 'memo'
  color?: string
}

function StudentCalendar() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const tooltipAreaRef = useRef<HTMLElement | null>(null)
  const hasAutoSelectedRef = useRef(false) // Track if we've auto-selected today

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Memoize today to prevent re-creating Date object on every render
  const today = useMemo(() => new Date(), [])

  // Load memos using the useMemos hook
  const { memos, loading } = useMemos([])

  // Mock data removed - events will be loaded from backend API
  // TODO: Fetch assignments from GET /courses/:courseId/assignments
  // TODO: Fetch exams from GET /courses/:courseId/exams (when ExamsModule is implemented)
  const assignmentEvents: EventInfo[] = []

  // Convert memos to EventInfo format for current month (memoized)
  const memoEvents = useMemo(() => {
    return memos
      .filter((memo) => {
        const memoDate = new Date(memo.date)
        return memoDate.getFullYear() === year && memoDate.getMonth() === month
      })
      .map((memo) => ({
        day: new Date(memo.date).getDate(),
        title: memo.title,
        description: memo.content,
        type: 'memo' as const,
        color: memo.color,
      }))
  }, [memos, year, month])

  // Combine all events (memoized)
  const events = useMemo(() => {
    return [...assignmentEvents, ...memoEvents]
  }, [assignmentEvents, memoEvents])

  // Get unique dates with events (memoized)
  const highlightedDates = useMemo(() => {
    return [...new Set(events.map(e => e.day))]
  }, [events])

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
    hasAutoSelectedRef.current = false // Reset auto-select flag when changing months
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
    hasAutoSelectedRef.current = false // Reset auto-select flag when changing months
  }

  const handleDateClick = useCallback((day: number, event: React.MouseEvent<HTMLDivElement>) => {
    setSelectedDate(day)
    setCurrentEventIndex(0) // Reset to first event
  }, [])

  const closeTooltip = () => {
    setSelectedDate(null)
    setCurrentEventIndex(0)
  }

  // Find and update the tooltip area when selectedDate changes
  useEffect(() => {
    tooltipAreaRef.current = document.getElementById('calendar-tooltip-area')
  }, [])

  // Get events for selected date
  const getEventsForDate = (day: number) => {
    return events.filter(e => e.day === day)
  }

  const handlePrevEvent = () => {
    if (selectedDate !== null) {
      const dateEvents = getEventsForDate(selectedDate)
      setCurrentEventIndex((prev) => (prev > 0 ? prev - 1 : dateEvents.length - 1))
    }
  }

  const handleNextEvent = () => {
    if (selectedDate !== null) {
      const dateEvents = getEventsForDate(selectedDate)
      setCurrentEventIndex((prev) => (prev < dateEvents.length - 1 ? prev + 1 : 0))
    }
  }

  // Auto-select today if it has events/memos (only once after loading is complete)
  useEffect(() => {
    if (loading || hasAutoSelectedRef.current) return // Don't auto-select while loading or if already done

    const todayDate = today.getDate()
    const todayMonth = today.getMonth()
    const todayYear = today.getFullYear()

    // Check if today is in current month and has events
    if (year === todayYear && month === todayMonth && highlightedDates.includes(todayDate)) {
      setSelectedDate(todayDate)
      hasAutoSelectedRef.current = true // Mark as auto-selected
    }
  }, [loading, highlightedDates, year, month, today])

  // Render tooltip content in the dedicated area
  useEffect(() => {
    if (!tooltipAreaRef.current) return

    const dateEvents = selectedDate ? getEventsForDate(selectedDate) : []
    const selectedEvent = dateEvents[currentEventIndex]

    if (selectedDate !== null && selectedEvent && dateEvents.length > 0) {
      const progress = dateEvents.length > 1 ? ((currentEventIndex + 1) / dateEvents.length) * 100 : 100

      // Get color for the event indicator
      const eventColorClass = getEventTypeColor(selectedEvent.type, selectedEvent.color)
      const eventColorStyle = selectedEvent.type === 'memo' && selectedEvent.color
        ? `background-color: ${selectedEvent.color};`
        : ''

      tooltipAreaRef.current.innerHTML = `
        <div class="flex flex-col h-full justify-between">
          <!-- 헤더 with 페이지네이션 - 고정 높이 -->
          <div class="flex items-center justify-between mb-3 flex-shrink-0 h-6">
            <div class="flex items-center space-x-2 flex-1 min-w-0">
              <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 ${eventColorClass}" style="${eventColorStyle}"></div>
              <div class="text-xs text-neutral-500 font-medium whitespace-nowrap">
                ${year}년 ${monthNames[month]} ${String(selectedDate).padStart(2, '0')}일
              </div>
            </div>
            <div class="flex items-center justify-end space-x-2 w-20 h-full flex-shrink-0">
              ${
                dateEvents.length > 1
                  ? `
                <button
                  id="prev-event-btn"
                  class="p-1 hover:bg-neutral-100 rounded transition-colors flex items-center justify-center"
                  aria-label="이전 이벤트"
                >
                  <svg class="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  id="next-event-btn"
                  class="p-1 hover:bg-neutral-100 rounded transition-colors flex items-center justify-center"
                  aria-label="다음 이벤트"
                >
                  <svg class="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              `
                  : ""
              }
            </div>
          </div>

          <!-- 이벤트 내용 - 상단 정렬 -->
          <div class="flex-1 flex flex-col justify-start pt-2 space-y-2.5 min-h-0 overflow-hidden">
            <div class="text-sm font-semibold text-neutral-900 line-clamp-2">
              ${selectedEvent.title}
            </div>
            <div class="h-6 flex items-center">
              <div class="inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${eventColorClass}" style="${eventColorStyle}">
                ${getEventTypeLabel(selectedEvent.type)}
              </div>
            </div>
            <div class="text-sm text-neutral-700 line-clamp-3">
              ${selectedEvent.description}
            </div>
          </div>

          <!-- 프로그레스 바 - 하단 고정 -->
          <div class="pt-3 flex-shrink-0 flex flex-col space-y-1.5">
            ${
              dateEvents.length > 1
                ? `
              <div class="flex items-center justify-between">
                <span class="text-xs text-neutral-500 font-medium">${currentEventIndex + 1}/${dateEvents.length}</span>
              </div>
              <div class="w-full bg-neutral-200 rounded-full h-1.5">
                <div class="bg-blue-600 h-full rounded-full transition-all duration-300" style="width: ${((currentEventIndex + 1) / dateEvents.length) * 100}%"></div>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `

      // Add event listeners for pagination buttons
      if (dateEvents.length > 1) {
        const prevBtn = document.getElementById('prev-event-btn')
        const nextBtn = document.getElementById('next-event-btn')
        if (prevBtn) prevBtn.onclick = handlePrevEvent
        if (nextBtn) nextBtn.onclick = handleNextEvent
      }
    } else if (selectedDate !== null) {
      // Date is selected but no events/memos
      const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`

      tooltipAreaRef.current.innerHTML = `
        <div class="flex flex-col h-full justify-center items-center space-y-4 py-8">
          <div class="text-center space-y-2">
            <div class="text-sm font-medium text-neutral-700">
              ${year}년 ${monthNames[month]} ${String(selectedDate).padStart(2, '0')}일
            </div>
            <div class="text-sm text-neutral-500">
              작성된 메모가 없습니다
            </div>
          </div>
          <button
            id="create-memo-btn"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            메모 작성하기
          </button>
        </div>
      `

      // Add event listener for create memo button
      const createBtn = document.getElementById('create-memo-btn')
      if (createBtn) {
        createBtn.onclick = () => {
          navigate('/student/calendar', {
            state: {
              selectedDate: selectedDateStr,
              openMemoForm: true
            }
          })
        }
      }
    } else {
      tooltipAreaRef.current.innerHTML = `
        <div class="text-sm text-neutral-500 text-center py-8">
          날짜를 클릭하면 상세 정보가 여기에 표시됩니다
        </div>
      `
    }
  }, [selectedDate, currentEventIndex, year, month, navigate])

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  const selectedEvent = selectedDate ? events.find(e => e.day === selectedDate) : null

  const getEventTypeColor = (type: EventInfo['type'], color?: string) => {
    if (type === 'memo' && color) {
      // For memos, use inline style instead of bg class
      return ''
    }
    switch (type) {
      case 'assignment':
        return 'bg-blue-500'
      case 'exam':
        return 'bg-red-500'
      case 'class':
        return 'bg-green-500'
      case 'deadline':
        return 'bg-orange-500'
      case 'memo':
        return 'bg-purple-500'
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
      case 'memo':
        return '메모'
      default:
        return '이벤트'
    }
  }

  // Get LED border color for event type (shadow removed)
  const getLEDStyle = (type: EventInfo['type'], color?: string) => {
    if (type === 'memo' && color) {
      // For custom memo colors, use inline style
      return {
        borderColor: color, // hex color string
        textColor: 'text-neutral-700',
        isCustom: true
      }
    }

    switch (type) {
      case 'assignment':
        return {
          borderColor: 'border-blue-500',
          textColor: 'text-blue-700',
          isCustom: false
        }
      case 'exam':
        return {
          borderColor: 'border-red-500',
          textColor: 'text-red-700',
          isCustom: false
        }
      case 'class':
        return {
          borderColor: 'border-green-500',
          textColor: 'text-green-700',
          isCustom: false
        }
      case 'deadline':
        return {
          borderColor: 'border-orange-500',
          textColor: 'text-orange-700',
          isCustom: false
        }
      case 'memo':
        return {
          borderColor: 'border-purple-500',
          textColor: 'text-purple-700',
          isCustom: false
        }
      default:
        return {
          borderColor: 'border-blue-500',
          textColor: 'text-blue-700',
          isCustom: false
        }
    }
  }

  // Generate calendar days (always 6 rows = 42 days) - memoized
  const calendarDays = useMemo(() => {
    const days = []

    // Previous month's days
    const prevMonthDays = new Date(year, month, 0).getDate()
    const prevMonthStart = prevMonthDays - firstDay + 1

    // Previous month cells
    for (let i = 0; i < firstDay; i++) {
      const day = prevMonthStart + i
      const dayOfWeek = i % 7
      const isSunday = dayOfWeek === 0
      const isSaturday = dayOfWeek === 6

      days.push(
        <div
          key={`prev-${i}`}
          className={`
            aspect-square flex items-center justify-center text-xs font-medium rounded-lg
            text-neutral-400
            ${isSunday ? 'text-red-300' : ''}
            ${isSaturday ? 'text-blue-300' : ''}
          `}
        >
          {day}
        </div>
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      // Only show highlights when not loading to prevent flickering
      const isHighlighted = !loading && highlightedDates.includes(day)
      const dayOfWeek = (firstDay + day - 1) % 7
      const isSunday = dayOfWeek === 0
      const isSaturday = dayOfWeek === 6

      // Get LED style for highlighted dates
      const dateEvents = getEventsForDate(day)
      const ledStyle = isHighlighted && dateEvents.length > 0
        ? getLEDStyle(dateEvents[0].type, dateEvents[0].color)
        : null

      // Build className and style for LED effect
      let ledClassName = ''
      let ledStyleObj: React.CSSProperties | undefined = undefined

      if (!isToday && isHighlighted && ledStyle) {
        if (ledStyle.isCustom && typeof ledStyle.borderColor === 'string') {
          // Custom color (memo with custom color) - shadow removed
          ledClassName = `border-2 ${ledStyle.textColor} hover:border-opacity-80`
          ledStyleObj = {
            borderColor: ledStyle.borderColor,
          }
        } else {
          // Standard event type - 테두리만 적용 (shadow removed)
          ledClassName = `border-2 ${ledStyle.borderColor} ${ledStyle.textColor} hover:border-opacity-80`
        }
      }

      days.push(
        <div
          key={`current-${day}`}
          onClick={(e) => handleDateClick(day, e)}
          className={`
            aspect-square flex items-center justify-center text-xs font-medium rounded-lg cursor-pointer
            ${isToday ? 'bg-yellow-50 text-neutral-900 font-bold' : ''}
            ${!isToday ? ledClassName : ''}
            ${!isToday && !isHighlighted && isSunday ? 'text-red-500' : ''}
            ${!isToday && !isHighlighted && isSaturday ? 'text-blue-500' : ''}
            ${!isToday && !isHighlighted && !isSunday && !isSaturday ? 'text-neutral-700' : ''}
            ${!isHighlighted && !isToday ? 'hover:bg-neutral-100' : ''}
            ${isToday ? 'hover:bg-yellow-100' : ''}
            transition-all duration-200
          `}
          style={!isToday ? ledStyleObj : undefined}
        >
          {day}
        </div>
      )
    }

    // Next month cells to fill remaining slots (always 42 total = 6 rows)
    const remainingCells = 42 - days.length
    for (let i = 1; i <= remainingCells; i++) {
      const dayOfWeek = (firstDay + daysInMonth + i - 1) % 7
      const isSunday = dayOfWeek === 0
      const isSaturday = dayOfWeek === 6

      days.push(
        <div
          key={`next-${i}`}
          className={`
            aspect-square flex items-center justify-center text-xs font-medium rounded-lg
            text-neutral-400
            ${isSunday ? 'text-red-300' : ''}
            ${isSaturday ? 'text-blue-300' : ''}
          `}
        >
          {i}
        </div>
      )
    }

    return days
  }, [year, month, firstDay, daysInMonth, today, highlightedDates, loading, handleDateClick])

  return (
    <div className="flex flex-col h-full p-3 card-panel md:p-4">
      {/* Calendar Header */}
      <div className="mb-1">
        <div className="grid grid-cols-7 gap-0.5 mb-3">
          <h3
            onClick={() => navigate('/student/calendar')}
            className="col-span-5 mb-1.5 text-base ml-2 font-semibold transition-colors cursor-pointer md:text-xl text-neutral-900 hover:text-blue-600 hover:underline"
          >
            {year}년 {monthNames[month]}
          </h3>
          <div className="flex items-center justify-end col-span-2 mr-2 space-x-1">
            <button
              onClick={prevMonth}
              className="p-1 transition-colors rounded-lg hover:bg-neutral-100"
              aria-label="이전 달"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-neutral-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 transition-colors rounded-lg hover:bg-neutral-100"
              aria-label="다음 달"
            >
              <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`
              text-center text-[10px] font-semibold py-1
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
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays}
      </div>

      {/* Full Calendar Button */}
      <button
        onClick={() => navigate('/student/calendar')}
        className="w-full mt-2 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
      >
        <span>학습 일정 전체 보기</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default memo(StudentCalendar)
