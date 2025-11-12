import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventInfo {
  day: number;
  title: string;
  description: string;
  type: "assignment" | "exam" | "class" | "deadline";
}

export default function StudentCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const tooltipAreaRef = useRef<HTMLElement | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Sample events data (days with events/deadlines)
  // 여러 이벤트가 같은 날짜에 있을 수 있음
  const events: EventInfo[] = [
    {
      day: 4,
      title: "과제 제출",
      description: "웹 개발 기초 과제",
      type: "assignment",
    },
    { day: 4, title: "실시간 강의", description: "React 기초", type: "class" },
    {
      day: 11,
      title: "중간고사",
      description: "프로그래밍 기초",
      type: "exam",
    },
    {
      day: 18,
      title: "실시간 강의",
      description: "React 심화 학습",
      type: "class",
    },
    {
      day: 24,
      title: "프로젝트 마감",
      description: "팀 프로젝트 최종 제출",
      type: "deadline",
    },
    {
      day: 24,
      title: "과제 제출",
      description: "최종 보고서 제출",
      type: "assignment",
    },
    {
      day: 26,
      title: "과제 제출",
      description: "데이터베이스 설계",
      type: "assignment",
    },
  ];

  // Get unique dates with events
  const highlightedDates = [...new Set(events.map((e) => e.day))];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const handleDateClick = (
    day: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (highlightedDates.includes(day)) {
      setSelectedDate(day);
      setCurrentEventIndex(0); // Reset to first event
    }
  };

  const closeTooltip = () => {
    setSelectedDate(null);
    setCurrentEventIndex(0);
  };

  // Get events for selected date
  const getEventsForDate = (day: number) => {
    return events.filter((e) => e.day === day);
  };

  const handlePrevEvent = () => {
    if (selectedDate !== null) {
      const dateEvents = getEventsForDate(selectedDate);
      setCurrentEventIndex((prev) =>
        prev > 0 ? prev - 1 : dateEvents.length - 1
      );
    }
  };

  const handleNextEvent = () => {
    if (selectedDate !== null) {
      const dateEvents = getEventsForDate(selectedDate);
      setCurrentEventIndex((prev) =>
        prev < dateEvents.length - 1 ? prev + 1 : 0
      );
    }
  };

  // Find and update the tooltip area when selectedDate changes
  useEffect(() => {
    tooltipAreaRef.current = document.getElementById("calendar-tooltip-area");
  }, []);

  // Render tooltip content in the dedicated area
  useEffect(() => {
    if (!tooltipAreaRef.current) return;

    const dateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
    const selectedEvent = dateEvents[currentEventIndex];

    if (selectedDate !== null && selectedEvent && dateEvents.length > 0) {
      const progress =
        dateEvents.length > 1
          ? ((currentEventIndex + 1) / dateEvents.length) * 100
          : 100;

      tooltipAreaRef.current.innerHTML = `
        <div class="flex flex-col h-full justify-between">
          <!-- 헤더 with 페이지네이션 - 고정 높이 -->
          <div class="flex items-center justify-between mb-3 flex-shrink-0 h-6">
            <div class="flex items-center space-x-2 flex-1 min-w-0">
              <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 ${getEventTypeColor(
                selectedEvent.type
              )}"></div>
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
              <div class="inline-block px-2 py-0.5 rounded text-xs font-medium text-white ${getEventTypeColor(
                selectedEvent.type
              )}">
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
      `;

      // Add event listeners for pagination buttons
      if (dateEvents.length > 1) {
        const prevBtn = document.getElementById("prev-event-btn");
        const nextBtn = document.getElementById("next-event-btn");
        if (prevBtn) prevBtn.onclick = handlePrevEvent;
        if (nextBtn) nextBtn.onclick = handleNextEvent;
      }
    } else {
      tooltipAreaRef.current.innerHTML = `
        <div class="text-sm text-neutral-500 text-center py-8">
          날짜를 클릭하면 상세 정보가 여기에 표시됩니다
        </div>
      `;
    }
  }, [selectedDate, currentEventIndex, year, month]);

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const selectedEvent = selectedDate
    ? events.find((e) => e.day === selectedDate)
    : null;

  const getEventTypeColor = (type: EventInfo["type"]) => {
    switch (type) {
      case "assignment":
        return "bg-blue-500";
      case "exam":
        return "bg-red-500";
      case "class":
        return "bg-green-500";
      case "deadline":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEventTypeLabel = (type: EventInfo["type"]) => {
    switch (type) {
      case "assignment":
        return "과제";
      case "exam":
        return "시험";
      case "class":
        return "강의";
      case "deadline":
        return "마감";
      default:
        return "이벤트";
    }
  };

  // Generate calendar days (always 6 rows = 42 days)
  const calendarDays = [];

  // Previous month's days
  const prevMonthDays = new Date(year, month, 0).getDate();
  const prevMonthStart = prevMonthDays - firstDay + 1;

  // Previous month cells
  for (let i = 0; i < firstDay; i++) {
    const day = prevMonthStart + i;
    const dayOfWeek = i % 7;
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;

    calendarDays.push(
      <div
        key={`prev-${i}`}
        className={`
          aspect-square flex items-center justify-center text-xs font-medium rounded-lg
          text-neutral-400
          ${isSunday ? "text-red-300" : ""}
          ${isSaturday ? "text-blue-300" : ""}
        `}
      >
        {day}
      </div>
    );
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const isHighlighted = highlightedDates.includes(day);
    const dayOfWeek = (firstDay + day - 1) % 7;
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;

    calendarDays.push(
      <div
        key={`current-${day}`}
        onClick={(e) => handleDateClick(day, e)}
        className={`
          aspect-square flex items-center justify-center text-xs font-medium rounded-lg
          ${
            isToday
              ? "bg-blue-600 text-white font-bold ring-2 ring-blue-300"
              : ""
          }
          ${!isToday && isHighlighted ? "bg-blue-100 text-blue-700" : ""}
          ${!isToday && !isHighlighted && isSunday ? "text-red-500" : ""}
          ${!isToday && !isHighlighted && isSaturday ? "text-blue-500" : ""}
          ${
            !isToday && !isHighlighted && !isSunday && !isSaturday
              ? "text-neutral-700"
              : ""
          }
          ${
            isHighlighted
              ? "hover:bg-blue-200 cursor-pointer"
              : "hover:bg-neutral-100"
          }
          transition-colors
        `}
      >
        {day}
      </div>
    );
  }

  // Next month cells to fill remaining slots (always 42 total = 6 rows)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const dayOfWeek = (firstDay + daysInMonth + i - 1) % 7;
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;

    calendarDays.push(
      <div
        key={`next-${i}`}
        className={`
          aspect-square flex items-center justify-center text-xs font-medium rounded-lg
          text-neutral-400
          ${isSunday ? "text-red-300" : ""}
          ${isSaturday ? "text-blue-300" : ""}
        `}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-3 card-panel md:p-4">
      {/* Calendar Header */}
      <div className="mb-1">
        <div className="grid grid-cols-7 gap-0.5 mb-3">
          <h3
            onClick={() => navigate("/student/calendar")}
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
              ${index === 0 ? "text-red-500" : ""}
              ${index === 6 ? "text-blue-500" : ""}
              ${index !== 0 && index !== 6 ? "text-neutral-600" : ""}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5">{calendarDays}</div>

      {/* Full Calendar Button */}
      <button
        onClick={() => navigate("/student/calendar")}
        className="w-full mt-2 py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
      >
        <span>학습 일정 전체 보기</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
