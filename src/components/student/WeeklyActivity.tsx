import { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { getWeeklyLearningData } from '../../core/api/learning';

export default function WeeklyActivity() {
  const { user } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState({
    days: ["월", "화", "수", "목", "금", "토", "일"],
    thisWeek: [0, 0, 0, 0, 0, 0, 0] as number[],
    lastWeek: [0, 0, 0, 0, 0, 0, 0] as number[],
  });

  const [hoveredDay, setHoveredDay] = useState<{
    dayIndex: number;
    day: string;
    x: number;
    y: number;
  } | null>(null);

  // 주간 학습 데이터 로드 (실제 API 호출)
  useEffect(() => {
    const loadWeeklyData = async () => {
      if (!user?.id) {
        setDataLoading(false);
        return;
      }

      try {
        setDataLoading(true);

        const data = await getWeeklyLearningData(
          typeof user.id === 'number' ? user.id : Number(user.id)
        );

        setWeeklyData(prev => ({
          ...prev,
          thisWeek: data.thisWeek,
          lastWeek: data.lastWeek
        }));
      } catch (error) {
        console.error('주간 학습 데이터 로드 실패:', error);
        // 에러 시 빈 데이터 표시
        setWeeklyData(prev => ({
          ...prev,
          thisWeek: [0, 0, 0, 0, 0, 0, 0],
          lastWeek: [0, 0, 0, 0, 0, 0, 0],
        }));
      } finally {
        setDataLoading(false);
      }
    };

    loadWeeklyData();
  }, [user?.id]);

  const maxValue = Math.max(
    ...weeklyData.thisWeek,
    ...weeklyData.lastWeek
  );

  // Calculate dynamic y-axis to center graph lines at roughly 1/2 height
  // Add ~33% padding above max value for visual balance
  const calculateYAxisMax = (max: number): number => {
    if (max === 0) return 10; // Default when no data

    // Add 33% padding so max data appears around 75% height (visually centered)
    const withPadding = max * 1.33;

    // Round to nice numbers for better readability
    if (withPadding <= 2) return 2;
    if (withPadding <= 5) return 5;
    if (withPadding <= 6) return 6;
    if (withPadding <= 10) return 10;
    if (withPadding <= 12) return 12;
    if (withPadding <= 15) return 15;
    if (withPadding <= 20) return 20;
    if (withPadding <= 24) return 24; // Maximum 24 hours (one day)

    // Cap at 24 hours (one day limit)
    return 24;
  };

  const yAxisMax = calculateYAxisMax(maxValue);
  const yAxisStep = Math.ceil(yAxisMax / 3);
  const yAxisValues = [yAxisMax, yAxisMax - yAxisStep, yAxisMax - yAxisStep * 2, 0];

  // Get current day of week (0=월, 1=화, ..., 6=일)
  const getCurrentDayOfWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    // Convert to Monday=0, Tuesday=1, ..., Sunday=6
    return currentDay === 0 ? 6 : currentDay - 1;
  };

  // Calculate dates for this week and last week
  const getWeekDate = (dayIndex: number, isLastWeek: boolean) => {
    const date = new Date();
    const currentDay = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Offset to get to Monday

    date.setDate(date.getDate() + mondayOffset + dayIndex - (isLastWeek ? 7 : 0));
    return date;
  };

  const formatTime = (value: number) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}시간 ${minutes}분`;
  };

  const formatDate = (dayIndex: number, isLastWeek: boolean) => {
    const date = getWeekDate(dayIndex, isLastWeek);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return (
    <div className="p-4 md:p-6 card-panel space-y-6 relative">
      {/* Loading Overlay */}
      {dataLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20 rounded-lg">
          <div className="text-sm text-gray-500">데이터 로딩 중...</div>
        </div>
      )}

      {/* Weekly Learning Chart Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base md:text-lg font-semibold text-neutral-900">
            주간 학습 활동
          </h3>
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
        <div className="relative" style={{ overflow: 'visible' }}>
          {/* Y-axis label */}
          <div className="mb-2 text-xs text-neutral-600">학습 시간 (시간)</div>

          <div className="flex" style={{ overflow: 'visible' }}>
            {/* Y-axis values */}
            <div className="flex flex-col justify-between pr-3 text-xs font-medium text-neutral-700" style={{ height: '120px' }}>
              {yAxisValues.map((value, i) => (
                <span key={i} className="leading-none">{value}</span>
              ))}
            </div>

            {/* Chart area */}
            <div className="relative flex-1 border-l border-b border-neutral-400" style={{ height: '120px', overflow: 'visible' }}>
              <svg
                className="w-full h-full pointer-events-none"
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
                    vectorEffect="non-scaling-stroke"
                  />
                ))}

                {/* Last week line */}
                <polyline
                  points={weeklyData.lastWeek
                    .map(
                      (value, i) =>
                        `${i * 100 + 50},${120 - ((value || 0) / yAxisMax) * 120}`
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />

                {/* This week line - only up to current day */}
                <polyline
                  points={weeklyData.thisWeek
                    .map((value, i) => {
                      const currentDayIndex = getCurrentDayOfWeek();
                      // Only show data up to current day
                      if (i > currentDayIndex) return null;
                      return `${i * 100 + 50},${120 - (value / yAxisMax) * 120}`;
                    })
                    .filter((p): p is string => p !== null)
                    .join(" ")}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Hover areas for each day - centered on data points */}
              {weeklyData.days.map((day, i) => {
                const centerX = ((i + 0.5) / 7) * 100;
                // Create a circular hover area around each point (about 30px diameter)
                return (
                  <div
                    key={`hover-area-${i}`}
                    className="absolute z-10 cursor-pointer"
                    style={{
                      left: `${centerX}%`,
                      top: '50%',
                      width: '30px',
                      height: '120px', // Full height to make it easier to hover
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseEnter={() => {
                      setHoveredDay({
                        dayIndex: i,
                        day,
                        x: centerX,
                        y: 0,
                      });
                    }}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Tooltip */}
                    {hoveredDay?.dayIndex === i && (
                      <div
                        className="absolute px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
                        style={{
                          left: '50%',
                          top: '-10px',
                          transform: 'translate(-50%, -100%)',
                        }}
                      >
                        <div className="font-semibold text-gray-900 mb-2">
                          {hoveredDay.day}요일
                        </div>

                        {/* 이번 주 */}
                        <div className="mb-1.5">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="w-3 h-0.5 bg-blue-500"></div>
                            <span className="text-gray-600 text-[11px]">이번 주</span>
                          </div>
                          <div className="font-semibold text-blue-600 ml-4">
                            {formatTime(weeklyData.thisWeek[hoveredDay.dayIndex])}
                          </div>
                          <div className="text-gray-500 text-[10px] ml-4">
                            {formatDate(hoveredDay.dayIndex, false)}
                          </div>
                        </div>

                        {/* 지난 주 */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="w-3 h-0.5 bg-orange-500"></div>
                            <span className="text-gray-600 text-[11px]">지난 주</span>
                          </div>
                          <div className="font-semibold text-orange-600 ml-4">
                            {formatTime(weeklyData.lastWeek[hoveredDay.dayIndex])}
                          </div>
                          <div className="text-gray-500 text-[10px] ml-4">
                            {formatDate(hoveredDay.dayIndex, true)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Data points overlay - below hover areas */}
              {weeklyData.lastWeek.map((value, i) => {
                const leftPercent = ((i * 100 + 50) / 700) * 100;
                const topPercent = (1 - ((value || 0) / yAxisMax)) * 100;
                return (
                  <div
                    key={`lastweek-point-${i}`}
                    className="absolute w-2 h-2 rounded-full bg-white border-2 border-orange-500 pointer-events-none"
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}

              {weeklyData.thisWeek.map((value, i) => {
                const currentDayIndex = getCurrentDayOfWeek();
                // Only show points up to current day
                if (i > currentDayIndex) return null;
                return (
                  <div
                    key={`thisweek-point-${i}`}
                    className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white pointer-events-none"
                    style={{
                      left: `${((i * 100 + 50) / 700) * 100}%`,
                      top: `${(1 - (value / yAxisMax)) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* X-axis labels (요일만) */}
          <div className="flex mt-3">
            <div className="pr-3 text-xs font-medium text-transparent select-none">
              {yAxisMax}
            </div>
            <div className="relative flex-1 text-xs text-neutral-600">
              {weeklyData.days.map((day, i) => (
                <div
                  key={i}
                  className="absolute text-center"
                  style={{
                    left: `${((i + 0.5) / 7) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
