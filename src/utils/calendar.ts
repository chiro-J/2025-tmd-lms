import type { CalendarDay, WeekRange } from "../types/calendar";

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





