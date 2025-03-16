import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppCalendarTile } from '@/core/components/calendar/AppCalendarTile';
import { AppMonthPickerPopover } from '@/core/components/inputs/dates/AppMonthPickerPopover';
import { dateToUtcDay, getDaysInMonth, months, weekDays } from '@/core/lib/calendarUtils';

function assignEventsToRows(events: CalendarEvent[]): CalendarEventWithRow[] {
  const eventsWithRows = events.map((event) => ({ ...event, row: 0 }));
  eventsWithRows.sort((a, b) => dateToUtcDay(a.start) - dateToUtcDay(b.start));
  for (let i = 0; i < eventsWithRows.length; i++) {
    const event = eventsWithRows[i];
    let row = 0;
    while (eventsWithRows.slice(0, i).some((other) => other.row === row && isOverlapping(event, other))) {
      row++;
    }
    eventsWithRows[i].row = row;
  }
  return eventsWithRows;
}

function isOverlapping(a: CalendarEvent, b: CalendarEvent): boolean {
  return dateToUtcDay(a.start) <= dateToUtcDay(b.end) && dateToUtcDay(a.end) >= dateToUtcDay(b.start);
}

type Props = {
  events: CalendarEvent[];
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
};
export function AppCalendar({ events, buttons }: Props) {
  const [currentMonth, setCurrentMonth] = React.useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [previousMonth, setPreviousMonth] = React.useState(currentMonth);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const [tileWidth, setTileWidth] = React.useState(0);

  function updateTileWidth() {
    const calendarWidth = calendarRef.current?.offsetWidth ?? 700;
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setTileWidth(calendarWidth / 7);
  }

  React.useEffect(() => {
    updateTileWidth();
  }, [calendarRef.current?.clientWidth]);

  React.useEffect(() => {
    window.addEventListener('resize', updateTileWidth);
    return () => {
      window.removeEventListener('resize', updateTileWidth);
    };
  }, []);

  const eventsWithRows = React.useMemo(() => assignEventsToRows(events), [events]);

  const defaultButtons = [
    <AppButton
      key="today"
      onClick={() => setCurrentMonth({ month: new Date().getMonth(), year: new Date().getFullYear() })}
    >
      Wróć do obecnego miesiąca
    </AppButton>,
  ];

  function handleMonthChange(delta: 1 | -1) {
    const newYear = currentMonth.year;
    const newMonth = currentMonth.month + delta;
    setPreviousMonth(currentMonth);
    if (newMonth < 0) {
      setCurrentMonth({ month: 11, year: newYear - 1 });
      return;
    }
    if (newMonth > 11) {
      setCurrentMonth({ month: 0, year: newYear + 1 });
      return;
    }
    setCurrentMonth({ month: newMonth, year: newYear });
  }

  const animateDirection =
    currentMonth.year * 12 + currentMonth.month > previousMonth.year * 12 + previousMonth.month ? 'right' : 'left';

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex justify-center items-center w-full">
        <AppButton variant="plain" onClick={() => handleMonthChange(-1)}>
          <ChevronLeftIcon className="w-8 h-8" />
        </AppButton>
        <AppMonthPickerPopover
          value={currentMonth}
          onChange={setCurrentMonth}
          renderDate={({ month, year }) => (
            <div className="text-2xl text-center w-50">
              {months[month]} {year}
            </div>
          )}
        />

        <AppButton variant="plain" onClick={() => handleMonthChange(1)}>
          <ChevronRightIcon className="w-8 h-8" />
        </AppButton>
      </div>
      <div className="flex justify-end flex-wrap gap-4 my-4">{buttons?.(defaultButtons) ?? defaultButtons}</div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentMonth.month + currentMonth.year * 12}
          initial={{ opacity: 0, scaleX: 0, transformOrigin: animateDirection === 'left' ? '0% 50%' : '100% 50%' }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0, transformOrigin: animateDirection === 'left' ? '0% 50%' : '100% 50%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div ref={calendarRef} className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center truncate">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentMonth).map((date) => (
              <AppCalendarTile
                date={date}
                eventsWithRows={eventsWithRows}
                currentMonth={currentMonth}
                tileWidth={tileWidth}
                key={date.toString()}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;

  link?: string;
};

export type CalendarEventWithRow = CalendarEvent & { row: number };
