import { useMemo, useState } from "react";

export default function ActivityHeatmap() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    value: number;
    day: string;
    week: 'thisWeek' | 'lastWeek';
    x: number;
    y: number;
  } | null>(null);
  // Generate sample activity data for the last 12 weeks
  const activityData = useMemo(() => {
    const data: number[][] = [];
    for (let week = 0; week < 7; week++) {
      const weekData: number[] = [];
      for (let day = 0; day < 24; day++) {
        // Random activity level (0-4)
        weekData.push(Math.floor(Math.random() * 5));
      }
      data.push(weekData);
    }
    return data;
  }, []);

  // Weekly learning data (last 7 days) - in hours
  const weeklyData = useMemo(() => {
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    return {
      days,
      // 이번 주는 목요일까지만 데이터, 금토일은 null (단위: 시간)
      thisWeek: [2.5, 4.5, 3.0, 6.5, null, null, null],
      // 지난 주는 전체 데이터 (단위: 시간)
      lastWeek: [1.5, 2.5, 5.0, 3.5, 7.0, 4.5, 5.5],
    };
  }, []);

  // Color intensity based on activity level
  const getColorClass = (level: number) => {
    switch (level) {
      case 0:
        return "bg-neutral-100";
      case 1:
        return "bg-blue-200";
      case 2:
        return "bg-blue-400";
      case 3:
        return "bg-blue-600";
      case 4:
        return "bg-blue-800";
      default:
        return "bg-neutral-100";
    }
  };

  const maxValue = Math.max(
    ...weeklyData.thisWeek.filter((v): v is number => v !== null),
    ...weeklyData.lastWeek
  );

  // Calculate nice y-axis values with minimum display range
  const minDisplayMax = 10; // Minimum 10 hours for realistic LMS usage
  const yAxisMax = Math.max(Math.ceil(maxValue * 1.2), minDisplayMax); // Add 20% padding but at least 10 hours
  const yAxisStep = Math.ceil(yAxisMax / 3);
  const yAxisValues = [yAxisMax, yAxisMax - yAxisStep, yAxisMax - yAxisStep * 2, 0];

  // Calculate dates for this week and last week
  const getWeekDate = (dayIndex: number, isLastWeek: boolean) => {
    const date = new Date();
    const currentDay = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Offset to get to Monday

    date.setDate(date.getDate() + mondayOffset + dayIndex - (isLastWeek ? 7 : 0));
    return date;
  };

  const formatTooltip = (value: number, dayIndex: number, isLastWeek: boolean) => {
    const date = getWeekDate(dayIndex, isLastWeek);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);

    return {
      date: `${year}년 ${month}월 ${day}일`,
      time: `${hours}시간 ${minutes}분`
    };
  };

  return (
    <div className="p-4 space-y-6 card-panel md:p-6">
      {/* Heatmap Section */}
      <div>
        {/* Header with Legend */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold md:text-lg text-neutral-900">
            학습 활동
          </h3>

          {/* Legend */}
          <div className="flex items-center text-xs text-neutral-600">
            <span className="mr-2">적음</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-neutral-100" />
              <div className="w-3 h-3 bg-blue-200 rounded-sm" />
              <div className="w-3 h-3 bg-blue-400 rounded-sm" />
              <div className="w-3 h-3 bg-blue-600 rounded-sm" />
              <div className="w-3 h-3 bg-blue-800 rounded-sm" />
            </div>
            <span className="ml-2">많음</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="flex flex-col gap-1 overflow-x-auto">
          {activityData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((level, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`
                    w-3 h-3 md:w-4 md:h-4 rounded-sm ${getColorClass(level)}
                    hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer
                  `}
                  title={`활동 레벨: ${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Learning Chart */}
      <div>
        <div className="flex items-center justify-end mb-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-orange-500" />
              <span className="text-neutral-600">지난 주</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0.5 bg-blue-500" />
              <span className="text-neutral-600">이번 주</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          {/* Y-axis label */}
          <div className="mb-2 text-xs text-neutral-600">학습 시간 (시간)</div>

          <div className="flex">
            {/* Y-axis values */}
            <div className="flex flex-col justify-between h-32 pr-3 text-xs font-medium text-neutral-700">
              {yAxisValues.map((value, i) => (
                <span key={i} className="leading-none">{value}</span>
              ))}
            </div>

            {/* Chart area */}
            <div className="relative flex-1 h-32 border-b border-l border-neutral-400">
              <svg
                className="w-full h-full"
                viewBox="0 0 700 120"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 40}
                    x2="700"
                    y2={i * 40}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}

                {/* Last week line */}
                <polyline
                  points={weeklyData.lastWeek
                    .map(
                      (value, i) =>
                        `${i * 100 + 50},${120 - (value / yAxisMax) * 120}`
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />

                {/* This week line (only up to Thursday) */}
                <polyline
                  points={weeklyData.thisWeek
                    .map((value, i) =>
                      value !== null
                        ? `${i * 100 + 50},${120 - (value / yAxisMax) * 120}`
                        : null
                    )
                    .filter((p): p is string => p !== null)
                    .join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              </svg>

              {/* Last week data points as HTML elements */}
              {weeklyData.lastWeek.map((value, i) => {
                const left = ((i + 0.5) / 7) * 100;
                const top = 100 - (value / yAxisMax) * 100;
                return (
                  <div
                    key={`lastweek-point-${i}`}
                    className="absolute w-2 h-2 bg-white border-2 border-orange-500 rounded-full cursor-pointer hover:scale-150 transition-transform z-10"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredPoint({
                        value,
                        day: weeklyData.days[i],
                        week: 'lastWeek',
                        x: rect.left + rect.width / 2,
                        y: rect.top
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}

              {/* This week data points as HTML elements */}
              {weeklyData.thisWeek.map((value, i) =>
                value !== null ? (
                  <div
                    key={`thisweek-point-${i}`}
                    className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-pointer hover:scale-150 transition-transform z-10"
                    style={{
                      left: `${((i + 0.5) / 7) * 100}%`,
                      top: `${100 - (value / yAxisMax) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredPoint({
                        value,
                        day: weeklyData.days[i],
                        week: 'thisWeek',
                        x: rect.left + rect.width / 2,
                        y: rect.top
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ) : null
              )}
            </div>
          </div>

          {/* X-axis labels (요일만) */}
          <div className="flex justify-around mt-3 ml-10 text-xs text-neutral-600">
            {weeklyData.days.map((day, i) => (
              <div key={i} className="text-center">
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="fixed z-50 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: `${hoveredPoint.x}px`,
            top: `${hoveredPoint.y - 80}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold text-gray-900">
            {formatTooltip(
              hoveredPoint.value,
              weeklyData.days.indexOf(hoveredPoint.day),
              hoveredPoint.week === 'lastWeek'
            ).date}
          </div>
          <div className="mt-1 font-semibold text-blue-600">
            {formatTooltip(
              hoveredPoint.value,
              weeklyData.days.indexOf(hoveredPoint.day),
              hoveredPoint.week === 'lastWeek'
            ).time}
          </div>
        </div>
      )}
    </div>
  );
}
