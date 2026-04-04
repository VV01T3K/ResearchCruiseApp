// Calendar types for AppCalendar and related components

export type CalendarEvent = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  link?: string;
  color?: string;
};

export type CalendarEventWithRow = CalendarEvent & { row: number };

export type CalendarEventDropPayload = {
  event: CalendarEvent;
  sourceDate: Date;
  targetDate: Date;
  nextStart: Date;
  nextEnd: Date;
};
