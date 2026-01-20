import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
dayjs.extend(utc);

import { AppButton } from '@/core/components/AppButton';
import { AppMonthPickerPopover } from '@/core/components/inputs/dates/AppMonthPickerPopover';
import { AppDatePickerTimeInput } from '@/core/components/inputs/dates/AppTimePickerInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { dateToUtcDay, getDaysInMonth, shortWeekDays } from '@/core/lib/calendarUtils';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  value: string | undefined;

  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
  minimalDate?: Date;
  maximalDate?: Date;
  selectionStartDate?: Date;
  'data-testid'?: string;
  'data-testid-button'?: string;
  'data-testid-errors'?: string;
} & (
  | {
      type?: 'date';
      minuteStep?: never;
    }
  | {
      type: 'datetime';
      minuteStep?: number;
    }
);
export function AppDatePickerInput({
  name,
  value,
  onChange,
  onBlur,
  errors,
  label,
  showRequiredAsterisk,
  disabled,
  helper,
  placeholder = 'Wybierz datę',
  type = 'date',
  minuteStep,
  minimalDate,
  maximalDate,
  selectionStartDate,
  'data-testid': testId,
  'data-testid-button': buttonTestId,
  'data-testid-errors': errorsTestId,
}: Props) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => getDateFromValue(value));
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>(undefined);
  const [expanded, setExpanded] = React.useState(false);
  const [visibleMonth, setVisibleMonth] = React.useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const portalContainerRef = useCallback((node: HTMLDivElement | null) => setPortalContainer(node), []);

  React.useEffect(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setSelectedDate(getDateFromValue(value));
  }, [value]);

  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
      onBlur?.();
    },
  });

  function handleInputClick() {
    if (disabled) {
      return;
    }

    setExpanded(!expanded);
  }

  function handleResetSelection(evt: React.MouseEvent) {
    setSelectedDate(undefined);
    onChange?.(undefined);
    setExpanded(false);
    evt.stopPropagation();
    evt.preventDefault();
  }

  function handleMonthChange(delta: 1 | -1) {
    const newYear = visibleMonth.year;
    const newMonth = visibleMonth.month + delta;
    if (newMonth < 0) {
      setVisibleMonth({ month: 11, year: newYear - 1 });
      return;
    }
    if (newMonth > 11) {
      setVisibleMonth({ month: 0, year: newYear + 1 });
      return;
    }
    setVisibleMonth({ month: newMonth, year: newYear });
  }

  function handleDateSelection(newDate: Date) {
    if (newDate.getMonth() !== visibleMonth.month) {
      handleMonthChange(newDate.getMonth() > visibleMonth.month ? 1 : -1);
      return;
    }

    if (minimalDate && newDate < minimalDate) {
      newDate = minimalDate;
    } else if (maximalDate && newDate > maximalDate) {
      newDate = maximalDate;
    }

    setSelectedDate(newDate);
    onChange?.(getValueFromDate(newDate));
    if (type === 'date') {
      setExpanded(false);
    }
  }

  return (
    <>
      <div className="flex flex-col" data-testid={testId}>
        <AppInputLabel name={name} value={label} showRequiredAsterisk={showRequiredAsterisk} />
        <div ref={inputRef}>
          <input type="hidden" name={name} value={value} disabled={disabled} />
          <AppButton
            variant="plain"
            onClick={handleInputClick}
            className={cn(
              'relative inline-flex w-full items-center justify-between gap-4 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
              disabled ? 'bg-gray-200 hover:cursor-default' : '',
              errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
            data-testid={buttonTestId}
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
              <AppInputErrorTriangle errors={errors} />
              <div ref={portalContainerRef}></div>
              {!selectedDate && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </AppButton>
          <RemoveSelectedDatePortal
            selectedDate={selectedDate}
            disabled={disabled}
            portalContainer={portalContainer}
            onResetSelection={handleResetSelection}
          />
        </div>
        <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2' : '')}>
          <AppInputHelper helper={helper} />
          <AppInputErrorsList errors={errors} data-testid={errorsTestId} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} inputRef={inputRef}>
            <div className="grid grid-cols-5 items-center px-2 py-2">
              <AppButton
                variant="plain"
                onClick={() => handleMonthChange(-1)}
                className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </AppButton>

              <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">
                <AppMonthPickerPopover value={visibleMonth} onChange={setVisibleMonth} />
              </span>

              <AppButton
                variant="plain"
                onClick={() => handleMonthChange(1)}
                className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </AppButton>
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
                  name={name}
                  value={
                    selectedDate && {
                      hours: selectedDate?.getHours(),
                      minutes: selectedDate?.getMinutes(),
                    }
                  }
                  placeholder="Wybierz godzinę"
                  onChange={(x) => {
                    const newDate = new Date(selectedDate ?? new Date());
                    newDate.setHours(x?.hours ?? 0);
                    newDate.setMinutes(x?.minutes ?? 0);
                    setSelectedDate(newDate);
                    onChange?.(getValueFromDate(newDate));
                  }}
                  onBlur={onBlur}
                  minuteStep={minuteStep}
                  minimalTime={
                    minimalDate && selectedDate && dateToUtcDay(minimalDate) === dateToUtcDay(selectedDate)
                      ? {
                          hours: minimalDate?.getHours(),
                          minutes: minimalDate?.getMinutes(),
                        }
                      : undefined
                  }
                  maximalTime={
                    maximalDate && selectedDate && dateToUtcDay(maximalDate) === dateToUtcDay(selectedDate)
                      ? {
                          hours: maximalDate?.getHours(),
                          minutes: maximalDate?.getMinutes(),
                        }
                      : undefined
                  }
                />
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function getDateFromValue(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  const normalized = value.endsWith('Z') ? value : `${value}Z`;
  return dayjs.utc(normalized).toDate();
}

function getValueFromDate(date: Date | undefined): string | undefined {
  if (!date) {
    return undefined;
  }

  return date.toISOString();
}

type CalendarDateTileProps = {
  date: Date;
  selectedDate?: Date;
  selectionStartDate?: Date;
  hoveredDate?: Date;
  minimalDate?: Date;
  maximalDate?: Date;
  visibleMonth: { month: number; year: number };
  setHoveredDate: (date: Date | undefined) => void;
  handleDateSelection: (date: Date) => void;
};
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
}: CalendarDateTileProps) {
  if (selectedDate) {
    date.setHours(selectedDate.getHours());
    date.setMinutes(selectedDate.getMinutes());
  }

  const dateUtc = dateToUtcDay(date),
    selectedDateUtc = selectedDate && dateToUtcDay(selectedDate),
    selectionStartDateUtc = selectionStartDate && dateToUtcDay(selectionStartDate),
    hoveredDateUtc = hoveredDate && dateToUtcDay(hoveredDate);

  const isFirstDayOfSelection = selectionStartDate && selectionStartDateUtc === dateUtc,
    isSelected = selectedDateUtc === dateUtc,
    isHovered = hoveredDate && dateUtc === hoveredDateUtc,
    isHoveredBetweenSelection =
      selectionStartDateUtc && hoveredDateUtc && dateUtc >= selectionStartDateUtc && dateUtc <= hoveredDateUtc,
    isInSelectedRange =
      selectionStartDateUtc && selectedDateUtc && dateUtc >= selectionStartDateUtc && dateUtc <= selectedDateUtc,
    isAllowed =
      (!minimalDate || dateUtc >= dateToUtcDay(minimalDate)) && (!maximalDate || dateUtc <= dateToUtcDay(maximalDate)),
    isVisibleMonth = date.getMonth() === visibleMonth.month;
  return (
    <div
      key={date.getTime()}
      className={cn(
        isFirstDayOfSelection ? 'rounded-l-full' : '',
        (isHovered && !selectedDate) || isSelected ? 'rounded-r-full' : '',
        (!selectedDate && isHoveredBetweenSelection) || isInSelectedRange ? 'bg-gray-100' : '',
        'mt-1'
      )}
      onMouseEnter={() => setHoveredDate(date)}
      onClick={() => handleDateSelection(date)}
    >
      <AppButton
        variant="plain"
        className={cn(
          isSelected ? 'bg-primary-500 !text-white' : 'hover:bg-gray-300',
          isFirstDayOfSelection ? '!bg-primary-200 !text-inherit' : '',
          'w-full rounded-full py-2 text-center',
          !isVisibleMonth || !isAllowed ? 'text-gray-400' : '',
          !isAllowed ? 'hover:bg-gray-100' : ''
        )}
        disabled={!isAllowed}
      >
        {date.getDate()}
      </AppButton>
    </div>
  );
}

type ModalProps = {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLDivElement | null>;

  children: React.ReactNode;
  className?: string;
};
function Modal({ dropdownRef, inputRef, children, className }: ModalProps) {
  const { top, left, direction } = useDropdown({
    openingItemRef: inputRef,
    dropdownRef,
    dropdownPosition: 'center',
  });

  return (
    <motion.div
      style={{ top: top, left: left }}
      className={cn(
        'fixed z-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden',
        className
      )}
      initial={{ opacity: 0, translateY: '-10%' }}
      animate={{ opacity: 1, translateY: '0' }}
      exit={{ opacity: 0, translateY: direction === 'up' ? '10%' : '-10%' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      ref={dropdownRef}
    >
      {children}
    </motion.div>
  );
}

function RemoveSelectedDatePortal({
  selectedDate,
  disabled,
  portalContainer,
  onResetSelection,
}: {
  selectedDate: Date | undefined;
  disabled?: boolean;
  portalContainer: HTMLDivElement | null;
  onResetSelection: (evt: React.MouseEvent) => void;
}) {
  if (!selectedDate || !portalContainer || disabled) {
    return null;
  }

  return createPortal(
    <AppButton variant="plain" onClick={onResetSelection} className="inline-block p-0 hover:text-red-500">
      <XLgIcon className="h-4 w-4" />
    </AppButton>,
    portalContainer
  );
}
