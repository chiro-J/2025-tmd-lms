import { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { getWeeklyLearningData } from '../../core/api/learning';

export default function WeeklyActivity() {
  const { user } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState({
    days: ["월", "화", "수", "목", "금", "토", "일"],
    thisWeek: [null, null, null, null, null, null, null] as (number | null)[],
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
          thisWeek: [null, null, null, null, null, null, null],
          lastWeek: [0, 0, 0, 0, 0, 0, 0],
        }));
      } finally {
        setDataLoading(false);
      }
    };

    loadWeeklyData();
  }, [user?.id]);

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

  const formatTime = (value: number | null) => {
    if (value === null) return '데이터 없음';
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

                {/* This week line */}
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
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Hover areas for each day - MUST be above points */}
              {weeklyData.days.map((day, i) => {
                const left = (i / 7) * 100;
                const width = (1 / 7) * 100;
                return (
                  <div
                    key={`hover-area-${i}`}
                    className="absolute top-0 bottom-0 z-10"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                    onMouseEnter={() => {
                      setHoveredDay({
                        dayIndex: i,
                        day,
                        x: ((i + 0.5) / 7) * 100,
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

              {weeklyData.thisWeek.map((value, i) =>
                value !== null ? (
                  <div
                    key={`thisweek-point-${i}`}
                    className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white pointer-events-none"
                    style={{
                      left: `${((i * 100 + 50) / 700) * 100}%`,
                      top: `${(1 - (value / yAxisMax)) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ) : null
              )}
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
