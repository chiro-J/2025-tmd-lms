import { Edit2 } from "lucide-react";
import { WEEK_DAYS } from "../../data/calendarConstants";
import type { CalendarDay, Memo } from "../../types/calendar";

interface WeekViewProps {
  days: CalendarDay[];
  selectedDate: string | null;
  expandedWeekDate: string | null;
  onWeekDateClick: (dateStr: string) => void;
  onEditMemo: (memo: Memo) => void;
  getMemosForDate: (dateStr: string) => Memo[];
}

export default function WeekView({
  days,
  selectedDate,
  expandedWeekDate,
  onWeekDateClick,
  onEditMemo,
  getMemosForDate,
}: WeekViewProps) {
  return (
    <div className="flex-1">
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        {/* Table Header */}
        <div className="grid grid-cols-[90px_60px_60px_1fr] bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-2.5 text-xs font-semibold text-gray-700">
            날짜
          </div>
          <div className="px-4 py-2.5 text-xs font-semibold text-gray-700">
            요일
          </div>
          <div className="px-4 py-2.5 text-xs font-semibold text-gray-700 text-center">
            개수
          </div>
          <div className="px-4 py-2.5 text-xs font-semibold text-gray-700">
            미리보기
          </div>
        </div>

        {/* Table Rows */}
        <div>
          {days.map((day, index) => {
            const dateStr = day.date.toISOString().split("T")[0];
            const dayMemos = getMemosForDate(dateStr);
            const isToday =
              day.date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate === dateStr;
            const isExpanded = expandedWeekDate === dateStr;

            return (
              <div key={index}>
                <div
                  onClick={() => onWeekDateClick(dateStr)}
                  className={`grid grid-cols-[90px_60px_60px_1fr] border-b border-gray-200 cursor-pointer transition-all hover:bg-blue-50 ${
                    isToday
                      ? "bg-blue-50"
                      : isSelected
                      ? "bg-purple-50"
                      : "bg-white"
                  }`}
                >
                  {/* Date */}
                  <div className="flex items-center px-4 py-4">
                    <span
                      className={`text-sm font-semibold ${
                        isToday
                          ? "text-blue-600"
                          : isSelected
                          ? "text-purple-600"
                          : "text-gray-900"
                      }`}
                    >
                      {day.date.getMonth() + 1}/{day.date.getDate()}
                    </span>
                  </div>

                  {/* Day of Week */}
                  <div className="flex items-center px-4 py-4">
                    <span
                      className={`text-sm font-medium ${
                        day.date.getDay() === 0
                          ? "text-red-500"
                          : day.date.getDay() === 6
                          ? "text-blue-500"
                          : "text-gray-700"
                      }`}
                    >
                      {WEEK_DAYS[day.date.getDay()]}
                    </span>
                  </div>

                  {/* Memo Count */}
                  <div className="flex items-center justify-center px-4 py-4">
                    {dayMemos.length > 0 ? (
                      <span className="px-2.5 py-0.5 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                        {dayMemos.length}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>

                  {/* Memo Preview Blocks */}
                  <div className="flex items-center px-4 py-4">
                    {dayMemos.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        {dayMemos.slice(0, 3).map((memo) => (
                          <button
                            key={memo.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditMemo(memo);
                            }}
                            className="px-2 py-1 text-[10px] font-medium text-white rounded transition-all hover:scale-105 hover:shadow-md flex-shrink-0"
                            style={{
                              backgroundColor: memo.color,
                            }}
                            title={`${memo.title || "제목 없음"}\n${
                              memo.content
                            }`}
                          >
                            <div className="max-w-[75px] truncate">
                              {memo.title || "제목 없음"}
                            </div>
                          </button>
                        ))}
                        {dayMemos.length > 3 && (
                          <span className="px-2 py-1 text-[10px] font-semibold text-gray-500 bg-gray-100 rounded flex-shrink-0">
                            +{dayMemos.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                </div>

                {/* Expanded Memo Detail */}
                {isExpanded && dayMemos.length > 0 && (
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="max-h-[130px] overflow-y-auto space-y-2 snap-y snap-mandatory">
                      {dayMemos.map((memo) => (
                        <div
                          key={memo.id}
                          className="px-3 py-2 transition-all bg-white border-l-4 rounded-lg cursor-pointer hover:shadow-sm snap-start"
                          style={{ borderLeftColor: memo.color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditMemo(memo);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1 space-x-2">
                              <div
                                className="flex-shrink-0 w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: memo.color,
                                }}
                              />
                              <h5 className="text-sm font-semibold text-gray-900">
                                {memo.title || "제목 없음"}
                              </h5>
                            </div>
                            <Edit2 className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}





