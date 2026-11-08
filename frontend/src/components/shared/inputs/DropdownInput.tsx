import { stickyBarsCollisionPadding } from '@/components/layout/stickyBarsCollisionPadding';
import { hasErrors, invalidInputClassName } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { Select } from '@base-ui/react/select';
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import React from 'react';

import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { cn } from '@/lib/utils';

export type DropdownInputOption = {
  value: string;
  inlineLabel: React.ReactNode;
  richLabel?: React.ReactNode;
};

export const dropdownPopupClassName = cn(
  'w-full origin-[var(--transform-origin)] overflow-hidden rounded-lg bg-surface shadow-xl ring-1 ring-neutral-950/10',
  'transition-all duration-300 ease-popup',
  'data-[starting-style]:translate-y-1 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
  'data-[ending-style]:translate-y-1 data-[ending-style]:scale-90 data-[ending-style]:opacity-0'
);

export const dropdownItemClassName = cn(
  'flex items-center justify-between gap-2 border-b border-border-muted px-3 py-2 text-sm text-neutral-700 last:border-b-0',
  'cursor-pointer focus-visible:outline-hidden select-none',
  'transition-all duration-150 ease-out',
  'data-[highlighted]:bg-primary-50 data-[highlighted]:text-foreground',
  'data-[selected]:bg-primary-50 data-[selected]:text-primary-800 data-[selected]:font-medium'
);

type Props = {
  name: string;
  value: string;
  allOptions: DropdownInputOption[];

  onChange?: (value: string) => void;
  onBlur?: () => void;
  errors?: string[];
  label?: React.ReactNode;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
  helper?: React.ReactNode;
  allowEmptyOption?: boolean;
  placeholder?: string;
  defaultValue?: string;
  'aria-label'?: string;
};

export function DropdownInput({
  name,
  value,
  allOptions,
  onChange,
  onBlur,
  errors,
  label,
  showRequiredAsterisk,
  disabled,
  helper,
  allowEmptyOption = false,
  placeholder = 'Wybierz',
  defaultValue = '',
  'aria-label': ariaLabel,
}: Props) {
  const aria = useInputAria(errors, helper);
  const allPossibleOptions = React.useMemo(() => {
    if (allowEmptyOption) {
      return [
        {
          value: defaultValue,
          inlineLabel: placeholder,
          richLabel: value !== defaultValue ? <span className="text-danger-500">Usuń aktualny wybór</span> : undefined,
        },
        ...allOptions,
      ];
    }
    return allOptions;
  }, [allowEmptyOption, allOptions, defaultValue, placeholder, value]);

  const selectedOption = allOptions.find((opt) => opt.value === value);

  const handleValueChange = React.useCallback(
    (newValue: string | null) => {
      onChange?.(newValue ?? defaultValue);
    },
    [onChange, defaultValue]
  );

  return (
    <div className="flex flex-col">
      <InputLabel name={aria.id} value={label} showRequiredAsterisk={showRequiredAsterisk} />

      <Select.Root
        name={name}
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        modal={false}
        onOpenChange={(open) => {
          if (!open) {
            onBlur?.();
          }
        }}
      >
        <Select.Trigger
          {...aria.inputProps}
          aria-label={ariaLabel}
          className={cn(
            'relative inline-flex w-full items-center justify-between',
            'rounded-lg border border-border bg-surface-muted text-sm text-foreground',
            'p-2.5',
            'transition duration-300 ease-in-out',
            !disabled && 'cursor-pointer hover:border-neutral-400',
            !disabled && 'focus:border-primary-500 focus:ring-primary-500 focus:outline-hidden focus:ring-inset',
            disabled && 'cursor-not-allowed bg-neutral-200',
            hasErrors(errors) && invalidInputClassName
          )}
        >
          <Select.Value>{() => selectedOption?.inlineLabel ?? placeholder}</Select.Value>
          <span className="flex items-center gap-2">
            <InputErrorTriangle errors={errors} />
            {!disabled && (
              <Select.Icon className="transition-transform duration-300 ease-out data-[popup-open]:rotate-180">
                <CaretDownIcon className="h-5 w-5" />
              </Select.Icon>
            )}
          </span>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner
            className="z-50 w-[var(--anchor-width)]"
            sideOffset={4}
            collisionPadding={stickyBarsCollisionPadding}
            alignItemWithTrigger={false}
          >
            <Select.Popup className={dropdownPopupClassName}>
              <Select.List className="flex max-h-64 flex-col overflow-y-auto">
                {allPossibleOptions
                  .filter((opt) => Boolean(opt.inlineLabel || opt.richLabel))
                  .map((opt) => (
                    <Select.Item
                      key={`dropdown-option-${opt.value}`}
                      value={opt.value}
                      className={dropdownItemClassName}
                    >
                      <Select.ItemText>{opt.richLabel ?? opt.inlineLabel}</Select.ItemText>
                      <Select.ItemIndicator className="text-primary transition-transform duration-200 data-[ending-style]:scale-0">
                        <CheckIcon className="h-4 w-4 scale-75" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      <div className={cn('flex flex-col justify-between text-sm', hasErrors(errors) || helper ? 'mt-2' : '')}>
        <InputHelper id={aria.helperId} helper={helper} />
        <InputErrorsList id={aria.errorId} errors={errors} />
      </div>
    </div>
  );
}
