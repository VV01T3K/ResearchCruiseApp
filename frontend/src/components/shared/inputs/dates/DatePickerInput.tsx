import { Popover } from '@base-ui/react/popover';
import { PickerClearButton, PickerPopup, pickerTriggerClassName } from '@/components/inputs/dates/PickerPopup';
import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { CalendarDotIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import React from 'react';
import { Button } from '@/components/shared/Button';
import { parseBackendDateTime, parseCalendarDate, toCalendarDateValue } from '@/lib/dateUtils';
import { MonthPickerPopover } from '@/components/shared/inputs/dates/MonthPickerPopover';
import { TimePickerInput } from '@/components/shared/inputs/dates/TimePickerInput';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { dateToUtcDay, getDaysInMonth, shortWeekDays } from '@/lib/calendarUtils';
import { cn } from '@/lib/utils';

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
  'aria-label'?: string;
  type?: 'date' | 'datetime';
};
export function DatePickerInput({
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
  minimalDate,
  maximalDate,
  selectionStartDate,
  'aria-label': ariaLabel,
}: Props) {
  const aria = useInputAria(errors, helper);
  const selectedDate = getDateFromValue(value, type);
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>(undefined);
  const [expanded, setExpanded] = React.useState(false);
  const clearRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [visibleMonth, setVisibleMonth] = React.useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const shownValue = selectedDate
    ? selectedDate.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: type === 'datetime' ? '2-digit' : undefined,
        minute: type === 'datetime' ? '2-digit' : undefined,
      })
    : placeholder;
  const fieldName = ariaLabel ?? (typeof label === 'string' ? label : undefined);

  function handleOpenChange(open: boolean, details: Popover.Root.ChangeEventDetails) {
    if (details.reason === 'outside-press' && clearRef.current?.contains(details.event.target as Node)) {
      details.cancel();
      return;
    }
    if (open && selectedDate) {
      setVisibleMonth({ month: selectedDate.getMonth(), year: selectedDate.getFullYear() });
    }
    setExpanded(open);
    if (!open) onBlur?.();
  }

  function handleResetSelection(evt: React.MouseEvent) {
    onChange?.(undefined);
    setExpanded(false);
    onBlur?.();
    triggerRef.current?.focus();
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

    onChange?.(getValueFromDate(newDate, type));
  }

  return (
    <Popover.Root open={expanded} onOpenChange={handleOpenChange} modal={false}>
      <div className="flex flex-col">
        <InputLabel name={aria.id} value={label} showRequiredAsterisk={showRequiredAsterisk} />
        <div className="relative">
          <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />
          <Popover.Trigger
            ref={triggerRef}
            name={name}
            disabled={disabled}
            {...aria.inputProps}
            aria-label={fieldName && `${fieldName}: ${shownValue}`}
            className={pickerTriggerClassName({ disabled, errors })}
          >
            {shownValue}
            <span className="flex items-center gap-2">
              <InputErrorTriangle errors={errors} />
              {selectedDate && !disabled && <span className="w-4" />}
              {!selectedDate && <CalendarDotIcon className="h-4 w-4" />}
            </span>
          </Popover.Trigger>
          {selectedDate && !disabled && (
            <PickerClearButton
              ref={clearRef}
              aria-label="Wyczyść datę"
              onClick={handleResetSelection}
              onMouseDown={(evt) => evt.preventDefault()}
            />
          )}
        </div>
        <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
          <InputHelper id={aria.helperId} helper={helper} />
          <InputErrorsList id={aria.errorId} errors={errors} />
        </div>
      </div>
      <PickerPopup aria-label="Wybierz datę">
        <div className="grid grid-cols-5 items-center px-2 py-2">
          <Button
            variant="plain"
            onClick={() => handleMonthChange(-1)}
            className="grid w-full place-items-center rounded-lg hover:bg-surface-subtle"
          >
            <CaretLeftIcon className="h-5 w-5" />
          </Button>

          <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">
            <MonthPickerPopover value={visibleMonth} onChange={setVisibleMonth} />
          </span>

          <Button
            variant="plain"
            onClick={() => handleMonthChange(1)}
            className="grid w-full place-items-center rounded-lg hover:bg-surface-subtle"
          >
            <CaretRightIcon className="h-5 w-5" />
          </Button>
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
            <TimePickerInput
              name={name}
              value={
                selectedDate && {
                  hours: selectedDate?.getHours(),
                  minutes: selectedDate?.getMinutes(),
                }
              }
              aria-label="Godzina"
              disabled={!selectedDate}
              placeholder="Najpierw wybierz dzień"
              onChange={(x) => {
                const newDate = new Date(selectedDate ?? new Date());
                newDate.setHours(x?.hours ?? 0);
                newDate.setMinutes(x?.minutes ?? 0);
                onChange?.(getValueFromDate(newDate, type));
              }}
              onBlur={onBlur}
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
      </PickerPopup>
    </Popover.Root>
  );
}

function getDateFromValue(value: string | undefined, type: 'date' | 'datetime'): Date | undefined {
  if (!value) {
    return undefined;
  }
  return type === 'date' ? parseCalendarDate(value) : parseBackendDateTime(value);
}

function getValueFromDate(date: Date | undefined, type: 'date' | 'datetime'): string | undefined {
  if (!date) {
    return undefined;
  }

  return type === 'date' ? toCalendarDateValue(date) : date.toISOString();
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
        (!selectedDate && isHoveredBetweenSelection) || isInSelectedRange ? 'bg-surface-subtle' : '',
        'mt-1'
      )}
      onMouseEnter={() => setHoveredDate(date)}
      onClick={() => handleDateSelection(date)}
    >
      <Button
        variant="plain"
        className={cn(
          isSelected ? 'bg-primary-500 !text-inverse-foreground' : 'hover:bg-neutral-300',
          isFirstDayOfSelection ? '!bg-primary-200 !text-inherit' : '',
          'w-full rounded-full py-2 text-center',
          !isVisibleMonth || !isAllowed ? 'text-neutral-400' : '',
          !isAllowed ? 'hover:bg-surface-subtle' : ''
        )}
        disabled={!isAllowed}
      >
        {date.getDate()}
      </Button>
    </div>
  );
}
