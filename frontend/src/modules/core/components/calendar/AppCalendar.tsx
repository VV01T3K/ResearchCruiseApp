import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
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
import type { CalendarEvent, CalendarEventWithRow, CalendarEventDropPayload } from './calendarTypes';

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
  const DRAG_CURSOR_Y_NUDGE = 4;
  const [currentMonth, setCurrentMonth] = React.useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [previousMonth, setPreviousMonth] = React.useState(currentMonth);
  const [dropPreviewDays, setDropPreviewDays] = React.useState<number[]>([]);
  const [activeDragEventId, setActiveDragEventId] = React.useState<string | undefined>(undefined);
  const [pendingDrop, setPendingDrop] = React.useState<
    { eventId: string; nextStartMs: number; nextEndMs: number } | undefined
  >(undefined);
  const [activeDragOverlay, setActiveDragOverlay] = React.useState<
    { title: string; spanDays: number; anchorOffset: number } | undefined
  >(undefined);
  const [activeDragPointerOffsetY, setActiveDragPointerOffsetY] = React.useState(0);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const [tileWidth, setTileWidth] = React.useState(0);
  const [dragBlockHeight, setDragBlockHeight] = React.useState(32);
  const [dragBlockRowGap, setDragBlockRowGap] = React.useState(4);
  const [dragWeekRowStep, setDragWeekRowStep] = React.useState(120);

  const updateTileWidth = React.useCallback(() => {
    const calendarElement = calendarRef.current;
    if (!calendarElement) {
      console.log('Calendar element not found');
      return;
    }

    const dayTiles = calendarElement.querySelectorAll<HTMLElement>('[data-calendar-day-tile]');
    const calendarWidth = calendarElement.getBoundingClientRect().width;
    if (Number.isFinite(calendarWidth) && calendarWidth > 0) {
      // oxlint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setTileWidth(calendarWidth / 7);
    }

    const eventBlock = calendarElement.querySelector<HTMLElement>('[data-calendar-event-block]');
    if (eventBlock) {
      // oxlint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setDragBlockHeight(eventBlock.getBoundingClientRect().height);
    }

    const eventRows = calendarElement.querySelector<HTMLElement>('[data-calendar-event-rows]');
    if (eventRows) {
      const rowGap = Number.parseFloat(window.getComputedStyle(eventRows).rowGap || '0');
      if (Number.isFinite(rowGap)) {
        // oxlint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setDragBlockRowGap(rowGap);
      }
    }

    if (dayTiles.length > 7) {
      const firstRowTop = dayTiles[0].getBoundingClientRect().top;
      const secondRowTop = dayTiles[7].getBoundingClientRect().top;
      const weekStep = secondRowTop - firstRowTop;
      if (Number.isFinite(weekStep) && weekStep > 0) {
        // oxlint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setDragWeekRowStep(weekStep);
      }
    }
  }, []);

  React.useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const handleViewportResize = () => updateTileWidth();
    viewport.addEventListener('resize', handleViewportResize);
    return () => {
      viewport.removeEventListener('resize', handleViewportResize);
    };
  }, [updateTileWidth]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 0, tolerance: 0 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 0 } })
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

  function getWeekdayColumn(dayUtc: number): number {
    const utcWeekday = new Date(dayUtc).getUTCDay();
    return utcWeekday === 0 ? 6 : utcWeekday - 1;
  }

  function buildWeeklyOverlaySegments(
    previewStartDayUtc: number,
    spanDays: number
  ): Array<{ startColumn: number; length: number }> {
    const segments: Array<{ startColumn: number; length: number }> = [];
    let remainingDays = spanDays;
    let currentDayUtc = previewStartDayUtc;

    while (remainingDays > 0) {
      const startColumn = getWeekdayColumn(currentDayUtc);
      const daysUntilWeekEnd = 7 - startColumn;
      const length = Math.min(remainingDays, daysUntilWeekEnd);
      segments.push({ startColumn, length });
      remainingDays -= length;
      currentDayUtc += length * DAY_MS;
    }

    return segments;
  }

  function getOverlayAnchorPosition(segments: Array<{ startColumn: number; length: number }>, anchorOffset: number) {
    let coveredDays = 0;
    for (let row = 0; row < segments.length; row++) {
      const segment = segments[row];
      if (anchorOffset < coveredDays + segment.length) {
        return {
          row,
          column: segment.startColumn + (anchorOffset - coveredDays),
        };
      }
      coveredDays += segment.length;
    }

    const lastRow = Math.max(0, segments.length - 1);
    const lastSegment = segments[lastRow];
    return {
      row: lastRow,
      column: Math.max(0, lastSegment.startColumn + lastSegment.length - 1),
    };
  }

  function handleDragStart(event: DragStartEvent) {
    if (!onEventDrop) {
      return;
    }

    const { eventId, sourceDayUtc } = event.active.data.current ?? {};
    if (typeof eventId !== 'string' || typeof sourceDayUtc !== 'number') {
      setActiveDragEventId(undefined);
      setActiveDragOverlay(undefined);
      setDropPreviewDays([]);
      return;
    }

    const draggedEvent = events.find((calendarEvent) => calendarEvent.id === eventId);
    if (!draggedEvent) {
      setActiveDragEventId(undefined);
      setActiveDragOverlay(undefined);
      setDropPreviewDays([]);
      return;
    }

    const startDayUtc = dateToUtcDay(draggedEvent.start);
    const anchorOffset = Math.floor((sourceDayUtc - startDayUtc) / DAY_MS);
    const nextPointerOffsetY = dragBlockHeight * 2.3;

    setActiveDragEventId(eventId);
    setPendingDrop(undefined);
    setActiveDragOverlay({
      title: draggedEvent.title,
      spanDays: getVisibleSpanDays(draggedEvent),
      anchorOffset,
    });
    setActiveDragPointerOffsetY(nextPointerOffsetY);
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
    setActiveDragEventId(undefined);
    setActiveDragOverlay(undefined);
    setActiveDragPointerOffsetY(0);
    setDropPreviewDays([]);
    setPendingDrop(undefined);
  }

  async function handleDragEnd(event: DragEndEvent) {
    if (!onEventDrop || !event.over?.id) {
      setActiveDragEventId(undefined);
      setActiveDragOverlay(undefined);
      setActiveDragPointerOffsetY(0);
      setDropPreviewDays([]);
      setPendingDrop(undefined);
      return;
    }

    const { eventId, sourceDayUtc } = event.active.data.current ?? {};
    if (typeof eventId !== 'string' || typeof sourceDayUtc !== 'number') {
      setActiveDragEventId(undefined);
      setActiveDragOverlay(undefined);
      setActiveDragPointerOffsetY(0);
      setDropPreviewDays([]);
      setPendingDrop(undefined);
      return;
    }

    const targetDayId = String(event.over.id);
    const targetDayUtc = getDayNumberFromDropId(targetDayId);
    if (targetDayUtc === undefined) {
      setActiveDragEventId(undefined);
      setActiveDragOverlay(undefined);
      setActiveDragPointerOffsetY(0);
      setDropPreviewDays([]);
      setPendingDrop(undefined);
      return;
    }

    if (targetDayUtc === sourceDayUtc) {
      setActiveDragEventId(undefined);
      setActiveDragOverlay(undefined);
      setActiveDragPointerOffsetY(0);
      setDropPreviewDays([]);
      setPendingDrop(undefined);
      return;
    }

    const draggedEvent = events.find((calendarEvent) => calendarEvent.id === eventId);
    if (!draggedEvent) {
      setActiveDragEventId(undefined);
      setActiveDragOverlay(undefined);
      setActiveDragPointerOffsetY(0);
      setDropPreviewDays([]);
      setPendingDrop(undefined);
      return;
    }

    setActiveDragOverlay(undefined);
    setActiveDragPointerOffsetY(0);

    const dayDelta = Math.round((targetDayUtc - sourceDayUtc) / DAY_MS);

    const nextStart = new Date(draggedEvent.start);
    const nextEnd = new Date(draggedEvent.end);
    nextStart.setUTCDate(nextStart.getUTCDate() + dayDelta);
    nextEnd.setUTCDate(nextEnd.getUTCDate() + dayDelta);
    setPendingDrop({ eventId, nextStartMs: nextStart.getTime(), nextEndMs: nextEnd.getTime() });

    try {
      await Promise.resolve(
        onEventDrop({
          event: draggedEvent,
          sourceDate: new Date(sourceDayUtc),
          targetDate: new Date(targetDayUtc),
          nextStart,
          nextEnd,
        })
      );
    } catch (error) {
      setActiveDragEventId(undefined);
      setDropPreviewDays([]);
      setPendingDrop(undefined);
      throw error;
    }
  }

  React.useEffect(() => {
    if (!pendingDrop) {
      return;
    }

    const updatedEvent = events.find((calendarEvent) => calendarEvent.id === pendingDrop.eventId);
    if (!updatedEvent) {
      return;
    }

    if (
      updatedEvent.start.getTime() === pendingDrop.nextStartMs &&
      updatedEvent.end.getTime() === pendingDrop.nextEndMs
    ) {
      setActiveDragEventId(undefined);
      setDropPreviewDays([]);
      setPendingDrop(undefined);
    }
  }, [events, pendingDrop]);

  const eventsWithRows = React.useMemo(() => assignEventsToRows(events), [events]);
  const displayedMonthDays = React.useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);
  const displayedStartDayUtc = displayedMonthDays.length > 0 ? dateToUtcDay(displayedMonthDays[0]) : undefined;
  const displayedEndDayUtc =
    displayedMonthDays.length > 0 ? dateToUtcDay(displayedMonthDays[displayedMonthDays.length - 1]) : undefined;

  const overlayVisibleWindow = React.useMemo(() => {
    if (
      !activeDragOverlay ||
      dropPreviewDays.length === 0 ||
      displayedStartDayUtc === undefined ||
      displayedEndDayUtc === undefined
    ) {
      return undefined;
    }

    const previewStartDayUtc = dropPreviewDays[0];
    const previewEndDayUtc = previewStartDayUtc + (activeDragOverlay.spanDays - 1) * DAY_MS;
    const visibleStartDayUtc = Math.max(previewStartDayUtc, displayedStartDayUtc);
    const visibleEndDayUtc = Math.min(previewEndDayUtc, displayedEndDayUtc);

    if (visibleEndDayUtc < visibleStartDayUtc) {
      return undefined;
    }

    const hiddenLeadingDays = Math.floor((visibleStartDayUtc - previewStartDayUtc) / DAY_MS);
    const visibleSpanDays = Math.floor((visibleEndDayUtc - visibleStartDayUtc) / DAY_MS) + 1;
    return {
      visibleStartDayUtc,
      visibleSpanDays,
      hiddenLeadingDays,
    };
  }, [DAY_MS, activeDragOverlay, displayedEndDayUtc, displayedStartDayUtc, dropPreviewDays]);

  const overlaySegments =
    overlayVisibleWindow && overlayVisibleWindow.visibleSpanDays > 0
      ? buildWeeklyOverlaySegments(overlayVisibleWindow.visibleStartDayUtc, overlayVisibleWindow.visibleSpanDays)
      : [];

  const visibleAnchorOffset =
    activeDragOverlay && overlayVisibleWindow
      ? Math.max(
          0,
          Math.min(
            overlayVisibleWindow.visibleSpanDays - 1,
            activeDragOverlay.anchorOffset - overlayVisibleWindow.hiddenLeadingDays
          )
        )
      : 0;

  const overlayAnchor =
    overlaySegments.length > 0 ? getOverlayAnchorPosition(overlaySegments, visibleAnchorOffset) : { row: 0, column: 0 };

  const overlayDrawLeft = -(overlayAnchor.column * tileWidth);
  const overlayScrollOffsetY = typeof window === 'undefined' ? 0 : window.scrollY;
  const overlayDrawTop =
    DRAG_CURSOR_Y_NUDGE - activeDragPointerOffsetY - overlayAnchor.row * dragWeekRowStep + overlayScrollOffsetY;

  React.useEffect(() => {
    if (!activeDragOverlay || overlaySegments.length === 0) {
      return;
    }
  }, [
    activeDragOverlay,
    overlaySegments.length,
    overlayDrawLeft,
    overlayDrawTop,
    overlayScrollOffsetY,
    overlayAnchor.row,
    overlayAnchor.column,
  ]);

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
    <div ref={calendarRef} className="flex flex-col gap-4 p-4">
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
            collisionDetection={pointerWithin}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div key={day} className="truncate text-center">
                  {day}
                </div>
              ))}
              {displayedMonthDays.map((date) => (
                <AppCalendarTile
                  date={date}
                  eventsWithRows={eventsWithRows}
                  currentMonth={currentMonth}
                  tileWidth={tileWidth}
                  enableDragAndDrop={Boolean(onEventDrop)}
                  dayDropId={`calendar-day-${dateToUtcDay(date)}`}
                  isDropPreview={dropPreviewDays.includes(dateToUtcDay(date))}
                  activeDragEventId={activeDragEventId}
                  key={date.toString()}
                />
              ))}
            </div>
            <DragOverlay adjustScale={false} dropAnimation={null}>
              {activeDragOverlay && overlaySegments.length > 0 ? (
                <div
                  className="pointer-events-none"
                  style={{
                    marginLeft: overlayDrawLeft,
                    marginTop: overlayDrawTop,
                  }}
                >
                  <div
                    className="flex flex-col"
                    style={{ gap: Math.max(dragBlockRowGap, dragWeekRowStep - dragBlockHeight) }}
                  >
                    {overlaySegments.map((segment, index) => (
                      <div
                        key={`${activeDragOverlay.title}-${index}`}
                        className="h-8 rounded-lg bg-gray-500/90 p-2 text-sm text-white shadow-lg"
                        style={{
                          width: Math.max(40, segment.length * tileWidth - 20),
                          marginLeft: segment.startColumn * tileWidth,
                        }}
                      >
                        <div className="truncate">{index === 0 ? activeDragOverlay.title : ''}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
