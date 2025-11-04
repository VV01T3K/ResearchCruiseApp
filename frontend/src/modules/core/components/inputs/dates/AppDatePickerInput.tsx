import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { createPortal } from 'react-dom';

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
  required?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
  minimalDate?: Date;
  maximalDate?: Date;
  selectionStartDate?: Date;
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
  required,
  disabled,
  helper,
  placeholder = 'Wybierz datę',
  type = 'date',
  minuteStep,
  minimalDate,
  maximalDate,
  selectionStartDate,
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
  const removeSelectedDatePortalRef = React.useRef<HTMLDivElement>(null);

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
      <div className="flex flex-col">
        <AppInputLabel name={name} value={label} />
        <div ref={inputRef}>
          <input type="hidden" name={name} value={value} required={required} disabled={disabled} />
          <AppButton
            variant="plain"
            onClick={handleInputClick}
            className={cn(
              'relative inline-flex gap-4 p-2.5 justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full',
              disabled ? 'bg-gray-200 hover:cursor-default' : '',
              errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
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
            <span className="flex gap-2 items-center">
              <AppInputErrorTriangle errors={errors} />
              <div ref={removeSelectedDatePortalRef}></div>
              {!selectedDate && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </AppButton>
          {selectedDate &&
            removeSelectedDatePortalRef.current &&
            !disabled &&
            createPortal(
              <AppButton variant="plain" onClick={handleResetSelection} className="inline-block p-0 hover:text-red-500">
                <XLgIcon className="h-4 w-4" />
              </AppButton>,
              removeSelectedDatePortalRef.current!
            )}
        </div>
        <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2 ' : '')}>
          <AppInputHelper helper={helper} />
          <AppInputErrorsList errors={errors} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} inputRef={inputRef}>
            <div className="grid grid-cols-5 items-center px-2 py-2">
              <AppButton
                variant="plain"
                onClick={() => handleMonthChange(-1)}
                className="w-full rounded-lg grid place-items-center hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </AppButton>

              <span className="font-bold col-span-3 inline-flex gap-2 justify-center items-center">
                <AppMonthPickerPopover value={visibleMonth} onChange={setVisibleMonth} />
              </span>

              <AppButton
                variant="plain"
                onClick={() => handleMonthChange(1)}
                className="w-full rounded-lg grid place-items-center hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </AppButton>
            </div>
            <div className="grid grid-cols-7 p-2" onMouseLeave={() => setHoveredDate(undefined)}>
              {shortWeekDays.map((day) => (
                <div key={day} className="font-semibold pb-2 text-center">
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

  return new Date(value);
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
          'w-full text-center py-2 rounded-full',
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
        'fixed origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50',
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
