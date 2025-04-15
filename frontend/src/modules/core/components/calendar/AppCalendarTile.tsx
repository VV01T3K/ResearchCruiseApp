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
};
function CalendarEventTiles({ date, eventsWithRows, tileWidth }: CalendarEventTilesProps) {
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
        'bg-primary h-8 truncate text-white text-sm p-2 '
      );

      // calculate maximum width of the text tile based on the number of days left in the week and the event duration
      const daysInWeek = 8 - (date.getDay() === 0 ? 7 : date.getDay());
      const daysLeft = (dateToUtcDay(event.end) - dateToUtcDay(date)) / (24 * 60 * 60 * 1000) + 1;
      const width = Math.min(daysInWeek, daysLeft) * tileWidth - 20;
      const textComponent = (
        <div className="z-20 absolute truncate" style={{ maxWidth: width }}>
          {start ? event.title : ''}
        </div>
      );

      eventTiles.push(
        event.link ? (
          <AppLink href={event.link} variant="plain" className={className} key={`${event.title}-${i}`}>
            {textComponent}
          </AppLink>
        ) : (
          <div className={className}>{textComponent}</div>
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

type Props = {
  date: Date;
  eventsWithRows: CalendarEventWithRow[];
  currentMonth: { month: number; year: number };
  tileWidth: number;
};
export function AppCalendarTile({ date, eventsWithRows, currentMonth, tileWidth }: Props) {
  const isCurrentMonth = date.getMonth() === currentMonth.month;
  const isToday = dateToUtcDay(date) === dateToUtcDay(new Date());
  const isSunday = date.getDay() === 0;

  return (
    <div
      className={cn(
        !isCurrentMonth ? 'bg-gray-100' : '',
        isToday ? '!bg-primary-100 !border-primary-500' : '',
        'border rounded-xl border-gray-300 min-h-30 h-full hover:bg-gray-100 transition mb-3'
      )}
    >
      <div className="p-2 gap-1">
        <div className={cn(!isCurrentMonth ? 'text-gray-500' : '', isSunday ? 'text-red-500' : '', 'text-end')}>
          {date.getDate()}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1 mt-2 -m-2">
        <CalendarEventTiles date={date} eventsWithRows={eventsWithRows} tileWidth={tileWidth} />
      </div>
    </div>
  );
}
