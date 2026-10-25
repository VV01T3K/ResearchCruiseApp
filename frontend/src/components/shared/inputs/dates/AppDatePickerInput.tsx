import { Popover } from '@base-ui/react/popover';
import { PickerClearButton, PickerPopup, pickerTriggerClassName } from '@/components/inputs/dates/PickerPopup';
import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { CalendarDotIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import React from 'react';
import { AppButton } from '@/components/shared/AppButton';
import { parseBackendDateTime } from '@/lib/dateUtils';
import { AppMonthPickerPopover } from '@/components/shared/inputs/dates/AppMonthPickerPopover';
import { AppDatePickerTimeInput } from '@/components/shared/inputs/dates/AppTimePickerInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/components/shared/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/components/shared/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/components/shared/inputs/parts/AppInputLabel';
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
  const aria = useInputAria(errors, helper);
  const selectedDate = getDateFromValue(value);
  const [hoveredDate, setHoveredDate] = React.useState<Date | undefined>(undefined);
  const [expanded, setExpanded] = React.useState(false);
  const [visibleMonth, setVisibleMonth] = React.useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  function handleOpenChange(open: boolean) {
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

    onChange?.(getValueFromDate(newDate));
    if (type === 'date') {
      setExpanded(false);
      onBlur?.();
    }
  }

  return (
    <Popover.Root open={expanded} onOpenChange={handleOpenChange} modal={false}>
      <div className="flex flex-col" data-testid={testId}>
        <AppInputLabel name={aria.id} value={label} showRequiredAsterisk={showRequiredAsterisk} />
        <div className="relative">
          <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />
          <Popover.Trigger
            name={name}
            disabled={disabled}
            {...aria.inputProps}
            className={pickerTriggerClassName({ disabled, errors })}
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
              {selectedDate && !disabled && <span className="w-4" />}
              {!selectedDate && <CalendarDotIcon className="h-4 w-4" />}
            </span>
          </Popover.Trigger>
          {selectedDate && !disabled && <PickerClearButton aria-label="Wyczyść datę" onClick={handleResetSelection} />}
        </div>
        <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
          <AppInputHelper id={aria.helperId} helper={helper} />
          <AppInputErrorsList id={aria.errorId} errors={errors} data-testid={errorsTestId} />
        </div>
      </div>
      <PickerPopup aria-label="Wybierz datę">
        <div className="grid grid-cols-5 items-center px-2 py-2">
          <AppButton
            variant="plain"
            onClick={() => handleMonthChange(-1)}
            className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
          >
            <CaretLeftIcon className="h-5 w-5" />
          </AppButton>

          <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">
            <AppMonthPickerPopover value={visibleMonth} onChange={setVisibleMonth} />
          </span>

          <AppButton
            variant="plain"
            onClick={() => handleMonthChange(1)}
            className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
          >
            <CaretRightIcon className="h-5 w-5" />
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
      </PickerPopup>
    </Popover.Root>
  );
}

function getDateFromValue(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  return parseBackendDateTime(value);
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
