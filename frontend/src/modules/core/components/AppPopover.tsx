import { Popover } from '@base-ui/react/popover';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import React from 'react';

import { AppButtonVariant } from '@/core/components/AppButton';
import { cn } from '@/core/lib/utils';

type Props = {
  children: React.ReactNode;
  modal: (setExpanded: (value: boolean) => void) => React.ReactNode;

  className?: string;
  variant?: AppButtonVariant;
};
export function AppPopover({ children, modal, className, variant = 'plain' }: Props) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Popover.Root open={expanded} onOpenChange={setExpanded} modal={false}>
      <Popover.Trigger
        render={
          <button
            className={cn(
              'text-white outline-none hover:cursor-pointer disabled:cursor-default',
              variants[variant],
              'flex cursor-pointer items-center gap-2 text-sm',
              'ring-2 ring-transparent focus:rounded-lg focus:border-blue-500 focus:shadow focus:ring-blue-500 focus:outline-none',
              className
            )}
          />
        }
      >
        {children}
        <span className="transition-transform duration-300 ease-out data-[popup-open]:rotate-180">
          <ChevronDownIcon className="h-6 w-6" />
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner className="z-50 min-w-[var(--anchor-width)]" sideOffset={4}>
          <Popover.Popup
            className={cn(
              'w-full origin-[var(--transform-origin)] rounded-lg bg-white shadow-xl ring-1 ring-black/10',
              'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
              'data-[starting-style]:translate-y-1 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
              'data-[ending-style]:translate-y-1 data-[ending-style]:scale-90 data-[ending-style]:opacity-0'
            )}
          >
            <div className="max-h-64 overflow-y-auto p-2">{modal(setExpanded)}</div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

const variants = {
  plain: 'text-default',
  primary: 'rounded-lg bg-primary hover:bg-primary-900 active:bg-primary disabled:bg-primary-500',
  success: 'rounded-lg bg-success hover:bg-success-900 active:bg-success disabled:bg-success-400',
  danger: 'rounded-lg bg-danger hover:bg-danger-700 active:bg-danger disabled:bg-danger-400',
  warning:
    'rounded-lg bg-warning hover:bg-warning-400 active:bg-warning disabled:bg-warning-100 text-black disabled:text-warning-800',
  info: 'rounded-lg bg-info hover:bg-info-400 active:bg-info disabled:bg-info-200',
  primaryOutline:
    'rounded-lg bg-white hover:bg-primary active:bg-primary text-primary hover:text-white border border-primary transition-all duration-300 disabled:border-primary-300 disabled:text-primary-400 disabled:hover:bg-white',
  successOutline:
    'rounded-lg bg-white hover:bg-success active:bg-success text-success hover:text-white border border-success transition-all duration-300 disabled:border-success-300 disabled:text-success-400 disabled:hover:bg-white',
  dangerOutline:
    'rounded-lg bg-white hover:bg-danger active:bg-danger text-danger hover:text-white border border-danger transition-all duration-300 disabled:border-danger-300 disabled:text-danger-400 disabled:hover:bg-white',
  warningOutline:
    'rounded-lg bg-white hover:bg-warning active:bg-warning text-warning-600 hover:text-black border border-warning transition-all duration-300 disabled:border-warning-300 disabled:text-warning-500 disabled:hover:bg-white',
  infoOutline:
    'rounded-lg bg-white hover:bg-info active:bg-info text-info hover:text-white border border-info transition-all duration-300 disabled:border-info-200 disabled:text-info-300 disabled:hover:bg-white',
};
