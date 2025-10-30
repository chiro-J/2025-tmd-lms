export interface Memo {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD format
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export interface WeekRange {
  start: string;
  end: string;
}

export interface ColorOption {
  name: string;
  value: string;
}
