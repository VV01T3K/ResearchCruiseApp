/* eslint-disable @eslint-react/no-array-index-key */
import { Button } from '@base-ui/react/button';
import { Popover } from '@base-ui/react/popover';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import SearchIcon from 'bootstrap-icons/icons/search.svg?react';
import { useState } from 'react';

import { AppButtonVariant } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { cn } from '@/core/lib/utils';

type Props = {
  variant: AppButtonVariant;
  options: {
    value: string;
    onClick?: () => void;
    content?: React.ReactNode;
  }[];
  children: React.ReactNode;

  disabled?: boolean;
  'data-testid'?: string;
};
export function CruiseApplicationDropdownElementSelectorButton({
  variant,
  options,
  children,
  disabled,
  'data-testid': testId,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = options.filter((option) => option.value.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <Popover.Root open={expanded} onOpenChange={setExpanded} modal={false}>
      <Popover.Trigger
        render={
          <button
            className={cn(
              'text-white outline-none hover:cursor-pointer disabled:cursor-default',
              variants[variant],
              'flex items-center gap-4 px-5 py-2.5'
            )}
            disabled={disabled}
            data-testid={testId}
          />
        }
      >
        <span>{children}</span>
        <span className="transition-transform duration-300 ease-out data-[popup-open]:rotate-180">
          <ChevronDownIcon className="h-5 w-5" />
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner className="z-50" sideOffset={4} align="center">
          <Popover.Popup
            className={cn(
              'w-[calc(var(--anchor-width)*1.5)] origin-[var(--transform-origin)] rounded-lg bg-white shadow-xl ring-1 ring-black/10',
              'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
              'data-[starting-style]:translate-y-1 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
              'data-[ending-style]:translate-y-1 data-[ending-style]:scale-90 data-[ending-style]:opacity-0',
              'flex max-h-96 flex-col'
            )}
          >
            <div className="sticky top-0 shrink-0 bg-white">
              <SearchIcon className="absolute top-2.5 right-5 z-10 h-5 w-5" />
              <AppInput value={searchValue} onChange={setSearchValue} placeholder="Wyszukaj..." autoFocus />
            </div>
            <div className="overflow-y-auto p-1">
              {filteredOptions.length === 0 && <div className="py-4 text-center text-gray-500">Brak wyników</div>}
              {filteredOptions.length > 0 &&
                filteredOptions.map((option, i) => (
                  <Button
                    key={`${option.value}${i}`}
                    onClick={
                      option.onClick
                        ? () => {
                            option.onClick!();
                            setExpanded(false);
                          }
                        : undefined
                    }
                    className={cn(
                      'text-default block w-full rounded-lg px-2 py-1 text-left text-base font-semibold inset-ring-blue-500 outline-none hover:cursor-pointer focus:inset-ring-2 disabled:cursor-default',
                      option.onClick && 'hover:bg-primary-50 transition-colors duration-150'
                    )}
                    disabled={!option.onClick}
                  >
                    {option.content ?? <span>{option.value}</span>}
                  </Button>
                ))}
            </div>
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
