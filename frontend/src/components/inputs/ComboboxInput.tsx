import { Combobox } from '@base-ui/react/combobox';
import { CaretDownIcon, CheckIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import React from 'react';

import { hasErrors, invalidInputClassName } from '@/components/inputs/invalidInput';
import { useInputAria } from '@/components/inputs/useInputAria';
import { stickyBarsCollisionPadding } from '@/components/layout/stickyBarsCollisionPadding';
import { dropdownItemClassName, dropdownPopupClassName } from '@/components/shared/inputs/DropdownInput';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';
import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';
import { cn } from '@/lib/utils';

export type ComboboxInputOption = { value: string; label: string; richLabel: React.ReactNode };

type Props = {
  name: string;
  value: string;
  allOptions: ComboboxInputOption[];
  onChange: (value: string) => void;
  onBlur: () => void;
  errors?: string[];
  label: React.ReactNode;
  placeholder: string;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
};

export function ComboboxInput({
  name,
  value,
  allOptions,
  onChange,
  onBlur,
  errors,
  label,
  placeholder,
  showRequiredAsterisk,
  disabled,
}: Props) {
  const aria = useInputAria(errors, undefined);
  const items = React.useMemo(
    () => Combobox.createItems(allOptions, { getValue: (option) => option.value, getLabel: (option) => option.label }),
    [allOptions]
  );

  return (
    <div className="flex flex-col">
      <InputLabel name={aria.id} value={label} showRequiredAsterisk={showRequiredAsterisk} />

      <Combobox.Root
        name={name}
        items={items}
        value={value || null}
        onValueChange={(newValue) => onChange(newValue ?? '')}
        onOpenChange={(open) => {
          if (!open) onBlur();
        }}
        disabled={disabled}
        locale="pl"
        autoHighlight
      >
        <Combobox.Trigger
          {...aria.inputProps}
          className={cn(
            'group relative inline-flex w-full items-center justify-between gap-2 text-left',
            'rounded-lg border border-border bg-surface-muted p-2.5 text-sm text-foreground',
            'transition duration-300 ease-in-out',
            !disabled && 'cursor-pointer hover:border-neutral-400',
            !disabled && 'focus:border-primary-500 focus:ring-primary-500 focus:outline-hidden focus:ring-inset',
            disabled && 'cursor-not-allowed bg-neutral-200',
            hasErrors(errors) && invalidInputClassName
          )}
        >
          <Combobox.Value>
            {(selected: string | null) => allOptions.find((option) => option.value === selected)?.label ?? placeholder}
          </Combobox.Value>
          <span className="flex items-center gap-2">
            <InputErrorTriangle errors={errors} />
            {!disabled && (
              <Combobox.Icon className="transition-transform duration-300 ease-out group-data-[popup-open]:rotate-180">
                <CaretDownIcon className="h-5 w-5" />
              </Combobox.Icon>
            )}
          </span>
        </Combobox.Trigger>

        <Combobox.Portal>
          <Combobox.Positioner
            className="z-50 w-[var(--anchor-width)]"
            sideOffset={4}
            collisionPadding={stickyBarsCollisionPadding}
          >
            <Combobox.Popup className={dropdownPopupClassName}>
              <div className="relative border-b border-border-muted p-2">
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-4.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Combobox.Input
                  aria-label="Szukaj na liście"
                  placeholder="Szukaj na liście"
                  className="w-full rounded-md border border-border bg-surface-muted py-2 pr-2 pl-8 text-sm text-foreground focus:border-primary-500 focus:outline-hidden"
                />
              </div>
              <Combobox.Empty className="px-3 py-2 text-sm text-neutral-600 empty:hidden">
                Brak pasujących opcji
              </Combobox.Empty>
              <Combobox.List className="flex max-h-64 flex-col overflow-y-auto empty:hidden">
                {(option: ComboboxInputOption) => (
                  <Combobox.Item key={option.value} value={option.value} className={dropdownItemClassName}>
                    {option.richLabel}
                    <Combobox.ItemIndicator className="text-primary">
                      <CheckIcon className="h-4 w-4 scale-75" />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>

      <div className={cn('flex flex-col text-sm', hasErrors(errors) && 'mt-2')}>
        <InputErrorsList id={aria.errorId} errors={errors} />
      </div>
    </div>
  );
}
