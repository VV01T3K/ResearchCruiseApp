'use client';

import { Popover } from '@base-ui/react/popover';
import CalendarEventIcon from 'bootstrap-icons/icons/calendar-event.svg?react';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import XLgIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

import { PickerPopup, pickerTriggerClassName } from '@/components/inputs/dates/PickerPopup';
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
  value,
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
  const [selectedYear, setSelectedYear] = React.useState<number | undefined>(value);
  const [visibleDecade, setVisibleDecade] = React.useState(() => decadeOf(new Date().getFullYear()));
  const [expanded, setExpanded] = React.useState(false);

  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const portalContainerRef = useCallback((node: HTMLDivElement | null) => setPortalContainer(node), []);

  React.useEffect(() => {
    // oxlint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setSelectedYear(value);
  }, [value]);

  function handleOpenChange(open: boolean) {
    if (open && selectedYear) {
      setVisibleDecade(decadeOf(selectedYear));
    }
    setExpanded(open);
    if (!open) onBlur?.();
  }

  function handleResetSelection(evt: React.MouseEvent) {
    setSelectedYear(undefined);
    onChange?.(undefined);
    onBlur?.();
    setExpanded(false);
    evt.preventDefault();
    evt.stopPropagation();
  }

  function handleSelectYear(newYear: number): void {
    setSelectedYear(newYear);
    onChange?.(newYear);
    onBlur?.();
    setExpanded(false);
  }

  return (
    <Popover.Root open={expanded} onOpenChange={handleOpenChange} modal={false}>
      <div className="flex flex-col" data-testid={testId}>
        <AppInputLabel name={aria.id} value={label} showRequiredAsterisk={showRequiredAsterisk} />
        <div>
          <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />
          <Popover.Trigger
            disabled={disabled}
            {...aria.inputProps}
            className={pickerTriggerClassName({ disabled, errors })}
            data-testid={buttonTestId}
          >
            {selectedYear ?? placeholder}
            <span className="flex items-center gap-2">
              <AppInputErrorTriangle errors={errors} />
              <div ref={portalContainerRef}></div>
              {!selectedYear && <CalendarEventIcon className="h-4 w-4" />}
            </span>
          </Popover.Trigger>
          <RemoveSelectedYearPortal
            selectedYear={selectedYear}
            disabled={disabled}
            portalContainer={portalContainer}
            onResetSelection={handleResetSelection}
          />
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
            <ChevronLeftIcon className="h-5 w-5" />
          </AppButton>
          <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">{`${visibleDecade.from}-${visibleDecade.to}`}</span>
          <AppButton
            variant="plain"
            onClick={() => setVisibleDecade((prev) => ({ from: prev.from + 11, to: prev.to + 11 }))}
            className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5" />
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

function RemoveSelectedYearPortal({
  selectedYear,
  disabled,
  portalContainer,
  onResetSelection,
}: {
  selectedYear: number | undefined;
  disabled?: boolean;
  portalContainer: HTMLDivElement | null;
  onResetSelection: (evt: React.MouseEvent) => void;
}) {
  if (!selectedYear || !portalContainer || disabled) {
    return null;
  }

  return createPortal(
    <AppButton variant="plain" onClick={(evt) => onResetSelection(evt)} className="inline-block p-0 hover:text-red-500">
      <XLgIcon className="h-4 w-4" />
    </AppButton>,
    portalContainer
  );
}
