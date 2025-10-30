import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MONTH_NAMES_SHORT } from "../../data/calendarConstants";

interface DateSelectorProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export default function DateSelector({
  currentDate,
  onDateSelect,
  onClose,
}: DateSelectorProps) {
  const [selectorStep, setSelectorStep] = useState<"year" | "month">("year");
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [yearRangeStart, setYearRangeStart] = useState(
    currentDate.getFullYear() - 4
  );
  const [yearSlideDirection, setYearSlideDirection] = useState<
    "left" | "right"
  >("left");
  const dateSelectorRef = useRef<HTMLDivElement>(null);

  const yearRange = Array.from({ length: 10 }, (_, i) => yearRangeStart + i);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setSelectorStep("month");
  };

  const handleMonthSelect = (monthIndex: number) => {
    onDateSelect(new Date(selectedYear, monthIndex, 1));
    onClose();
  };

  const handlePrevYearRange = () => {
    setYearSlideDirection("right");
    setYearRangeStart((prev) => prev - 10);
  };

  const handleNextYearRange = () => {
    setYearSlideDirection("left");
    setYearRangeStart((prev) => prev + 10);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateSelectorRef.current &&
        !dateSelectorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dateSelectorRef}
      className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[320px] animate-fadeIn"
      style={{
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      {selectorStep === "year" ? (
        <div
          key={yearRangeStart}
          style={{
            animation: `slideIn${
              yearSlideDirection === "left" ? "Left" : "Right"
            } 0.2s ease-out`,
          }}
        >
          {/* Header with Navigation and Close */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevYearRange}
                className="p-1.5 text-gray-600 hover:text-blue-600 transition-all hover:scale-110"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-semibold text-gray-700 min-w-[110px] text-center">
                {yearRange[0]} - {yearRange[9]}
              </h3>
              <button
                onClick={handleNextYearRange}
                className="p-1.5 text-gray-600 hover:text-blue-600 transition-all hover:scale-110"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-all hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Year Grid */}
          <div className="grid grid-cols-5 gap-2">
            {yearRange.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 ${
                  year === currentDate.getFullYear()
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            animation: "slideInRight 0.2s ease-out",
          }}
        >
          {/* Header with Year and Close */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-sm font-semibold text-gray-700">
                {selectedYear}년
              </h3>
              <button
                onClick={() => setSelectorStep("year")}
                className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                ← 연도 변경
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-all hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Month Grid */}
          <div className="grid grid-cols-4 gap-2">
            {MONTH_NAMES_SHORT.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={`py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 ${
                  index === currentDate.getMonth() &&
                  selectedYear === currentDate.getFullYear()
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
