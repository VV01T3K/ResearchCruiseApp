import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
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
  onEventDrop?: (payload: CalendarEventDropPayload) => Promise<void> | void;
};
export function AppCalendar({ events, buttons, onEventDrop }: Props) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const [currentMonth, setCurrentMonth] = React.useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [previousMonth, setPreviousMonth] = React.useState(currentMonth);
  const [dropPreviewDays, setDropPreviewDays] = React.useState<number[]>([]);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const [tileWidth, setTileWidth] = React.useState(0);

  function updateTileWidth() {
    const calendarWidth = calendarRef.current?.offsetWidth ?? 700;
    // oxlint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setTileWidth(calendarWidth / 7);
  }

  React.useEffect(() => {
    updateTileWidth();
  }, []);

  React.useEffect(() => {
    window.addEventListener('resize', updateTileWidth);
    return () => {
      window.removeEventListener('resize', updateTileWidth);
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  function getDayNumberFromDropId(dropId: string): number | undefined {
    if (!dropId.startsWith('calendar-day-')) {
      return undefined;
    }
    const parsedDay = Number(dropId.replace('calendar-day-', ''));
    return Number.isFinite(parsedDay) ? parsedDay : undefined;
  }

  function getVisibleSpanDays(calendarEvent: CalendarEvent): number {
    const startDayUtc = dateToUtcDay(calendarEvent.start);
    const endAtMidnight = calendarEvent.end.getHours() === 0 && calendarEvent.end.getMinutes() === 0;
    const endDayUtc = dateToUtcDay(calendarEvent.end) - (endAtMidnight ? DAY_MS : 0);
    return Math.max(1, Math.floor((endDayUtc - startDayUtc) / DAY_MS) + 1);
  }

  function buildDropPreview(activeEventId: string, sourceDayUtc: number, targetDayUtc: number): number[] {
    const draggedEvent = events.find((calendarEvent) => calendarEvent.id === activeEventId);
    if (!draggedEvent) {
      return [];
    }

    const startDayUtc = dateToUtcDay(draggedEvent.start);
    const anchorOffset = Math.floor((sourceDayUtc - startDayUtc) / DAY_MS);
    const previewStartDayUtc = targetDayUtc - anchorOffset * DAY_MS;
    const spanDays = getVisibleSpanDays(draggedEvent);

    return Array.from({ length: spanDays }, (_, index) => previewStartDayUtc + index * DAY_MS);
  }

  function handleDragStart(event: DragStartEvent) {
    if (!onEventDrop) {
      return;
    }

    const { eventId, sourceDayUtc } = event.active.data.current ?? {};
    if (typeof eventId !== 'string' || typeof sourceDayUtc !== 'number') {
      setDropPreviewDays([]);
      return;
    }

    setDropPreviewDays(buildDropPreview(eventId, sourceDayUtc, sourceDayUtc));
  }

  function handleDragOver(event: DragOverEvent) {
    if (!onEventDrop || !event.over?.id) {
      setDropPreviewDays([]);
      return;
    }

    const { eventId, sourceDayUtc } = event.active.data.current ?? {};
    if (typeof eventId !== 'string' || typeof sourceDayUtc !== 'number') {
      setDropPreviewDays([]);
      return;
    }

    const targetDayUtc = getDayNumberFromDropId(String(event.over.id));
    if (targetDayUtc === undefined) {
      setDropPreviewDays([]);
      return;
    }

    setDropPreviewDays(buildDropPreview(eventId, sourceDayUtc, targetDayUtc));
  }

  function handleDragCancel() {
    setDropPreviewDays([]);
  }

  function handleDragEnd(event: DragEndEvent) {
    setDropPreviewDays([]);
    if (!onEventDrop || !event.over?.id) {
      return;
    }

    const { eventId, sourceDayUtc } = event.active.data.current ?? {};
    if (typeof eventId !== 'string' || typeof sourceDayUtc !== 'number') {
      return;
    }

    const targetDayId = String(event.over.id);
    const targetDayUtc = getDayNumberFromDropId(targetDayId);
    if (targetDayUtc === undefined) {
      return;
    }

    if (targetDayUtc === sourceDayUtc) {
      return;
    }

    const draggedEvent = events.find((calendarEvent) => calendarEvent.id === eventId);
    if (!draggedEvent) {
      return;
    }

    const dayDelta = Math.round((targetDayUtc - sourceDayUtc) / DAY_MS);

    const nextStart = new Date(draggedEvent.start);
    const nextEnd = new Date(draggedEvent.end);
    nextStart.setUTCDate(nextStart.getUTCDate() + dayDelta);
    nextEnd.setUTCDate(nextEnd.getUTCDate() + dayDelta);

    void onEventDrop({
      event: draggedEvent,
      sourceDate: new Date(sourceDayUtc),
      targetDate: new Date(targetDayUtc),
      nextStart,
      nextEnd,
    });
  }

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
    <div className="flex flex-col gap-4 p-4">
      <div className="flex w-full items-center justify-center">
        <AppButton variant="plain" onClick={() => handleMonthChange(-1)}>
          <ChevronLeftIcon className="h-8 w-8" />
        </AppButton>
        <AppMonthPickerPopover
          value={currentMonth}
          onChange={setCurrentMonth}
          renderDate={({ month, year }) => (
            <div className="w-50 text-center text-2xl">
              {months[month]} {year}
            </div>
          )}
        />

        <AppButton variant="plain" onClick={() => handleMonthChange(1)}>
          <ChevronRightIcon className="h-8 w-8" />
        </AppButton>
      </div>
      <div className="my-4 flex flex-wrap justify-end gap-4">{buttons?.(defaultButtons) ?? defaultButtons}</div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentMonth.month + currentMonth.year * 12}
          initial={{ opacity: 0, scaleX: 0, transformOrigin: animateDirection === 'left' ? '0% 50%' : '100% 50%' }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0, transformOrigin: animateDirection === 'left' ? '0% 50%' : '100% 50%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
          >
            <div ref={calendarRef} className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div key={day} className="truncate text-center">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((date) => (
                <AppCalendarTile
                  date={date}
                  eventsWithRows={eventsWithRows}
                  currentMonth={currentMonth}
                  tileWidth={tileWidth}
                  enableDragAndDrop={Boolean(onEventDrop)}
                  dayDropId={`calendar-day-${dateToUtcDay(date)}`}
                  isDropPreview={dropPreviewDays.includes(dateToUtcDay(date))}
                  key={date.toString()}
                />
              ))}
            </div>
          </DndContext>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

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
