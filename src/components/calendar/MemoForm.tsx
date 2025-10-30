import { useRef } from "react";
import { createPortal } from "react-dom";
import { Save, X } from "lucide-react";
import Button from "../ui/Button";
import { COLORS } from "../../data/calendarConstants";

interface MemoFormProps {
  memoTitle: string;
  memoContent: string;
  memoDate: string;
  memoColor: string;
  showColorPicker: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onDateChange: (date: string) => void;
  onColorChange: (color: string) => void;
  onToggleColorPicker: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function MemoForm({
  memoTitle,
  memoContent,
  memoDate,
  memoColor,
  showColorPicker,
  onTitleChange,
  onContentChange,
  onDateChange,
  onColorChange,
  onToggleColorPicker,
  onSave,
  onCancel,
}: MemoFormProps) {
  const colorButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex-shrink-0 p-4 mb-3 border border-gray-200 rounded-lg bg-gray-50">
      <input
        type="text"
        placeholder="메모 제목"
        value={memoTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Date Picker */}
      <div className="mb-3">
        <label className="block mb-1.5 text-xs font-medium text-gray-700">
          날짜
        </label>
        <input
          type="date"
          value={memoDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Color Picker */}
      <div className="mb-3">
        <label className="block mb-1.5 text-xs font-medium text-gray-700">
          색상
        </label>
        <div className="relative inline-block">
          <button
            ref={colorButtonRef}
            onClick={onToggleColorPicker}
            className="w-8 h-8 transition-all border-2 border-gray-300 rounded-full shadow-sm hover:scale-110"
            style={{ backgroundColor: memoColor }}
            title="색상 선택"
          />
          {showColorPicker &&
            colorButtonRef.current &&
            createPortal(
              <div
                style={{
                  position: "fixed",
                  top: `${
                    colorButtonRef.current.getBoundingClientRect().top - 8
                  }px`,
                  left: `${
                    colorButtonRef.current.getBoundingClientRect().right + 12
                  }px`,
                  zIndex: 9999,
                }}
                className="p-2 bg-white border border-gray-200 rounded-lg shadow-xl"
              >
                <div className="flex flex-col gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        onColorChange(color.value);
                        onToggleColorPicker();
                      }}
                      className={`w-8 h-8 rounded-full transition-all ${
                        memoColor === color.value
                          ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>

      <textarea
        placeholder="메모 내용을 입력하세요..."
        value={memoContent}
        onChange={(e) => onContentChange(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 mb-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-3.5 w-3.5 mr-1" />
          취소
        </Button>
        <Button variant="primary" size="sm" onClick={onSave}>
          <Save className="h-3.5 w-3.5 mr-1" />
          저장
        </Button>
      </div>
    </div>
  );
}






