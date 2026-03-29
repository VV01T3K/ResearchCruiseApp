import { Select as SelectPrimitive } from '@base-ui/react/select';
import CheckIcon from 'bootstrap-icons/icons/check.svg?react';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';

import { cn } from '@/lib/utils';

import { FieldErrorsBlock, FieldErrorTriangle, FieldLabel, useNormalizedFieldErrors } from './shared';

export function Select({
  label,
  values,
  placeholder = 'Wybierz',
}: {
  label: string;
  values: Array<{ label: string; value: string }>;
  placeholder?: string;
}) {
  const { field, hasError, normalizedErrors } = useNormalizedFieldErrors<string>();
  const selectedOption = values.find((option) => option.value === field.state.value);

  return (
    <div className="flex flex-col" data-invalid={hasError || undefined}>
      <FieldLabel htmlFor={field.name} label={label} />
      <SelectPrimitive.Root
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value ?? '')}
        modal={false}
        onOpenChange={(open) => {
          if (!open) field.handleBlur();
        }}
      >
        <SelectPrimitive.Trigger
          id={field.name}
          aria-invalid={hasError || undefined}
          className={cn(
            'relative inline-flex w-full items-center justify-between',
            'rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900',
            'transition duration-300 ease-in-out',
            'cursor-pointer hover:border-gray-400',
            'focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-inset',
            hasError ? 'border-danger ring-danger text-danger ring-inset focus:text-gray-900' : ''
          )}
        >
          <SelectPrimitive.Value>{() => selectedOption?.label ?? placeholder}</SelectPrimitive.Value>
          <span className="flex items-center gap-2">
            <FieldErrorTriangle hasError={hasError} />
            <SelectPrimitive.Icon className="transition-transform duration-300 ease-out data-[popup-open]:rotate-180">
              <ChevronDownIcon className="h-5 w-5" />
            </SelectPrimitive.Icon>
          </span>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner className="z-50 w-[var(--anchor-width)]" sideOffset={4} alignItemWithTrigger={false}>
            <SelectPrimitive.Popup
              className={cn(
                'w-full origin-[var(--transform-origin)] overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/10',
                'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                'data-[starting-style]:translate-y-1 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
                'data-[ending-style]:translate-y-1 data-[ending-style]:scale-90 data-[ending-style]:opacity-0'
              )}
            >
              <SelectPrimitive.List className="flex max-h-64 flex-col overflow-y-auto">
                {values.map((value) => (
                  <SelectPrimitive.Item
                    key={value.value}
                    value={value.value}
                    className={cn(
                      'flex items-center justify-between gap-2 border-b border-gray-200 px-3 py-2 text-sm text-gray-700 last:border-b-0',
                      'cursor-pointer outline-none select-none',
                      'transition-all duration-150 ease-out',
                      'data-[highlighted]:bg-primary-50 data-[highlighted]:text-gray-900',
                      'data-[selected]:bg-primary-50 data-[selected]:text-primary-800 data-[selected]:font-medium'
                    )}
                  >
                    <SelectPrimitive.ItemText>{value.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="text-primary transition-transform duration-200 data-[ending-style]:scale-0">
                      <CheckIcon className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.List>
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      <FieldErrorsBlock errors={normalizedErrors} />
    </div>
  );
}
