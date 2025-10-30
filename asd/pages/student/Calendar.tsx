import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { mockCalendarEvents } from "../../mocks";
import type { CalendarEvent } from "../../types";
import EventDetailModal from "../../components/modals/EventDetailModal";
import DateSelector from "../../components/calendar/DateSelector";
import MonthView from "../../components/calendar/MonthView";
import WeekView from "../../components/calendar/WeekView";
import MemoSection from "../../components/calendar/MemoSection";
import { getMonthName, getWeekRange, getDaysInMonth, getDaysInWeek } from "../../utils/calendar";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import { useMemos } from "../../hooks/useMemos";

const initialMemos = [
  {
    id: "1",
    title: "이번 주 학습 목표",
    content: "React Hooks 완전 정복하기\nTypeScript 기초 마스터",
    date: new Date().toISOString().split("T")[0],
    color: "#3B82F6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const {
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
  } = useCalendarNavigation();

  const {
    isAddingMemo,
    memoTitle,
    memoContent,
    memoDate,
    memoColor,
    showColorPicker,
    setMemoTitle,
    setMemoContent,
    setMemoDate,
    setMemoColor,
    setShowColorPicker,
    handleAddMemo,
    handleSaveMemo,
    handleEditMemo,
    handleCancelMemo,
    getMemosForDate,
    getMemosForMonth,
    getMemosForWeek,
  } = useMemos(initialMemos);

  const filteredMemos = selectedDate
    ? getMemosForDate(selectedDate)
    : view === "month"
    ? getMemosForMonth(currentDate)
    : getMemosForWeek(currentDate);

  const days = view === "month" ? getDaysInMonth(currentDate) : getDaysInWeek(currentDate);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <div className="max-w-[100%] px-4 py-3 flex-shrink-0">
        {/* Header */}
        <div className="mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-0.5">
              학습 일정
            </h1>
            <p className="text-xs text-gray-600">
              시험, 과제, 공지사항을 한눈에 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 2 Column Layout */}
      <div className="max-w-[100%] px-4 flex-1 overflow-hidden pb-3">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_1fr] gap-3 h-full">
          {/* Left Column: Calendar */}
          <div className="h-full">
            <Card className="flex flex-col h-[45rem] border-2 border-gray-300">
              <div className="flex flex-col flex-1 p-3">
                <div className="flex items-center justify-between flex-shrink-0 mb-3">
                  <div className="relative">
                    {view === "month" ? (
                      <>
                        <button
                          onClick={() => setShowDateSelector(true)}
                          className="flex items-center space-x-2 text-xl font-bold text-gray-900 transition-colors cursor-pointer hover:text-blue-600"
                        >
                          <span>{getMonthName(currentDate)}</span>
                          <CalendarIcon className="w-4 h-4" />
                        </button>

                        {showDateSelector && (
                          <DateSelector
                            currentDate={currentDate}
                            onDateSelect={setCurrentDate}
                            onClose={() => setShowDateSelector(false)}
                          />
                        )}
                      </>
                    ) : (
                      <h2 className="text-xl font-bold text-gray-900">
                        {`${currentDate.getFullYear()}년 ${
                          getWeekRange(currentDate).start
                        } - ${getWeekRange(currentDate).end}`}
                      </h2>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        view === "month"
                          ? navigateMonth("prev")
                          : navigateWeek("prev")
                      }
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      오늘
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        view === "month"
                          ? navigateMonth("next")
                          : navigateWeek("next")
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                {view === "month" ? (
                  <MonthView
                    days={days}
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                    getMemosForDate={getMemosForDate}
                  />
                ) : (
                  <WeekView
                    days={days}
                    selectedDate={selectedDate}
                    expandedWeekDate={expandedWeekDate}
                    onWeekDateClick={handleWeekDateClick}
                    onEditMemo={handleEditMemo}
                    getMemosForDate={getMemosForDate}
                  />
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Memo Section */}
          <div className="h-full">
            <MemoSection
              view={view}
              currentDate={currentDate}
              selectedDate={selectedDate}
              filteredMemos={filteredMemos}
              isAddingMemo={isAddingMemo}
              memoTitle={memoTitle}
              memoContent={memoContent}
              memoDate={memoDate}
              memoColor={memoColor}
              showColorPicker={showColorPicker}
              onViewChange={handleViewChange}
              onAddMemo={() => handleAddMemo(selectedDate || undefined)}
              onEditMemo={handleEditMemo}
              onTitleChange={setMemoTitle}
              onContentChange={setMemoContent}
              onDateChange={setMemoDate}
              onColorChange={setMemoColor}
              onToggleColorPicker={() => setShowColorPicker(!showColorPicker)}
              onSaveMemo={handleSaveMemo}
              onCancelMemo={handleCancelMemo}
            />
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
