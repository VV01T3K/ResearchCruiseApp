import { Popover } from '@base-ui/react/popover';
import React from 'react';

import { hasErrors, invalidInputClassName } from '@/components/inputs/invalidInput';
import { cn } from '@/lib/utils';

export function pickerTriggerClassName({
  disabled,
  errors,
  className,
}: {
  disabled?: boolean;
  errors?: string[];
  className?: string;
}) {
  return cn(
    'relative inline-flex w-full items-center justify-between gap-4 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-left text-sm text-gray-900',
    'transition duration-300 ease-in-out outline-none',
    disabled
      ? 'cursor-default bg-gray-200'
      : 'cursor-pointer focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none',
    className,
    hasErrors(errors) && invalidInputClassName
  );
}

type Props = {
  'aria-label': string;
  children: React.ReactNode;
};
export function PickerPopup({ 'aria-label': ariaLabel, children }: Props) {
  return (
    <Popover.Portal>
      <Popover.Positioner className="z-50" sideOffset={4} collisionPadding={8}>
        <Popover.Popup
          aria-label={ariaLabel}
          className={cn(
            'max-h-[var(--available-height)] origin-[var(--transform-origin)] overflow-y-auto rounded-lg bg-white shadow-xl ring-1 ring-black/10 outline-none',
            'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
            'data-[starting-style]:translate-y-1 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
            'data-[ending-style]:translate-y-1 data-[ending-style]:scale-90 data-[ending-style]:opacity-0',
            '[&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-blue-500'
          )}
        >
          {children}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}
