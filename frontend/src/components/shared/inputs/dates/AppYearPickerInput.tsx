'use client';

import { Popover } from '@base-ui/react/popover';
import { CalendarDotIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import React from 'react';

import { PickerClearButton, PickerPopup, pickerTriggerClassName } from '@/components/inputs/dates/PickerPopup';
import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { AppButton } from '@/components/shared/AppButton';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/components/shared/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/components/shared/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/components/shared/inputs/parts/AppInputLabel';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  value: number | undefined;

  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
  'data-testid'?: string;
  'data-testid-button'?: string;
  'data-testid-errors'?: string;
};
export function AppYearPickerInput({
  name,
  value: selectedYear,
  onChange,
  onBlur,
  errors,
  label,
  showRequiredAsterisk,
  disabled,
  helper,
  placeholder = 'Wybierz rok',
  'data-testid': testId,
  'data-testid-button': buttonTestId,
  'data-testid-errors': errorsTestId,
}: Props) {
  const aria = useInputAria(errors, helper);
  const [visibleDecade, setVisibleDecade] = React.useState(() => decadeOf(new Date().getFullYear()));
  const [expanded, setExpanded] = React.useState(false);
  const clearRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  function handleOpenChange(open: boolean, details: Popover.Root.ChangeEventDetails) {
    if (details.reason === 'outside-press' && clearRef.current?.contains(details.event.target as Node)) {
      details.cancel();
      return;
    }
    if (open && selectedYear) {
      setVisibleDecade(decadeOf(selectedYear));
    }
    setExpanded(open);
    if (!open) onBlur?.();
  }

  function handleResetSelection(evt: React.MouseEvent) {
    onChange?.(undefined);
    onBlur?.();
    setExpanded(false);
    triggerRef.current?.focus();
    evt.preventDefault();
    evt.stopPropagation();
  }

  function handleSelectYear(newYear: number): void {
    onChange?.(newYear);
    onBlur?.();
    setExpanded(false);
  }

  return (
    <Popover.Root open={expanded} onOpenChange={handleOpenChange} modal={false}>
      <div className="flex flex-col" data-testid={testId}>
        <AppInputLabel name={aria.id} value={label} showRequiredAsterisk={showRequiredAsterisk} />
        <div className="relative">
          <input type="hidden" name={name} value={selectedYear ?? ''} disabled={disabled} />
          <Popover.Trigger
            ref={triggerRef}
            disabled={disabled}
            {...aria.inputProps}
            className={pickerTriggerClassName({ disabled, errors })}
            data-testid={buttonTestId}
          >
            {selectedYear ?? placeholder}
            <span className="flex items-center gap-2">
              <AppInputErrorTriangle errors={errors} />
              {selectedYear && !disabled && <span className="w-4" />}
              {!selectedYear && <CalendarDotIcon className="h-4 w-4" />}
            </span>
          </Popover.Trigger>
          {selectedYear && !disabled && (
            <PickerClearButton
              ref={clearRef}
              aria-label="Wyczyść rok"
              onClick={handleResetSelection}
              onMouseDown={(evt) => evt.preventDefault()}
            />
          )}
        </div>
        <div className={cn('flex flex-row justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
          <AppInputHelper id={aria.helperId} helper={helper} />
          <AppInputErrorsList id={aria.errorId} errors={errors} data-testid={errorsTestId} />
        </div>
      </div>

      <PickerPopup aria-label="Wybierz rok">
        <div className="grid grid-cols-5 items-center px-2 py-2">
          <AppButton
            variant="plain"
            onClick={() => setVisibleDecade((prev) => ({ from: prev.from - 11, to: prev.to - 11 }))}
            className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
          >
            <CaretLeftIcon className="h-5 w-5" />
          </AppButton>
          <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">{`${visibleDecade.from}-${visibleDecade.to}`}</span>
          <AppButton
            variant="plain"
            onClick={() => setVisibleDecade((prev) => ({ from: prev.from + 11, to: prev.to + 11 }))}
            className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
          >
            <CaretRightIcon className="h-5 w-5" />
          </AppButton>
        </div>
        <div className="grid grid-cols-3 gap-4 px-4 py-2">
          {Array.from({ length: visibleDecade.to - visibleDecade.from + 1 })
            .map((_, index) => visibleDecade.from + index)
            .map((year) => (
              <AppButton
                key={year}
                variant="plain"
                onClick={() => handleSelectYear(year)}
                className={cn(
                  'grid place-items-center rounded-lg hover:bg-gray-100',
                  year === selectedYear ? 'text-primary-500 font-bold' : ''
                )}
              >
                {year}
              </AppButton>
            ))}
        </div>
      </PickerPopup>
    </Popover.Root>
  );
}

function decadeOf(year: number) {
  const from = Math.floor(year / 10) * 10;
  return { from, to: from + 11 };
}
