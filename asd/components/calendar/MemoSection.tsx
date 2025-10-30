import { Plus } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import MemoForm from "./MemoForm";
import MemoList from "./MemoList";
import { getWeekRange } from "../../utils/calendar";
import type { Memo } from "../../types/calendar";

interface MemoSectionProps {
  view: "month" | "week";
  currentDate: Date;
  selectedDate: string | null;
  filteredMemos: Memo[];
  isAddingMemo: boolean;
  memoTitle: string;
  memoContent: string;
  memoDate: string;
  memoColor: string;
  showColorPicker: boolean;
  onViewChange: (view: "month" | "week") => void;
  onAddMemo: () => void;
  onEditMemo: (memo: Memo) => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onDateChange: (date: string) => void;
  onColorChange: (color: string) => void;
  onToggleColorPicker: () => void;
  onSaveMemo: () => void;
  onCancelMemo: () => void;
}

export default function MemoSection({
  view,
  currentDate,
  selectedDate,
  filteredMemos,
  isAddingMemo,
  memoTitle,
  memoContent,
  memoDate,
  memoColor,
  showColorPicker,
  onViewChange,
  onAddMemo,
  onEditMemo,
  onTitleChange,
  onContentChange,
  onDateChange,
  onColorChange,
  onToggleColorPicker,
  onSaveMemo,
  onCancelMemo,
}: MemoSectionProps) {
  const getPeriodInfo = () => {
    if (selectedDate) {
      return `${new Date(selectedDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })} 메모`;
    }
    if (view === "month") {
      return `${currentDate.getFullYear()}년 ${
        currentDate.getMonth() + 1
      }월 전체 메모`;
    }
    return `${getWeekRange(currentDate).start} - ${
      getWeekRange(currentDate).end
    } 메모`;
  };

  const getEmptyMessage = () => {
    if (selectedDate) {
      return "선택한 날짜에 메모가 없습니다.";
    }
    if (view === "month") {
      return "이번 달에 작성된 메모가 없습니다.";
    }
    return "이번 주에 작성된 메모가 없습니다.";
  };

  return (
    <Card className="flex flex-col h-[45rem] border-2 border-gray-300">
      <div className="flex flex-col h-full p-3">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between flex-shrink-0 mb-2">
          <div className="flex items-center space-x-4">
            <h3 className="text-base font-semibold text-gray-900">내 메모</h3>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => onViewChange("month")}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  view === "month"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                월간
              </button>
              <button
                onClick={() => onViewChange("week")}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  view === "week"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                주간
              </button>
            </div>
          </div>
          {!isAddingMemo && (
            <Button variant="primary" size="sm" onClick={onAddMemo}>
              <Plus className="w-4 h-4 mr-1" />
              작성
            </Button>
          )}
        </div>

        {/* Period Info */}
        <div className="flex-shrink-0 mb-2 text-xs text-gray-500">
          {getPeriodInfo()}
        </div>

        {/* Memo Input Form */}
        {isAddingMemo && (
          <MemoForm
            memoTitle={memoTitle}
            memoContent={memoContent}
            memoDate={memoDate}
            memoColor={memoColor}
            showColorPicker={showColorPicker}
            onTitleChange={onTitleChange}
            onContentChange={onContentChange}
            onDateChange={onDateChange}
            onColorChange={onColorChange}
            onToggleColorPicker={onToggleColorPicker}
            onSave={onSaveMemo}
            onCancel={onCancelMemo}
          />
        )}

        {/* Memo List */}
        <MemoList
          memos={filteredMemos}
          emptyMessage={getEmptyMessage()}
          onEditMemo={onEditMemo}
        />
      </div>
    </Card>
  );
}
