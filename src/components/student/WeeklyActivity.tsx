import { useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
// import { getWeeklyLearningData } from '../../core/api/learning'; // API 비활성화

export default function WeeklyActivity() {
  const { user } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState({
    days: ["월", "화", "수", "목", "금", "토", "일"],
    thisWeek: [null, null, null, null, null, null, null] as (number | null)[],
    lastWeek: [0, 0, 0, 0, 0, 0, 0] as number[],
  });

  const [hoveredPoint, setHoveredPoint] = useState<{
    value: number;
    day: string;
    week: 'thisWeek' | 'lastWeek';
    x: number;
    y: number;
  } | null>(null);

  // 주간 학습 데이터 로드 (API 비활성화 - mock 데이터만 표시)
  useEffect(() => {
    // API 호출 비활성화 - mock 데이터만 표시
    setDataLoading(true);

    // Mock 데이터 설정
    setTimeout(() => {
      setWeeklyData({
        days: ["월", "화", "수", "목", "금", "토", "일"],
        thisWeek: [2.5, 4.5, 3.0, 6.5, null, null, null],
        lastWeek: [1.5, 2.5, 5.0, 3.5, 7.0, 4.5, 5.5],
      });
      setDataLoading(false);
    }, 300); // 로딩 애니메이션을 위한 짧은 딜레이

    // API 호출 비활성화
    // const loadWeeklyData = async () => {
    //   if (!user?.id) {
    //     setDataLoading(false);
    //     return;
    //   }

    //   try {
    //     setDataLoading(true);
    //     const data = await getWeeklyLearningData(
    //       typeof user.id === 'number' ? user.id : Number(user.id)
    //     );

    //     setWeeklyData(prev => ({
    //       ...prev,
    //       thisWeek: data.thisWeek,
    //       lastWeek: data.lastWeek
    //     }));
    //   } catch (error) {
    //     // API가 구현되지 않았으므로 조용히 처리 (404 오류는 무시)
    //     // console.error('주간 학습 데이터 로드 실패:', error);
    //     // 에러 시 mock 데이터로 폴백
    //     setWeeklyData(prev => ({
    //       ...prev,
    //       thisWeek: [2.5, 4.5, 3.0, 6.5, null, null, null],
    //       lastWeek: [1.5, 2.5, 5.0, 3.5, 7.0, 4.5, 5.5],
    //     }));
    //   } finally {
    //     setDataLoading(false);
    //   }
    // };

    // loadWeeklyData();
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
