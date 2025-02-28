import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { createPortal } from 'react-dom';

import { AppButton } from '@/core/components/AppButton';
import { AppMonthPickerPopover } from '@/core/components/inputs/dates/AppMonthPickerPopover';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn } from '@/core/lib/utils';

const weekDays = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

type Props = {
  name: string;
  value: string | undefined;

  onChange: (value: string | undefined) => void;
  onBlur: () => void;
  errors?: string[];
  label?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
};
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
}: Props) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(() => getDateFromValue(value));
  const [expanded, setExpanded] = React.useState(false);
  const [visibleMonth, setVisibleMonth] = React.useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const inputRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const removeSelectedDatePortalRef = React.useRef<HTMLDivElement>(null);

  useOutsideClickDetection({
    refs: [inputRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
      onBlur();
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
    onChange(undefined);
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

    setSelectedDate(newDate);
    onChange(getValueFromDate(newDate));
    setExpanded(false);
  }

  return (
    <>
      <div className="flex flex-col">
        <AppInputLabel name={name} label={label} />
        <div className={cn()} ref={inputRef}>
          <input type="hidden" name={name} value={value} required={required} disabled={disabled} />
          <AppButton
            variant="plain"
            onClick={handleInputClick}
            className={cn(
              'relative inline-flex gap-4 justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full',
              disabled ? 'bg-gray-200' : '',
              errors ? 'border-danger ring-danger text-danger focus:text-gray-900' : ''
            )}
          >
            {selectedDate
              ? selectedDate.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
              : placeholder}
            <span className="flex gap-2 items-center">
              <AppInputErrorTriangle errors={errors} />
              <div ref={removeSelectedDatePortalRef}></div>
              {!selectedDate && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </AppButton>
          {selectedDate &&
            removeSelectedDatePortalRef.current &&
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
            <div className="grid grid-cols-7 p-2">
              {weekDays.map((day) => (
                <div key={day} className="font-semibold pb-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth(visibleMonth).map((date) => (
                <AppButton
                  key={date.getTime()}
                  variant="plain"
                  onClick={() => handleDateSelection(date)}
                  className={cn(
                    selectedDate?.getTime() === date.getTime() ? 'bg-primary-500 text-white' : '',
                    'w-full text-center py-2 hover:bg-gray-100',
                    date.getMonth() !== visibleMonth.month ? 'text-gray-400' : ''
                  )}
                >
                  {date.getDate()}
                </AppButton>
              ))}
            </div>
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

function getDaysInMonth({ month, year }: { month: number; year: number }): Date[] {
  const date = findClosestMondayBefore(new Date(year, month, 1));
  const days = [];
  while (
    month > 0
      ? date.getFullYear() <= year && date.getMonth() <= month
      : date.getFullYear() < year || date.getMonth() < 1
  ) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  while (date.getDay() > 1 || date.getDay() < 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function findClosestMondayBefore(date: Date): Date {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
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
