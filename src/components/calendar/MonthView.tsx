import { WEEK_DAYS } from "../../data/calendarConstants";
import type { CalendarDay, Memo } from "../../types/calendar";

interface MonthViewProps {
  days: CalendarDay[];
  selectedDate: string | null;
  onDateClick: (dateStr: string) => void;
  getMemosForDate: (dateStr: string) => Memo[];
}

export default function MonthView({
  days,
  selectedDate,
  onDateClick,
  getMemosForDate,
}: MonthViewProps) {
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
          const dateStr = day.date.toISOString().split("T")[0];
          const dayMemos = getMemosForDate(dateStr);
          const isToday =
            day.date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate === dateStr;

          return (
            <div
              key={index}
              onClick={() => day.isCurrentMonth && onDateClick(dateStr)}
              className={`h-full p-1 border border-gray-200 cursor-pointer transition-all ${
                day.isCurrentMonth ? "bg-white hover:bg-blue-50" : "bg-gray-50"
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
                {dayMemos.length > 0 && (
                  <span className="text-[9px] font-semibold text-gray-500">
                    ({dayMemos.length})
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-0.5">
                {dayMemos.slice(0, 10).map((memo) => (
                  <div
                    key={memo.id}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: memo.color }}
                    title={memo.title}
                  />
                ))}
                {dayMemos.length > 10 && (
                  <div className="col-span-5 text-[8px] text-gray-500 text-right mt-0.5">
                    +{dayMemos.length - 10}
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





