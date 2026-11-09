import { Button as BaseButton } from '@base-ui/react/button';
import { Popover } from '@base-ui/react/popover';
import { CaretDownIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { stickyBarsCollisionPadding } from '@/components/layout/stickyBarsCollisionPadding';
import { ButtonVariant } from '@/components/shared/Button';
import { Input } from '@/components/shared/inputs/Input';
import { cn } from '@/lib/utils';

type Props = {
  variant: ButtonVariant;
  options: {
    value: string;
    onClick?: () => void;
    content?: React.ReactNode;
  }[];
  children: React.ReactNode;

  disabled?: boolean;
};

export function DropdownElementSelectorButton({ variant, options, children, disabled }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = options.filter(
    (option) =>
      option.value && option.value.trim().length > 0 && option.value.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover.Root open={expanded} onOpenChange={setExpanded} modal={false}>
      <Popover.Trigger
        render={
          <button
            type="button"
            className={cn(
              'group text-inverse-foreground hover:cursor-pointer disabled:cursor-default focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              variants[variant],
              'flex items-center gap-4 px-5 py-2.5'
            )}
            disabled={disabled}
          />
        }
      >
        <span>{children}</span>
        <span className="transition-transform duration-150 ease-out group-aria-expanded:rotate-180">
          <CaretDownIcon className="h-5 w-5" />
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          className="z-50"
          sideOffset={4}
          collisionPadding={stickyBarsCollisionPadding}
          align="center"
        >
          <Popover.Popup
            className={cn(
              'w-max max-w-sm min-w-64 origin-[var(--transform-origin)] rounded-lg bg-surface shadow-xl ring-1 ring-neutral-950/10',
              'transition-[opacity,scale] duration-150 ease-popup',
              'data-[starting-style]:scale-98 data-[starting-style]:opacity-0',
              'data-[ending-style]:scale-98 data-[ending-style]:opacity-0',
              'flex max-h-96 flex-col overflow-hidden'
            )}
          >
            <div className="shrink-0 border-b border-border-muted bg-surface p-2">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Wyszukaj..."
                  autoFocus
                  className="pl-9"
                />
              </div>
            </div>
            <div className="overflow-x-hidden overflow-y-auto">
              {filteredOptions.length === 0 && (
                <div className="py-6 text-center text-base text-muted-foreground">Brak wyników</div>
              )}
              {filteredOptions.length > 0 && (
                <ul className="p-1">
                  {filteredOptions.map((option, i) => (
                    <li key={`${option.value}${i}`}>
                      <BaseButton
                        onClick={
                          option.onClick
                            ? () => {
                                option.onClick!();
                                setExpanded(false);
                              }
                            : undefined
                        }
                        className={cn(
                          'block w-full rounded-md px-3 py-2.5 text-left text-base transition-colors duration-150 focus-visible:outline-hidden disabled:cursor-default disabled:opacity-50',
                          option.onClick &&
                            'data-[highlighted]:bg-primary-50 hover:bg-primary-50 active:bg-primary-100 hover:cursor-pointer data-[highlighted]:text-foreground'
                        )}
                        disabled={!option.onClick}
                      >
                        {option.content ?? option.value}
                      </BaseButton>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

const variants = {
  plain: 'text-inherit',
  primary: 'rounded-lg bg-primary hover:bg-primary-900 active:bg-primary disabled:bg-primary-500',
  success: 'rounded-lg bg-success hover:bg-success-900 active:bg-success disabled:bg-success-400',
  danger:
    'rounded-lg bg-danger hover:bg-danger-700 active:bg-danger disabled:hover:bg-surface disabled:bg-surface disabled:text-muted-foreground disabled:inset-ring disabled:inset-ring-border',
  warning:
    'rounded-lg bg-warning hover:bg-warning-400 active:bg-warning text-neutral-950 disabled:hover:bg-surface disabled:bg-surface disabled:text-muted-foreground disabled:inset-ring disabled:inset-ring-border',
  info: 'rounded-lg bg-info hover:bg-info-700 active:bg-info disabled:bg-info-200',
  primaryOutline:
    'rounded-lg bg-surface hover:bg-primary active:bg-primary text-primary hover:text-inverse-foreground border border-primary transition-colors duration-150 ease-out disabled:border-primary-300 disabled:text-primary-400 disabled:hover:bg-surface',
  successOutline:
    'rounded-lg bg-surface hover:bg-success active:bg-success text-success hover:text-inverse-foreground border border-success transition-colors duration-150 ease-out disabled:border-success-300 disabled:text-success-400 disabled:hover:bg-surface',
  dangerOutline:
    'rounded-lg bg-surface hover:bg-danger active:bg-danger text-danger hover:text-inverse-foreground border border-danger transition-colors duration-150 ease-out disabled:border-border disabled:text-muted-foreground disabled:hover:bg-surface',
  warningOutline:
    'rounded-lg bg-surface hover:bg-warning active:bg-warning text-warning-600 hover:text-neutral-950 border border-warning transition-colors duration-150 ease-out disabled:border-border disabled:text-muted-foreground disabled:hover:bg-surface',
  infoOutline:
    'rounded-lg bg-surface hover:bg-info active:bg-info text-info hover:text-inverse-foreground border border-info transition-colors duration-150 ease-out disabled:border-info-200 disabled:text-info-300 disabled:hover:bg-surface',
};
