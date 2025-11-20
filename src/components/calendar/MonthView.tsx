import { WEEK_DAYS } from "../../data/calendarConstants";
import type { CalendarDay, Memo } from "../../types/calendar";
import { toKstDateString, getTodayKst } from "../../utils/calendar";

interface MonthViewProps {
  days: CalendarDay[];
  selectedDate: string | null;
  onDateClick: (dateStr: string) => void;
  getMemosForDate: (dateStr: string) => Memo[];
  onNavigateMonth?: (direction: 'prev' | 'next') => void;
  currentDate: Date;
}

export default function MonthView({
  days,
  selectedDate,
  onDateClick,
  getMemosForDate,
  onNavigateMonth,
  currentDate,
}: MonthViewProps) {
  const handleDayClick = (day: CalendarDay, dateStr: string) => {
    if (!day.isCurrentMonth && onNavigateMonth) {
      const clickedDate = day.date;
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const clickedMonth = clickedDate.getMonth();
      const clickedYear = clickedDate.getFullYear();

      // 다음달 1일 클릭 시
      if (
        (clickedYear === currentYear && clickedMonth === currentMonth + 1) ||
        (clickedYear === currentYear + 1 && clickedMonth === 0 && currentMonth === 11)
      ) {
        onNavigateMonth('next');
        // 약간의 지연 후 클릭 처리 (달력이 이동한 후)
        setTimeout(() => {
          onDateClick(dateStr);
        }, 100);
        return;
      }

      // 이전달 마지막 날 클릭 시
      if (
        (clickedYear === currentYear && clickedMonth === currentMonth - 1) ||
        (clickedYear === currentYear - 1 && clickedMonth === 11 && currentMonth === 0)
      ) {
        onNavigateMonth('prev');
        setTimeout(() => {
          onDateClick(dateStr);
        }, 100);
        return;
      }
    }

    // 현재 달의 날짜는 일반 처리
    if (day.isCurrentMonth) {
      onDateClick(dateStr);
    }
  };
  return (
    <div className="flex flex-col flex-1 gap-1">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="py-1 text-xs font-medium text-center text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid flex-1 grid-cols-7 gap-1 auto-rows-fr">
        {days.map((day, index) => {
          const dateStr = toKstDateString(day.date);
          const dayMemos = getMemosForDate(dateStr);
          const todayKst = getTodayKst();
          const isToday = dateStr === todayKst;
          const isSelected = selectedDate === dateStr;

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day, dateStr)}
              className={`h-full p-1 border border-gray-200 transition-all flex flex-col ${
                day.isCurrentMonth ? "bg-white hover:bg-blue-50 cursor-pointer" : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
              } ${isToday ? "ring-2 ring-blue-500" : ""} ${
                isSelected ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <div
                className={`flex items-center justify-between mb-1 ${
                  day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                } ${isToday ? "text-blue-600" : ""} ${
                  isSelected ? "text-purple-600" : ""
                }`}
              >
                <span className="text-xs font-medium">
                  {day.date.getDate()}
                </span>
                {dayMemos && dayMemos.length > 0 && (
                  <span className="text-[9px] font-semibold text-gray-500">
                    ({dayMemos.length})
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 mt-auto">
                {dayMemos && dayMemos.slice(0, 5).map((memo) => (
                  <div
                    key={memo.id}
                    className="w-full h-1 rounded"
                    style={{ backgroundColor: memo.color || '#3b82f6' }}
                    title={memo.title || '메모'}
                  />
                ))}
                {dayMemos && dayMemos.length > 5 && (
                  <div className="text-[8px] text-gray-500 text-right mt-0.5">
                    +{dayMemos.length - 5}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}





