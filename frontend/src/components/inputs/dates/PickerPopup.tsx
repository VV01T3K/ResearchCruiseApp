import { Popover } from '@base-ui/react/popover';
import { XIcon } from '@phosphor-icons/react';
import React from 'react';

import { stickyBarsCollisionPadding } from '@/components/layout/stickyBarsCollisionPadding';
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
    'relative inline-flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-surface-muted p-2.5 text-left text-sm text-foreground',
    'transition-[border-color,box-shadow] duration-150 ease-out focus-visible:outline-hidden',
    disabled
      ? 'cursor-default bg-neutral-200'
      : 'cursor-pointer focus:border-primary focus:shadow-sm focus:ring-primary focus:outline-hidden',
    className,
    hasErrors(errors) && invalidInputClassName
  );
}

type Props = {
  'aria-label': string;
  children: React.ReactNode;
  initialFocus?: Popover.Popup.Props['initialFocus'];
  anchor?: Popover.Positioner.Props['anchor'];
  align?: Popover.Positioner.Props['align'];
};
export function PickerPopup({ 'aria-label': ariaLabel, children, initialFocus, anchor, align = 'center' }: Props) {
  return (
    <Popover.Portal>
      <Popover.Positioner
        className="z-50"
        anchor={anchor}
        align={align}
        sideOffset={4}
        collisionPadding={stickyBarsCollisionPadding}
        collisionAvoidance={{ fallbackAxisSide: 'none' }}
      >
        <Popover.Popup
          aria-label={ariaLabel}
          initialFocus={initialFocus}
          className={cn(
            'max-h-[var(--available-height)] origin-[var(--transform-origin)] overflow-y-auto rounded-lg bg-surface shadow-xl ring-1 ring-neutral-950/10 focus-visible:outline-hidden',
            'transition-[opacity,scale] duration-150 ease-popup',
            'data-[starting-style]:scale-98 data-[starting-style]:opacity-0',
            'data-[ending-style]:scale-98 data-[ending-style]:opacity-0',
            '[&_button:focus-visible]:ring-2 [&_button:focus-visible]:ring-primary'
          )}
        >
          {children}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export function PickerClearButton({
  'aria-label': ariaLabel,
  onClick,
  onMouseDown,
  ref,
}: {
  'aria-label': string;
  onClick: (evt: React.MouseEvent) => void;
  onMouseDown?: (evt: React.MouseEvent) => void;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseDown={onMouseDown}
      className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-sm hover:text-danger-500 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
    >
      <XIcon className="h-4 w-4" />
    </button>
  );
}
