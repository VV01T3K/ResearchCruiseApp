import { Popover } from '@base-ui/react/popover';
import { ClockIcon, XIcon } from '@phosphor-icons/react';
import React from 'react';

import { PickerPopup, pickerTriggerClassName } from '@/components/inputs/dates/PickerPopup';
import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { cn } from '@/lib/utils';

type Time = {
  hours: number;
  minutes: number;
};

type Segment = 'hours' | 'minutes';

function timeToMinutes(time: Time) {
  return time.hours * 60 + time.minutes;
}

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

export function formatTime(time: Time) {
  return `${pad(time.hours)}:${pad(time.minutes)}`;
}

export function typeDigit(typed: string, digit: string, limit: number) {
  const combined = Number(typed + digit);
  const value = typed && combined <= limit ? combined : Number(digit);
  return { value, done: (typed !== '' && value === combined) || value * 10 > limit };
}

function moveFocus(evt: React.KeyboardEvent<HTMLElement>, columns: number) {
  const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns }[evt.key];
  const cells = [...evt.currentTarget.querySelectorAll('button')];
  const index = cells.indexOf(evt.target as HTMLButtonElement);
  if (delta === undefined || index < 0) return;
  evt.preventDefault();
  let next = index + delta;
  while (cells[next]?.disabled) next += delta;
  cells[next]?.focus();
}

const cellClassName =
  'h-8 rounded-md bg-surface-subtle text-sm tabular-nums transition hover:bg-primary-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-surface-subtle';
const selectedCellClassName = 'bg-primary text-inverse-foreground hover:bg-primary';

type Props = {
  name: string;
  value: Time | undefined;

  onChange: (value: Time | undefined) => void;
  onBlur?: () => void;
  errors?: string[];
  label?: string;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
  minimalTime?: Time;
  maximalTime?: Time;
  minuteStep?: number;
  clearable?: boolean;
  'aria-label'?: string;
};
export function TimePickerInput({
  name,
  value: time,
  onChange,
  onBlur,
  errors,
  label,
  disabled,
  helper,
  placeholder,
  minimalTime,
  maximalTime,
  minuteStep = 30,
  clearable,
  'aria-label': ariaLabel,
}: Props) {
  const [draft, setDraft] = React.useState<Partial<Time>>();
  const [typed, setTyped] = React.useState('');
  const [rangeError, setRangeError] = React.useState<string>();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickedHour, setPickedHour] = React.useState<number>();
  const minutesRef = React.useRef<HTMLSpanElement>(null);
  const hoursRef = React.useRef<HTMLSpanElement>(null);
  const hourGridRef = React.useRef<HTMLDivElement>(null);
  const allErrors = rangeError ? [...(errors ?? []), rangeError] : errors;
  const aria = useInputAria(allErrors, helper);

  if (60 % minuteStep !== 0) {
    throw new Error('minuteStep must be a divisor of 60');
  }

  const min = Math.ceil((minimalTime ? timeToMinutes(minimalTime) : 0) / minuteStep) * minuteStep;
  const max = Math.floor((maximalTime ? timeToMinutes(maximalTime) : 24 * 60 - 1) / minuteStep) * minuteStep;
  const shown = draft ?? { hours: time?.hours, minutes: time?.minutes };

  function apply(next: Time | undefined) {
    setDraft(undefined);
    setTyped('');
    setRangeError(undefined);
    if (!next) {
      if (clearable) onChange(undefined);
      return;
    }
    const minutes = Math.round(timeToMinutes(next) / minuteStep) * minuteStep;
    if (minutes < min || minutes > max) {
      setRangeError(
        min > max
          ? 'W tym dniu nie ma już wolnych godzin.'
          : `Wybierz godzinę od ${formatTime({ hours: Math.floor(min / 60), minutes: min % 60 })} do ${formatTime({ hours: Math.floor(max / 60), minutes: max % 60 })}.`
      );
      return;
    }
    onChange({ hours: Math.floor(minutes / 60), minutes: minutes % 60 });
  }

  function commitDraft() {
    if (!draft) return;
    if (draft.hours === undefined && draft.minutes !== undefined) {
      setDraft(undefined);
      setTyped('');
      return;
    }
    apply(draft.hours === undefined ? undefined : { hours: draft.hours, minutes: draft.minutes ?? 0 });
  }

  function edit(segment: Segment, value: number | undefined) {
    setDraft({ ...shown, [segment]: value });
    setRangeError(undefined);
  }

  function handleSegmentKeyDown(segment: Segment, evt: React.KeyboardEvent<HTMLSpanElement>) {
    const value = shown[segment];
    const limit = segment === 'hours' ? 23 : 59;
    const step = segment === 'hours' ? 1 : minuteStep;
    if (/^\d$/.test(evt.key)) {
      evt.preventDefault();
      const next = typeDigit(typed, evt.key, limit);
      edit(segment, next.value);
      setTyped(next.done ? '' : evt.key);
      if (next.done && segment === 'hours') minutesRef.current?.focus();
      return;
    }
    if (evt.key === 'ArrowUp' || evt.key === 'ArrowDown') {
      evt.preventDefault();
      const up = evt.key === 'ArrowUp';
      const steps = value === undefined ? 0 : up ? Math.floor(value / step) + 1 : Math.ceil(value / step) - 1;
      const start = value === undefined && segment === 'hours' ? Math.floor(min / 60) : 0;
      edit(segment, value === undefined ? start : (steps * step + limit + 1) % (limit + 1));
      setTyped('');
    } else if (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') {
      evt.preventDefault();
      (evt.key === 'ArrowLeft' ? hoursRef : minutesRef).current?.focus();
    } else if (evt.key === 'Backspace' || evt.key === 'Delete') {
      evt.preventDefault();
      edit(segment, undefined);
      setTyped('');
    } else if (evt.key === 'Enter') {
      evt.preventDefault();
      commitDraft();
    } else if (evt.key === 'Escape') {
      setDraft(undefined);
      setTyped('');
      setRangeError(undefined);
    }
  }

  function renderSegment(segment: Segment) {
    const value = shown[segment];
    return (
      <span
        ref={segment === 'hours' ? hoursRef : minutesRef}
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={segment === 'hours' ? 'godzina' : 'minuty'}
        aria-valuenow={value}
        aria-valuetext={value === undefined ? 'puste' : pad(value)}
        aria-valuemin={0}
        aria-valuemax={segment === 'hours' ? 23 : 59}
        aria-disabled={disabled || undefined}
        aria-invalid={hasErrors(allErrors)}
        onFocus={() => setTyped('')}
        onKeyDown={(evt) => handleSegmentKeyDown(segment, evt)}
        className={cn(
          'rounded-sm px-0.5 text-center tabular-nums outline-hidden',
          !disabled && 'focus:bg-primary focus:text-inverse-foreground',
          value === undefined && 'text-neutral-500'
        )}
      >
        {value === undefined ? (segment === 'hours' ? 'gg' : 'mm') : pad(value)}
      </span>
    );
  }

  const hourAllowed = (hour: number) => hour * 60 + 60 - minuteStep >= min && hour * 60 <= max;
  const minuteAllowed = (minutes: number) =>
    pickedHour !== undefined && pickedHour * 60 + minutes >= min && pickedHour * 60 + minutes <= max;
  const minuteOptions = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);
  const hourTabStop = pickedHour ?? Array.from({ length: 24 }, (_, hour) => hour).find(hourAllowed);
  const selectedMinute = pickedHour === time?.hours ? time?.minutes : undefined;
  const minuteTabStop = minuteOptions.includes(selectedMinute ?? -1)
    ? selectedMinute
    : minuteOptions.find(minuteAllowed);

  return (
    <div className="flex flex-col">
      <InputLabel name={aria.id} value={label} />
      <input type="hidden" name={name} value={time ? formatTime(time) : ''} disabled={disabled} />
      <Popover.Root
        open={pickerOpen}
        onOpenChange={(open) => {
          setPickerOpen(open);
          if (open) setPickedHour(time?.hours);
        }}
        modal={false}
      >
        <div
          role="group"
          {...aria.inputProps}
          aria-label={ariaLabel ?? label}
          className={pickerTriggerClassName({
            disabled,
            errors: allErrors,
            className: 'cursor-text justify-start gap-0 focus-within:border-primary-500',
          })}
          onMouseDown={(evt) => {
            if (!disabled && evt.target === evt.currentTarget) {
              evt.preventDefault();
              hoursRef.current?.focus();
            }
          }}
          onBlur={(evt) => {
            if (evt.currentTarget.contains(evt.relatedTarget)) return;
            commitDraft();
            onBlur?.();
          }}
        >
          {disabled && !time && placeholder ? (
            <span className="truncate">{placeholder}</span>
          ) : (
            <>
              {renderSegment('hours')}
              <span className="px-0.5 text-neutral-500">:</span>
              {renderSegment('minutes')}
            </>
          )}
          <span className="ml-auto flex items-center gap-1.5">
            <InputErrorTriangle errors={allErrors} />
            {clearable && time && !disabled && (
              <button
                type="button"
                aria-label="Wyczyść godzinę"
                onMouseDown={(evt) => evt.preventDefault()}
                onClick={() => {
                  apply(undefined);
                  onBlur?.();
                }}
                className="cursor-pointer rounded-sm hover:text-danger-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-hidden"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
            <Popover.Trigger
              disabled={disabled}
              aria-label="Wybierz godzinę z siatki"
              className="cursor-pointer rounded-sm focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-hidden disabled:cursor-default"
            >
              <ClockIcon className="h-4 w-4" />
            </Popover.Trigger>
          </span>
        </div>
        <PickerPopup
          aria-label="Wybierz godzinę"
          initialFocus={() => hourGridRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]') ?? true}
        >
          <div className="w-60 p-2.5">
            <div className="mb-1.5 text-xs font-medium text-neutral-600">Godzina</div>
            <div
              ref={hourGridRef}
              role="group"
              aria-label="Godzina"
              className="grid grid-cols-6 gap-1"
              onKeyDown={(evt) => moveFocus(evt, 6)}
            >
              {Array.from({ length: 24 }, (_, hour) => (
                <button
                  key={hour}
                  type="button"
                  aria-pressed={hour === pickedHour}
                  tabIndex={hour === hourTabStop ? 0 : -1}
                  disabled={!hourAllowed(hour)}
                  onClick={() => setPickedHour(hour)}
                  className={cn(cellClassName, hour === pickedHour && selectedCellClassName)}
                >
                  {pad(hour)}
                </button>
              ))}
            </div>
            <div className="mt-3 mb-1.5 text-xs font-medium text-neutral-600">Minuty</div>
            <div
              role="group"
              aria-label="Minuty"
              className="grid grid-cols-4 gap-1"
              onKeyDown={(evt) => moveFocus(evt, 4)}
            >
              {minuteOptions.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  aria-pressed={minutes === selectedMinute}
                  tabIndex={minutes === minuteTabStop ? 0 : -1}
                  disabled={!minuteAllowed(minutes)}
                  onClick={() => {
                    apply({ hours: pickedHour!, minutes });
                    setPickerOpen(false);
                  }}
                  className={cn(cellClassName, minutes === selectedMinute && selectedCellClassName)}
                >
                  {pad(minutes)}
                </button>
              ))}
            </div>
          </div>
        </PickerPopup>
      </Popover.Root>
      <div className={cn('flex flex-col justify-between text-sm', hasErrors(allErrors) || helper ? 'mt-2' : '')}>
        <InputHelper id={aria.helperId} helper={helper} />
        <InputErrorsList id={aria.errorId} errors={allErrors} />
      </div>
    </div>
  );
}
