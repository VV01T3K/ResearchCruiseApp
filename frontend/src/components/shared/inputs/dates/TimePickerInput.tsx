import { Autocomplete } from '@base-ui/react/autocomplete';
import { ClockIcon } from '@phosphor-icons/react';
import React from 'react';

import { PickerClearButton, pickerTriggerClassName } from '@/components/inputs/dates/PickerPopup';
import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { stickyBarsCollisionPadding } from '@/components/layout/stickyBarsCollisionPadding';
import { dropdownItemClassName, dropdownPopupClassName } from '@/components/shared/inputs/DropdownInput';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { cn } from '@/lib/utils';

type Time = {
  hours: number;
  minutes: number;
};

function timeToMinutes(time: Time) {
  return time.hours * 60 + time.minutes;
}

export function formatTime(time: Time) {
  return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
}

export function parseTime(text: string): Time | undefined {
  const match = /^(\d{1,2})(?:[:.]?(\d{2}))?$/.exec(text.trim());
  const hours = Number(match?.[1]);
  const minutes = Number(match?.[2] ?? 0);
  return match && hours < 24 && minutes < 60 ? { hours, minutes } : undefined;
}

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
  placeholder = 'gg:mm',
  minimalTime,
  maximalTime,
  minuteStep = 30,
  clearable,
  'aria-label': ariaLabel,
}: Props) {
  const aria = useInputAria(errors, helper);
  const [draft, setDraft] = React.useState<string>();

  if (60 % minuteStep !== 0) {
    throw new Error('minuteStep must be a divisor of 60');
  }

  const min = Math.ceil((minimalTime ? timeToMinutes(minimalTime) : 0) / minuteStep) * minuteStep;
  const max = Math.floor((maximalTime ? timeToMinutes(maximalTime) : 24 * 60 - 1) / minuteStep) * minuteStep;
  const times = Array.from({ length: (max - min) / minuteStep + 1 }, (_, i) => {
    const minutes = min + i * minuteStep;
    return formatTime({ hours: Math.floor(minutes / 60), minutes: minutes % 60 });
  });
  const shown = time ? formatTime(time) : '';
  const typedDigits = draft?.replace(/\D/g, '');
  const shownTimes = typedDigits
    ? times.filter((item) =>
        [typedDigits, `0${typedDigits}`].some((digits) => item.replace(':', '').startsWith(digits))
      )
    : times;

  function commit(text: string) {
    setDraft(undefined);
    const parsed = parseTime(text);
    if (!text.trim()) {
      if (clearable) onChange(undefined);
      return;
    }
    if (!parsed) return;
    const minutes = Math.min(Math.max(Math.round(timeToMinutes(parsed) / minuteStep) * minuteStep, min), max);
    onChange({ hours: Math.floor(minutes / 60), minutes: minutes % 60 });
  }

  return (
    <div className="flex flex-col">
      <InputLabel name={aria.id} value={label} />
      <Autocomplete.Root
        items={times}
        filteredItems={shownTimes}
        value={draft ?? shown}
        onValueChange={(text, details) => {
          if (details.reason === 'item-press') commit(text);
          else if (details.reason === 'escape-key') setDraft(undefined);
          else setDraft(text.replace(/[^\d:.]/g, '').slice(0, 5));
        }}
        disabled={disabled}
        openOnInputClick
        autoHighlight
      >
        <div className="relative">
          <input type="hidden" name={name} value={shown} disabled={disabled} />
          <Autocomplete.Input
            {...aria.inputProps}
            aria-label={ariaLabel}
            placeholder={placeholder}
            inputMode="numeric"
            autoComplete="off"
            className={pickerTriggerClassName({
              disabled,
              errors,
              className: cn(hasErrors(errors) ? 'pr-16' : 'pr-9', 'placeholder:text-neutral-500'),
            })}
            onBlur={() => {
              if (draft !== undefined) commit(draft);
              onBlur?.();
            }}
            onKeyDown={(evt) => {
              if (
                evt.key === 'Enter' &&
                draft !== undefined &&
                !evt.currentTarget.hasAttribute('aria-activedescendant')
              ) {
                evt.preventDefault();
                commit(draft);
              }
            }}
          />
          <span className="absolute top-1/2 right-8 -translate-y-1/2">
            <InputErrorTriangle errors={errors} />
          </span>
          {clearable && time && !disabled ? (
            <PickerClearButton
              aria-label="Wyczyść godzinę"
              onMouseDown={(evt) => evt.preventDefault()}
              onClick={() => {
                setDraft(undefined);
                onChange(undefined);
                onBlur?.();
              }}
            />
          ) : (
            <Autocomplete.Trigger
              aria-label="Pokaż listę godzin"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-sm focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-hidden disabled:cursor-default"
            >
              <ClockIcon className="h-4 w-4" />
            </Autocomplete.Trigger>
          )}
        </div>
        <Autocomplete.Portal>
          <Autocomplete.Positioner
            className="z-50 w-[var(--anchor-width)]"
            sideOffset={4}
            collisionPadding={stickyBarsCollisionPadding}
          >
            <Autocomplete.Popup aria-label="Wybierz godzinę" className={dropdownPopupClassName}>
              <Autocomplete.List className="relative flex max-h-60 flex-col overflow-y-auto empty:hidden">
                {(item: string) => (
                  <Autocomplete.Item
                    key={item}
                    value={item}
                    ref={
                      item === shown
                        ? (el: HTMLElement | null) => {
                            if (el?.parentElement) el.parentElement.scrollTop = el.offsetTop - 96;
                          }
                        : undefined
                    }
                    className={cn(
                      dropdownItemClassName,
                      item === shown && 'bg-primary-50 font-medium text-primary-800'
                    )}
                  >
                    {item}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
        <InputHelper id={aria.helperId} helper={helper} />
        <InputErrorsList id={aria.errorId} errors={errors} />
      </div>
    </div>
  );
}
