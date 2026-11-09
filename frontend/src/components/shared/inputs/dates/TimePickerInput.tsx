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

const minuteStep = 30;
const minuteOptions = [0, 30];
const commonHours = [6, 8, 12, 16];
const hourOptions = Array.from({ length: 24 }, (_, hour) => hour);

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

const itemClassName =
  'h-8 w-full shrink-0 snap-center rounded-lg text-[15px] text-neutral-700 tabular-nums transition-colors duration-150 ease-out hover:bg-primary-50 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-transparent';
const selectedClassName = 'bg-primary font-semibold text-inverse-foreground hover:bg-primary';
const columnHeadClassName = 'pt-1 pb-0.5 text-center text-[10px] tracking-wider text-neutral-600 uppercase';

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
  clearable,
  'aria-label': ariaLabel,
}: Props) {
  const [draft, setDraft] = React.useState<Partial<Time>>();
  const [typed, setTyped] = React.useState('');
  const [inputError, setInputError] = React.useState<string>();
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickedHour, setPickedHour] = React.useState<number>();
  const minutesRef = React.useRef<HTMLSpanElement>(null);
  const hoursRef = React.useRef<HTMLSpanElement>(null);
  const hourColumnRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const allErrors = inputError ? [...(errors ?? []), inputError] : errors;
  const aria = useInputAria(allErrors, helper);

  const min = Math.ceil((minimalTime ? timeToMinutes(minimalTime) : 0) / minuteStep) * minuteStep;
  const max = Math.floor((maximalTime ? timeToMinutes(maximalTime) : 24 * 60 - 1) / minuteStep) * minuteStep;
  const shown = draft ?? { hours: time?.hours, minutes: time?.minutes };
  const inRange = (minutes: number) => minutes >= min && minutes <= max;
  const hourAllowed = (hour: number) => hour * 60 + 60 - minuteStep >= min && hour * 60 <= max;
  const centredHour = pickedHour ?? (hourAllowed(8) ? 8 : hourOptions.find(hourAllowed));
  const selectedMinute = pickedHour === time?.hours ? time?.minutes : undefined;
  const minuteTabStop = minuteOptions.includes(selectedMinute ?? -1)
    ? selectedMinute
    : minuteOptions.find((minutes) => pickedHour !== undefined && inRange(pickedHour * 60 + minutes));

  function apply(next: Time | undefined) {
    setDraft(undefined);
    setTyped('');
    setInputError(undefined);
    if (!next) {
      if (!clearable) return time;
      onChange(undefined);
      return undefined;
    }
    if (next.minutes % minuteStep !== 0) {
      setInputError('Wybierz pełną godzinę lub pół godziny.');
      return time;
    }
    if (!inRange(timeToMinutes(next))) {
      setInputError(
        min > max
          ? 'W tym dniu nie ma już wolnych godzin.'
          : `Wybierz godzinę od ${formatTime({ hours: Math.floor(min / 60), minutes: min % 60 })} do ${formatTime({ hours: Math.floor(max / 60), minutes: max % 60 })}.`
      );
      return time;
    }
    onChange(next);
    return next;
  }

  function commitDraft() {
    if (!draft) return time;
    if (draft.hours === undefined && draft.minutes !== undefined) {
      setDraft(undefined);
      setTyped('');
      return time;
    }
    return apply(draft.hours === undefined ? undefined : { hours: draft.hours, minutes: draft.minutes ?? 0 });
  }

  function closePicker() {
    setPickerOpen(false);
    onBlur?.();
  }

  function edit(segment: Segment, value: number | undefined) {
    setDraft({ ...shown, [segment]: value });
    setInputError(undefined);
  }

  function handleSegmentKeyDown(segment: Segment, evt: React.KeyboardEvent<HTMLSpanElement>) {
    if (disabled) return;
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
      setInputError(undefined);
    }
  }

  function renderSegment(segment: Segment) {
    const value = shown[segment];
    return (
      <span
        ref={segment === 'hours' ? hoursRef : minutesRef}
        role="spinbutton"
        tabIndex={disabled ? undefined : 0}
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

  return (
    <div className="flex flex-col">
      <InputLabel name={aria.id} value={label} />
      <input type="hidden" name={name} value={time ? formatTime(time) : ''} disabled={disabled} />
      <Popover.Root
        open={pickerOpen}
        onOpenChange={(open) => {
          if (open) {
            setPickedHour(commitDraft()?.hours);
            setPickerOpen(true);
          } else {
            closePicker();
          }
        }}
        modal={false}
      >
        <div
          ref={fieldRef}
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
            if (evt.currentTarget.contains(evt.relatedTarget) || pickerOpen) return;
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
              aria-label="Wybierz godzinę z listy"
              className="cursor-pointer rounded-sm focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-hidden disabled:cursor-default"
            >
              <ClockIcon className="h-4 w-4" />
            </Popover.Trigger>
          </span>
        </div>
        <PickerPopup
          aria-label="Wybierz godzinę"
          anchor={fieldRef}
          initialFocus={() => hourColumnRef.current?.querySelector<HTMLElement>(`[data-hour="${centredHour}"]`) ?? true}
        >
          <div className="w-56 p-1.5">
            <div className="grid grid-cols-[1fr_1px_1fr]">
              <div>
                <div aria-hidden className={columnHeadClassName}>
                  Godz.
                </div>
                <div
                  ref={(column) => {
                    hourColumnRef.current = column;
                    const centred = column?.querySelector<HTMLElement>(`[data-hour="${centredHour}"]`);
                    if (column && centred) column.scrollTop = centred.offsetTop - 34;
                  }}
                  role="group"
                  aria-label="Godzina"
                  onKeyDown={(evt) => moveFocus(evt, 1)}
                  className="relative flex h-[100px] snap-y snap-mandatory [scrollbar-width:none] flex-col overflow-y-auto [mask-image:linear-gradient(transparent,#000_25%,#000_75%,transparent)] px-1 py-[34px]"
                >
                  {hourOptions.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      data-hour={hour}
                      aria-pressed={hour === pickedHour}
                      tabIndex={hour === centredHour ? 0 : -1}
                      disabled={!hourAllowed(hour)}
                      onClick={(evt) => {
                        setPickedHour(hour);
                        evt.currentTarget.parentElement?.scrollTo({
                          top: evt.currentTarget.offsetTop - 34,
                          behavior: 'smooth',
                        });
                      }}
                      className={cn(itemClassName, hour === pickedHour && selectedClassName)}
                    >
                      {pad(hour)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 mb-1 bg-border" />
              <div>
                <div aria-hidden className={columnHeadClassName}>
                  Min.
                </div>
                <div
                  role="group"
                  aria-label="Minuty"
                  onKeyDown={(evt) => moveFocus(evt, 1)}
                  className="flex h-[100px] flex-col justify-center gap-1 px-1"
                >
                  {minuteOptions.map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      aria-pressed={minutes === selectedMinute}
                      tabIndex={minutes === minuteTabStop ? 0 : -1}
                      disabled={pickedHour === undefined || !inRange(pickedHour * 60 + minutes)}
                      onClick={() => {
                        apply({ hours: pickedHour!, minutes });
                        closePicker();
                      }}
                      className={cn(itemClassName, minutes === selectedMinute && selectedClassName)}
                    >
                      {pad(minutes)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div
              role="group"
              aria-label="Częste godziny"
              onKeyDown={(evt) => moveFocus(evt, 4)}
              className="mt-1 grid grid-cols-4 gap-1 border-t border-border px-0.5 pt-1.5 pb-0.5"
            >
              {commonHours.map((hour) => {
                const selected = time?.hours === hour && time.minutes === 0;
                return (
                  <button
                    key={hour}
                    type="button"
                    aria-pressed={selected}
                    tabIndex={hour === commonHours.find((common) => inRange(common * 60)) ? 0 : -1}
                    disabled={!inRange(hour * 60)}
                    onClick={() => {
                      apply({ hours: hour, minutes: 0 });
                      closePicker();
                    }}
                    className={cn(
                      'rounded-md py-1 text-xs text-neutral-600 tabular-nums transition-colors duration-150 ease-out hover:bg-primary-50 hover:text-primary disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-transparent',
                      selected && 'bg-primary text-inverse-foreground hover:bg-primary hover:text-inverse-foreground'
                    )}
                  >
                    {formatTime({ hours: hour, minutes: 0 })}
                  </button>
                );
              })}
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
