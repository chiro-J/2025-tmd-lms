import type { CalendarDay, WeekRange } from "../types/calendar";

/**
 * Date 객체를 KST 기준 YYYY-MM-DD 문자열로 변환
 */
export const toKstDateString = (date: Date | string): string => {
  if (typeof date === 'string') {
    // 이미 문자열인 경우 그대로 반환 (YYYY-MM-DD 형식 가정)
    return date
  }

  // KST 기준으로 날짜 계산
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * KST 기준으로 오늘 날짜 문자열 반환
 */
export const getTodayKst = (): string => {
  return toKstDateString(new Date())
}

export const getMonthName = (date: Date) => {
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
};

export const getWeekRange = (date: Date): WeekRange => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // Go to Sunday of current week

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Saturday of current week

  return {
    start: start.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    }),
    end: end.toLocaleDateString("ko-KR", { month: "long", day: "numeric" }),
  };
};

export const getDaysInWeek = (date: Date): CalendarDay[] => {
  const days = [];
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay()); // Go to Sunday

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    days.push({ date: currentDate, isCurrentMonth: true });
  }

  return days;
};

export const getDaysInMonth = (date: Date): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Previous month's trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push({ date: prevDate, isCurrentMonth: false });
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    days.push({ date: currentDate, isCurrentMonth: true });
  }

  // Next month's leading days
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const nextDate = new Date(year, month + 1, day);
    days.push({ date: nextDate, isCurrentMonth: false });
  }

  return days;
};





