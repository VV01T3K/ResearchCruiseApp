import { Popover } from '@base-ui/react/popover';
import { PickerClearButton, PickerPopup, pickerTriggerClassName } from '@/components/inputs/dates/PickerPopup';
import { hasErrors } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { CalendarDotIcon } from '@phosphor-icons/react';
import React from 'react';

import { AppMonthPicker } from '@/components/shared/inputs/dates/AppMonthPicker';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/components/shared/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/components/shared/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/components/shared/inputs/parts/AppInputLabel';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  value: string | undefined;

  onChange?: (value: string | undefined) => void;
  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  disabled?: boolean;
  helper?: React.ReactNode;
  placeholder?: string;
};
export function AppMonthPickerInput({
  name,
  value,
  onChange,
  onBlur,
  errors,
  label,
  disabled,
  helper,
  placeholder = 'Wybierz miesiąc',
}: Props) {
  const aria = useInputAria(errors, helper);
  const selectedDate = getDateFromValue(value);
  const [expanded, setExpanded] = React.useState(false);

  function handleOpenChange(open: boolean) {
    setExpanded(open);
    if (!open) onBlur?.();
  }

  function handleSelectMonth(newDate: Date) {
    onChange?.(getValueFromDate(newDate));
    setExpanded(false);
    onBlur?.();
  }

  function handleResetSelection(evt: React.MouseEvent) {
    onChange?.(undefined);
    setExpanded(false);
    onBlur?.();
    evt.stopPropagation();
    evt.preventDefault();
  }

  return (
    <Popover.Root open={expanded} onOpenChange={handleOpenChange} modal={false}>
      <div className="flex flex-col">
        <AppInputLabel name={aria.id} value={label} />
        <div className="relative">
          <input type="hidden" name={name} value={value ?? ''} disabled={disabled} />
          <Popover.Trigger
            name={name}
            disabled={disabled}
            {...aria.inputProps}
            className={pickerTriggerClassName({ disabled, errors })}
          >
            {selectedDate
              ? selectedDate.toLocaleDateString('pl-PL', { month: '2-digit', year: 'numeric' })
              : placeholder}
            <span className="flex items-center gap-2">
              <AppInputErrorTriangle errors={errors} />
              {selectedDate && !disabled && <span className="w-4" />}
              {!selectedDate && <CalendarDotIcon className="h-4 w-4" />}
            </span>
          </Popover.Trigger>
          {selectedDate && !disabled && (
            <PickerClearButton aria-label="Wyczyść miesiąc" onClick={handleResetSelection} />
          )}
        </div>
        <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
          <AppInputHelper id={aria.helperId} helper={helper} />
          <AppInputErrorsList id={aria.errorId} errors={errors} />
        </div>
      </div>
      <PickerPopup aria-label="Wybierz miesiąc">
        <AppMonthPicker selectedDate={selectedDate} onSelectMonth={handleSelectMonth} />
      </PickerPopup>
    </Popover.Root>
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
