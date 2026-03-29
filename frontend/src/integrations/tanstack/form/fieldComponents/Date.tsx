import { AnimatePresence } from 'motion/react';
import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { AppMonthPickerPopover } from '@/components/shared/inputs/dates/AppMonthPickerPopover';
import { AppDatePickerTimeInput } from '@/components/shared/inputs/dates/AppTimePickerInput';
import { useDropdown } from '@/hooks/shared/DropdownHook';
import { useOutsideClickDetection } from '@/hooks/shared/OutsideClickDetectionHook';
import { dateToUtcDay, getDaysInMonth, shortWeekDays } from '@/lib/calendarUtils';
import { cn } from '@/lib/utils';

import {
  DropdownModal,
  FieldErrorsBlock,
  FieldErrorTriangle,
  FieldLabel,
  PlainButton,
  getDateFromValue,
  getValueFromDate,
  useNormalizedFieldErrors,
} from './shared';

type DateFieldProps = {
  label?: React.ReactNode;
  placeholder?: string;
  minimalDate?: Date;
  maximalDate?: Date;
  selectionStartDate?: Date;
  type?: 'date' | 'datetime';
  minuteStep?: number;
};

export function Date({
  label,
  placeholder = 'Wybierz datę',
  minimalDate,
  maximalDate,
  selectionStartDate,
  type = 'date',
  minuteStep,
}: DateFieldProps) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<string | undefined>();
  const value = field.state.value;
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => getDateFromValue(value));
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>(undefined);
  const [expanded, setExpanded] = React.useState(false);
  const [visibleMonth, setVisibleMonth] = React.useState({
    month: new globalThis.Date().getMonth(),
    year: new globalThis.Date().getFullYear(),
  });
  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const portalContainerRef = useCallback((node: HTMLDivElement | null) => setPortalContainer(node), []);
  const { top, left, direction } = useDropdown({
    openingItemRef: inputRef,
    dropdownRef,
    dropdownPosition: 'center',
  });

  React.useEffect(() => {
    setSelectedDate(getDateFromValue(value));
  }, [value]);

  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
      field.handleBlur();
    },
  });

  function handleMonthChange(delta: 1 | -1) {
    const newYear = visibleMonth.year;
    const newMonth = visibleMonth.month + delta;
    if (newMonth < 0) return setVisibleMonth({ month: 11, year: newYear - 1 });
    if (newMonth > 11) return setVisibleMonth({ month: 0, year: newYear + 1 });
    setVisibleMonth({ month: newMonth, year: newYear });
  }

  function handleDateSelection(newDate: Date) {
    if (newDate.getMonth() !== visibleMonth.month) {
      handleMonthChange(newDate.getMonth() > visibleMonth.month ? 1 : -1);
      return;
    }
    if (minimalDate && newDate < minimalDate) newDate = minimalDate;
    else if (maximalDate && newDate > maximalDate) newDate = maximalDate;
    setSelectedDate(newDate);
    field.handleChange(getValueFromDate(newDate));
    if (type === 'date') setExpanded(false);
  }

  return (
    <>
      <div className="flex flex-col" data-invalid={hasError || undefined}>
        <FieldLabel htmlFor={field.name} label={label} />
        <div ref={inputRef}>
          <input id={field.name} type="hidden" name={field.name} value={value ?? ''} />
          <PlainButton
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className={cn(
              'relative inline-flex w-full items-center justify-between gap-4 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
              hasError ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
          >
            {selectedDate
              ? selectedDate.toLocaleDateString('pl-PL', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: type === 'datetime' ? '2-digit' : undefined,
                  minute: type === 'datetime' ? '2-digit' : undefined,
                })
              : placeholder}
            <span className="flex items-center gap-2">
              <FieldErrorTriangle hasError={hasError} />
              <div ref={portalContainerRef}></div>
              {!selectedDate && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </PlainButton>
          {selectedDate && portalContainer
            ? createPortal(
                <PlainButton
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setSelectedDate(undefined);
                    field.handleChange(undefined);
                    setExpanded(false);
                  }}
                  className="inline-block p-0 hover:text-red-500"
                >
                  <XLgIcon className="h-4 w-4" />
                </PlainButton>,
                portalContainer
              )
            : null}
        </div>
        <FieldErrorsBlock errors={normalizedErrors} />
      </div>
      <AnimatePresence>
        {expanded && (
          <DropdownModal dropdownRef={dropdownRef} inputRef={inputRef} top={top} left={left} direction={direction}>
            <div className="grid grid-cols-5 items-center px-2 py-2">
              <PlainButton type="button" onClick={() => handleMonthChange(-1)} className="grid w-full place-items-center rounded-lg hover:bg-gray-100">
                <ChevronLeftIcon className="h-5 w-5" />
              </PlainButton>
              <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">
                <AppMonthPickerPopover value={visibleMonth} onChange={setVisibleMonth} />
              </span>
              <PlainButton type="button" onClick={() => handleMonthChange(1)} className="grid w-full place-items-center rounded-lg hover:bg-gray-100">
                <ChevronRightIcon className="h-5 w-5" />
              </PlainButton>
            </div>
            <div className="grid grid-cols-7 p-2" onMouseLeave={() => setHoveredDate(undefined)}>
              {shortWeekDays.map((day) => (
                <div key={day} className="pb-2 text-center font-semibold">
                  {day}
                </div>
              ))}
              {getDaysInMonth(visibleMonth).map((date) => (
                <CalendarDateTile
                  key={date.getTime()}
                  date={date}
                  selectedDate={selectedDate}
                  selectionStartDate={selectionStartDate}
                  hoveredDate={hoveredDate}
                  minimalDate={minimalDate}
                  maximalDate={maximalDate}
                  visibleMonth={visibleMonth}
                  setHoveredDate={setHoveredDate}
                  handleDateSelection={handleDateSelection}
                />
              ))}
            </div>
            {type === 'datetime' && (
              <div className="p-2">
                <AppDatePickerTimeInput
                  name={field.name}
                  value={selectedDate ? { hours: selectedDate.getHours(), minutes: selectedDate.getMinutes() } : undefined}
                  placeholder="Wybierz godzinę"
                  onChange={(nextTime) => {
                    const newDate = new globalThis.Date(selectedDate ?? new globalThis.Date());
                    newDate.setHours(nextTime?.hours ?? 0);
                    newDate.setMinutes(nextTime?.minutes ?? 0);
                    setSelectedDate(newDate);
                    field.handleChange(getValueFromDate(newDate));
                  }}
                  onBlur={field.handleBlur}
                  minuteStep={minuteStep}
                />
              </div>
            )}
          </DropdownModal>
        )}
      </AnimatePresence>
    </>
  );
}

export function DateTime(props: Omit<DateFieldProps, 'type'>) {
  return <Date {...props} type="datetime" />;
}

function CalendarDateTile({
  date,
  selectedDate,
  selectionStartDate,
  hoveredDate,
  minimalDate,
  maximalDate,
  visibleMonth,
  setHoveredDate,
  handleDateSelection,
}: {
  date: Date;
  selectedDate?: Date;
  selectionStartDate?: Date;
  hoveredDate?: Date;
  minimalDate?: Date;
  maximalDate?: Date;
  visibleMonth: { month: number; year: number };
  setHoveredDate: (date: Date | undefined) => void;
  handleDateSelection: (date: Date) => void;
}) {
  if (selectedDate) {
    date.setHours(selectedDate.getHours());
    date.setMinutes(selectedDate.getMinutes());
  }
  const dateUtc = dateToUtcDay(date);
  const selectedDateUtc = selectedDate && dateToUtcDay(selectedDate);
  const selectionStartDateUtc = selectionStartDate && dateToUtcDay(selectionStartDate);
  const hoveredDateUtc = hoveredDate && dateToUtcDay(hoveredDate);
  const isFirstDayOfSelection = selectionStartDateUtc === dateUtc;
  const isSelected = selectedDateUtc === dateUtc;
  const isHovered = hoveredDateUtc === dateUtc;
  const isHoveredBetweenSelection =
    selectionStartDateUtc && hoveredDateUtc && dateUtc >= selectionStartDateUtc && dateUtc <= hoveredDateUtc;
  const isInSelectedRange =
    selectionStartDateUtc && selectedDateUtc && dateUtc >= selectionStartDateUtc && dateUtc <= selectedDateUtc;
  const isAllowed =
    (!minimalDate || dateUtc >= dateToUtcDay(minimalDate)) && (!maximalDate || dateUtc <= dateToUtcDay(maximalDate));
  const isVisibleMonth = date.getMonth() === visibleMonth.month;

  return (
    <div
      className={cn(
        isFirstDayOfSelection ? 'rounded-l-full' : '',
        (isHovered && !selectedDate) || isSelected ? 'rounded-r-full' : '',
        (!selectedDate && isHoveredBetweenSelection) || isInSelectedRange ? 'bg-gray-100' : '',
        'mt-1'
      )}
      onMouseEnter={() => setHoveredDate(date)}
      onClick={() => handleDateSelection(date)}
    >
      <PlainButton
        type="button"
        disabled={!isAllowed}
        className={cn(
          isSelected ? 'bg-primary-500 !text-white' : 'hover:bg-gray-300',
          isFirstDayOfSelection ? '!bg-primary-200 !text-inherit' : '',
          'w-full rounded-full py-2 text-center',
          !isVisibleMonth || !isAllowed ? 'text-gray-400' : '',
          !isAllowed ? 'hover:bg-gray-100' : ''
        )}
      >
        {date.getDate()}
      </PlainButton>
    </div>
  );
}
