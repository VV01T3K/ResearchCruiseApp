import { Select } from '@base-ui/react/select';
import CheckIcon from 'bootstrap-icons/icons/check.svg?react';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import React from 'react';

import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';
import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';
import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';
import { cn } from '@/core/lib/utils';

export type AppDropdownInputOption = {
  value: string;
  inlineLabel: React.ReactNode;
  richLabel?: React.ReactNode;
};

type Props = {
  name: string;
  value: string;
  allOptions: AppDropdownInputOption[];

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
  'data-testid'?: string;
  'data-testid-button'?: string;
  'data-testid-errors'?: string;
};

export function AppDropdownInput({
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
  'data-testid': testId,
  'data-testid-button': buttonTestId,
  'data-testid-errors': errorsTestId,
}: Props) {
  const allPossibleOptions = React.useMemo(() => {
    if (allowEmptyOption) {
      return [
        {
          value: defaultValue,
          inlineLabel: placeholder,
          richLabel: value !== defaultValue ? <span className="text-red-500">Usuń aktualny wybór</span> : undefined,
        },
        ...allOptions,
      ];
    }
    return allOptions;
  }, [allowEmptyOption, allOptions, defaultValue, placeholder, value]);

  const selectedOption = allOptions.find((opt) => opt.value === value);
  const hasError = errors && errors.length > 0;

  const handleValueChange = React.useCallback(
    (newValue: string | null) => {
      onChange?.(newValue ?? defaultValue);
    },
    [onChange, defaultValue]
  );

  return (
    <div className="flex flex-col" data-testid={testId}>
      <AppInputLabel name={name} value={label} showRequiredAsterisk={showRequiredAsterisk} />

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
          className={cn(
            'relative inline-flex w-full items-center justify-between',
            'rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900',
            'p-2.5 ring-2 ring-transparent',
            'transition duration-300 ease-in-out',
            !disabled && 'cursor-pointer hover:border-gray-400',
            !disabled && 'focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none',
            disabled && 'cursor-not-allowed bg-gray-200',
            hasError && 'border-danger ring-danger text-danger focus:text-gray-900'
          )}
          data-testid={testId ? `${testId}-button` : undefined}
        >
          <Select.Value>{() => selectedOption?.inlineLabel ?? placeholder}</Select.Value>
          <span className="flex items-center gap-2">
            <AppInputErrorTriangle errors={errors} />
            {!disabled && (
              <Select.Icon className="transition-transform duration-300 ease-out data-[popup-open]:rotate-180">
                <ChevronDownIcon className="h-5 w-5" />
              </Select.Icon>
            )}
          </span>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner className="z-50 min-w-[var(--anchor-width)]" sideOffset={4} alignItemWithTrigger={false}>
            <Select.Popup
              className={cn(
                'w-full origin-[var(--transform-origin)] rounded-lg bg-white shadow-xl ring-1 ring-black/10',
                'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                'data-[starting-style]:translate-y-1 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
                'data-[ending-style]:translate-y-1 data-[ending-style]:scale-90 data-[ending-style]:opacity-0'
              )}
            >
              <Select.List className="flex max-h-64 flex-col gap-1 overflow-y-auto p-1">
                {allPossibleOptions
                  .filter((opt) => opt.inlineLabel || opt.richLabel)
                  .map((opt) => (
                    <Select.Item
                      key={`dropdown-option-${opt.value}`}
                      value={opt.value}
                      className={cn(
                        'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-gray-700',
                        'cursor-pointer outline-none select-none',
                        'transition-all duration-150 ease-out',
                        'data-[highlighted]:bg-primary-50 data-[highlighted]:text-gray-900',
                        'data-[selected]:bg-primary-50 data-[selected]:text-primary-800 data-[selected]:font-medium'
                      )}
                    >
                      <Select.ItemText>{opt.richLabel ?? opt.inlineLabel}</Select.ItemText>
                      <Select.ItemIndicator className="text-primary transition-transform duration-200 data-[ending-style]:scale-0">
                        <CheckIcon className="h-4 w-4" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      <div className={cn('flex flex-col justify-between text-sm', errors || helper ? 'mt-2' : '')}>
        <AppInputHelper helper={helper} />
        <AppInputErrorsList errors={errors} data-testid={errorsTestId} />
      </div>
    </div>
  );
}
