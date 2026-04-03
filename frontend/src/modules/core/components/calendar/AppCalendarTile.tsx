import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import React, { Fragment } from 'react';

import { AppLink } from '@/core/components/AppLink';
import { CalendarEventWithRow } from '@/core/components/calendar/AppCalendar';
import { dateToUtcDay } from '@/core/lib/calendarUtils';
import { cn } from '@/core/lib/utils';

function getEventsForDate(date: Date, eventsWithRows: CalendarEventWithRow[]): CalendarEventWithRow[] {
  const dayUtc = dateToUtcDay(date);
  const todaysEvents = eventsWithRows.filter(
    (event) =>
      (dateToUtcDay(event.start) <= dayUtc && dateToUtcDay(event.end) > dayUtc) ||
      (dateToUtcDay(event.end) === dayUtc && (event.end.getHours() !== 0 || event.end.getMinutes() !== 0))
  );
  return todaysEvents;
}

type CalendarEventTilesProps = {
  date: Date;
  eventsWithRows: CalendarEventWithRow[];
  tileWidth: number;
  enableDragAndDrop: boolean;
};
function CalendarEventTiles({ date, eventsWithRows, tileWidth, enableDragAndDrop }: CalendarEventTilesProps) {
  const todaysEvents = getEventsForDate(date, eventsWithRows);
  const rowCount = Math.max(...todaysEvents.map((event) => event.row + 1));

  const eventTiles = [];
  for (let i = 0; i < rowCount; i++) {
    const eventsInRow = todaysEvents.filter((event) => event.row === i);
    if (eventsInRow.length === 1) {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      const event = eventsInRow[0];
      const start = date.getDay() === 1 || dateToUtcDay(event.start) === dateToUtcDay(date);
      const end =
        date.getDay() === 0 ||
        dateToUtcDay(event.end) === dateToUtcDay(date) ||
        (dateToUtcDay(event.end) === dateToUtcDay(nextDay) &&
          event.end.getHours() === 0 &&
          event.end.getMinutes() === 0);

      const className = cn(
        start ? 'rounded-l-lg ml-3' : '',
        end ? 'rounded-r-lg mr-3' : '',
        event.color ? 'bg-[var(--color)]' : 'bg-primary',
        'h-8 truncate text-white text-sm p-2 '
      );

      // calculate maximum width of the text tile based on the number of days left in the week and the event duration
      const daysInWeek = 8 - (date.getDay() === 0 ? 7 : date.getDay());
      const daysLeft = (dateToUtcDay(event.end) - dateToUtcDay(date)) / (24 * 60 * 60 * 1000) + 1;
      const width = Math.min(daysInWeek, daysLeft) * tileWidth - 20;
      const textComponent = (
        <div className="absolute z-20 truncate" style={{ maxWidth: width }}>
          {start ? event.title : ''}
        </div>
      );

      const innerComponent = (
        <div style={{ '--color': event.color } as React.CSSProperties} className={className}>
          {textComponent}
        </div>
      );

      const renderedComponent =
        enableDragAndDrop && event.id ? (
          <DraggableCalendarEvent eventId={event.id} sourceDayUtc={dateToUtcDay(date)}>
            {innerComponent}
          </DraggableCalendarEvent>
        ) : (
          innerComponent
        );

      eventTiles.push(
        event.link && !enableDragAndDrop ? (
          <AppLink href={event.link} variant="plain" key={`${event.title}-${i}`}>
            {renderedComponent}
          </AppLink>
        ) : (
          <Fragment key={`${event.title}-${i}`}>{renderedComponent}</Fragment>
        )
      );
    } else if (eventsInRow.length === 0) {
      eventTiles.push(<div className="h-8" key={`empty-${i}`} />);
    } else {
      throw new Error('Events in row must be either 0 or 1');
    }
  }
  return eventTiles;
}

type DraggableCalendarEventProps = {
  children: React.ReactNode;
  eventId: string;
  sourceDayUtc: number;
};
function DraggableCalendarEvent({ children, eventId, sourceDayUtc }: DraggableCalendarEventProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `calendar-event-${eventId}-${sourceDayUtc}`,
    data: { eventId, sourceDayUtc },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('touch-none', isDragging ? 'relative z-30' : '')}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}

type Props = {
  date: Date;
  eventsWithRows: CalendarEventWithRow[];
  currentMonth: { month: number; year: number };
  tileWidth: number;
  enableDragAndDrop: boolean;
  dayDropId: string;
  isDropPreview: boolean;
};
export function AppCalendarTile({
  date,
  eventsWithRows,
  currentMonth,
  tileWidth,
  enableDragAndDrop,
  dayDropId,
  isDropPreview,
}: Props) {
  const isCurrentMonth = date.getMonth() === currentMonth.month;
  const isToday = dateToUtcDay(date) === dateToUtcDay(new Date());
  const isSunday = date.getDay() === 0;
  const { isOver, setNodeRef } = useDroppable({ id: dayDropId, disabled: !enableDragAndDrop });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        !isCurrentMonth ? 'bg-gray-100' : '',
        isToday ? 'bg-primary-100! border-primary-500!' : '',
        enableDragAndDrop && isOver ? 'ring-2 ring-primary-500' : '',
        enableDragAndDrop && isDropPreview ? 'ring-2 ring-primary-300 bg-primary-50' : '',
        'mb-3 h-full min-h-30 rounded-xl border border-gray-300 transition hover:bg-gray-100'
      )}
    >
      <div className="gap-1 p-2">
        <div className={cn(!isCurrentMonth ? 'text-gray-500' : '', isSunday ? 'text-red-500' : '', 'text-end')}>
          {date.getDate()}
        </div>
      </div>
      <div className="-m-2 mt-2 grid grid-cols-1 gap-1">
        <CalendarEventTiles
          date={date}
          eventsWithRows={eventsWithRows}
          tileWidth={tileWidth}
          enableDragAndDrop={enableDragAndDrop}
        />
      </div>
    </div>
  );
}
