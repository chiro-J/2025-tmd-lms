
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import MonthView from "../../components/calendar/MonthView";
import WeekView from "../../components/calendar/WeekView";
import MemoSection from "../../components/calendar/MemoSection";
import { getMonthName, getWeekRange, getDaysInMonth, getDaysInWeek } from "../../utils/calendar";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import { useMemos } from "../../hooks/useMemos";

// Mock data removed - memos are now loaded from the backend API
const initialMemos: any[] = [];

export default function Calendar() {
  const location = useLocation();
  const hasAutoSelectedRef = useRef(false);
  const {
    currentDate,
    view,
    selectedDate,
    expandedWeekDate,
    setCurrentDate,
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
    handleDeleteMemo,
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

  // Auto-select date when navigating from dashboard (only once)
  useEffect(() => {
    if (hasAutoSelectedRef.current) return;

    const state = location.state as { selectedDate?: string; openMemoForm?: boolean };
    if (state?.selectedDate) {
      const dateObj = new Date(state.selectedDate);
      // Set the current month to the selected date's month
      setCurrentDate(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1));
      // Select the date
      handleDateClick(state.selectedDate);
      // Open memo form if requested
      if (state.openMemoForm) {
        handleAddMemo(state.selectedDate);
      }
      // Mark as processed
      hasAutoSelectedRef.current = true;
      // Clear the state to prevent re-selecting on re-render
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                        <div className="flex items-center space-x-2 text-xl font-bold text-gray-900">
                          <span>{getMonthName(currentDate)}</span>
                          <CalendarIcon className="w-4 h-4" />
                        </div>
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
                    onNavigateMonth={navigateMonth}
                    currentDate={currentDate}
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
              onDeleteMemo={handleDeleteMemo}
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
    </div>
  );
}
