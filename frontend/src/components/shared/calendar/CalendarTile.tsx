import { Tooltip } from '@base-ui/react/tooltip';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { DotsSixVerticalIcon, LockIcon } from '@phosphor-icons/react';
import { useNavigate } from '@tanstack/react-router';
import React, { Fragment } from 'react';

import { Link } from '@/components/shared/Link';
import { toast } from '@/components/shared/layout/toast';
import { dateToUtcDay } from '@/lib/calendarUtils';
import { cn } from '@/lib/utils';
import type { CalendarEventWithRow } from './calendarTypes';

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
  activeDragEventId?: string;
};
function CalendarEventTiles({
  date,
  eventsWithRows,
  tileWidth,
  enableDragAndDrop,
  activeDragEventId,
}: CalendarEventTilesProps) {
  const navigate = useNavigate();
  const todaysEvents = getEventsForDate(date, eventsWithRows);
  const rowCount = Math.max(0, ...todaysEvents.map((event) => event.row + 1));

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

      const isDraggable = enableDragAndDrop && !event.dragLockedReason;
      const isLocked = enableDragAndDrop && !!event.dragLockedReason;
      const className = cn(
        start ? 'rounded-l-lg ml-3' : '',
        end ? 'rounded-r-lg mr-3' : '',
        event.color ? 'bg-[var(--color)]' : 'bg-primary',
        isLocked &&
          'cursor-not-allowed bg-[image:repeating-linear-gradient(135deg,transparent_0_6px,rgb(0_0_0/0.25)_6px_12px)]',
        'h-8 truncate text-inverse-foreground text-sm p-2 '
      );

      const daysInWeek = 8 - (date.getDay() === 0 ? 7 : date.getDay());
      const daysLeft = (dateToUtcDay(event.end) - dateToUtcDay(date)) / (24 * 60 * 60 * 1000) + 1;
      const visibleDays = Math.min(daysInWeek, daysLeft);
      const width = visibleDays * tileWidth - 20;
      const textComponent = (
        <div className="absolute z-20 flex items-center gap-1 truncate" style={{ maxWidth: width }}>
          {start && isDraggable && <DotsSixVerticalIcon aria-hidden size={14} weight="bold" className="shrink-0" />}
          {start && isLocked && <LockIcon aria-hidden size={14} weight="bold" className="shrink-0" />}
          <span className="truncate">{start ? event.title : ''}</span>
        </div>
      );

      const focusRing = (
        <div
          className="pointer-events-none absolute top-0 left-3 z-30 hidden h-8 rounded-lg ring-2 ring-primary-500 ring-offset-2 group-focus-visible:block"
          style={{ width: visibleDays * tileWidth - 14 }}
        />
      );

      const innerComponent = (
        <div
          data-calendar-event-block
          style={{ '--color': event.color } as React.CSSProperties}
          className={className}
          onDoubleClick={enableDragAndDrop && event.link ? () => void navigate({ href: event.link }) : undefined}
        >
          {textComponent}
        </div>
      );

      const renderedComponent =
        isDraggable && event.id ? (
          <DraggableCalendarEvent
            eventId={event.id}
            sourceDayUtc={dateToUtcDay(date)}
            activeDragEventId={activeDragEventId}
            focusable={start}
          >
            {innerComponent}
            {focusRing}
          </DraggableCalendarEvent>
        ) : (
          innerComponent
        );

      eventTiles.push(
        isLocked || (event.link && !isDraggable) ? (
          <Tooltip.Root key={`${event.title}-${i}`} disabled={!isLocked}>
            <Tooltip.Trigger
              render={<div />}
              onDragStart={(e) => {
                e.preventDefault();
                if (isLocked) toast.error(event.dragLockedReason!);
              }}
            >
              {isLocked ? (
                <div
                  role="button"
                  aria-disabled
                  draggable
                  className="group relative focus-visible:outline-hidden"
                  tabIndex={start ? 0 : -1}
                  aria-hidden={!start || undefined}
                >
                  {renderedComponent}
                  {focusRing}
                  <span className="sr-only">{event.dragLockedReason}</span>
                </div>
              ) : (
                <Link
                  to={event.link}
                  variant="plain"
                  className="group relative block focus-visible:outline-hidden"
                  tabIndex={start ? undefined : -1}
                  aria-hidden={!start || undefined}
                >
                  {renderedComponent}
                  {focusRing}
                </Link>
              )}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner className="z-50" sideOffset={4} collisionPadding={8}>
                <Tooltip.Popup className="max-w-64 rounded-md bg-surface px-2 py-1 text-xs text-foreground shadow-md ring-1 ring-border">
                  {event.dragLockedReason}
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
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
  activeDragEventId?: string;
  focusable: boolean;
};
function DraggableCalendarEvent({
  children,
  eventId,
  sourceDayUtc,
  activeDragEventId,
  focusable,
}: DraggableCalendarEventProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `calendar-event-${eventId}-${sourceDayUtc}`,
    data: { eventId, sourceDayUtc },
  });
  const isActiveDraggedEvent = activeDragEventId === eventId;

  const style = {
    opacity: isActiveDraggedEvent ? 0 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('group relative touch-none focus-visible:outline-hidden', isDragging ? 'z-30' : '')}
      {...attributes}
      {...listeners}
      tabIndex={focusable ? 0 : -1}
      aria-hidden={!focusable || undefined}
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
  isToday: boolean;
  activeDragEventId?: string;
};
export function CalendarTile({
  date,
  eventsWithRows,
  currentMonth,
  tileWidth,
  enableDragAndDrop,
  dayDropId,
  isDropPreview,
  isToday,
  activeDragEventId,
}: Props) {
  const isCurrentMonth = date.getMonth() === currentMonth.month;
  const isSunday = date.getDay() === 0;
  const { isOver, setNodeRef } = useDroppable({ id: dayDropId, disabled: !enableDragAndDrop });

  return (
    <div
      data-calendar-day-tile
      ref={setNodeRef}
      className={cn(
        enableDragAndDrop && isOver ? 'ring-2 ring-primary-500' : '',
        enableDragAndDrop && isDropPreview
          ? 'ring-2 ring-primary-300 bg-primary-50'
          : [
              !isCurrentMonth ? 'bg-surface-subtle' : '',
              isToday ? 'bg-primary-100! border-primary-500!' : '',
              'hover:bg-surface-subtle',
            ],
        'mb-3 h-full min-h-30 rounded-xl border border-border transition'
      )}
    >
      <div className="gap-1 p-2">
        <div className="text-end">
          <span
            className={cn(
              !isCurrentMonth ? 'text-muted-foreground' : '',
              isSunday ? 'text-danger' : '',
              isToday ? 'rounded-full bg-primary-600 px-2 text-inverse-foreground' : '',
              isToday && isSunday ? 'bg-danger' : ''
            )}
          >
            {date.getDate()}
          </span>
        </div>
      </div>
      <div data-calendar-event-rows className="-m-2 mt-2 grid grid-cols-1 gap-1">
        <CalendarEventTiles
          date={date}
          eventsWithRows={eventsWithRows}
          tileWidth={tileWidth}
          enableDragAndDrop={enableDragAndDrop}
          activeDragEventId={activeDragEventId}
        />
      </div>
    </div>
  );
}
