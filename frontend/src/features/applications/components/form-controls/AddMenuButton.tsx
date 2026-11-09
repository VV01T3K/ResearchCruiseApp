import { Combobox } from '@base-ui/react/combobox';
import { CaretDownIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

import { useWordStartFilter } from '@/components/inputs/ComboboxInput';
import { stickyBarsCollisionPadding } from '@/components/layout/stickyBarsCollisionPadding';
import { cn } from '@/lib/utils';

type Option = { label: string; content?: React.ReactNode; onSelect: () => void };
type OptionGroup = { label: string; items: Option[] };

type Props = {
  variant: keyof typeof variants;
  options: Option[] | OptionGroup[];
  children: string;
  disabled?: boolean;
};

export function AddMenuButton({ variant, options, children, disabled }: Props) {
  const matchesWordStart = useWordStartFilter();

  const renderItem = (option: Option, index: number) => (
    <Combobox.Item
      key={index}
      value={option}
      className="block w-full cursor-pointer rounded-md px-3 py-2.5 text-left text-base transition-colors duration-150 select-none active:bg-primary-100 data-[highlighted]:bg-primary-50 data-[highlighted]:text-foreground"
    >
      {option.content ?? option.label}
    </Combobox.Item>
  );

  return (
    <Combobox.Root<Option>
      items={options}
      value={null}
      onValueChange={(option) => option?.onSelect()}
      itemToStringLabel={(option) => option.label}
      filter={matchesWordStart}
      locale="pl"
      disabled={disabled}
      autoHighlight
    >
      <Combobox.Trigger
        aria-label={children}
        className={cn(
          'group flex items-center gap-4 px-5 py-2.5 text-inverse-foreground hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-default',
          variants[variant]
        )}
      >
        <span>{children}</span>
        <span className="transition-transform duration-150 ease-out group-aria-expanded:rotate-180">
          <CaretDownIcon className="h-5 w-5" />
        </span>
      </Combobox.Trigger>

      <Combobox.Portal>
        <Combobox.Positioner className="z-50" sideOffset={4} collisionPadding={stickyBarsCollisionPadding}>
          <Combobox.Popup
            className={cn(
              'w-max max-w-sm min-w-64 origin-[var(--transform-origin)] rounded-lg bg-surface shadow-xl ring-1 ring-neutral-950/10',
              'transition-[opacity,scale] duration-150 ease-popup',
              'data-[starting-style]:scale-98 data-[starting-style]:opacity-0',
              'data-[ending-style]:scale-98 data-[ending-style]:opacity-0',
              'flex max-h-96 flex-col overflow-hidden'
            )}
          >
            <div className="relative shrink-0 border-b border-border-muted p-2">
              <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Combobox.Input
                aria-label="Szukaj na liście"
                placeholder="Szukaj na liście"
                className="w-full rounded-lg border border-border bg-surface-muted p-2.5 pl-9 text-sm text-foreground focus:border-primary-500 focus:outline-hidden"
              />
            </div>
            <Combobox.Empty className="py-6 text-center text-base text-muted-foreground empty:hidden">
              Brak pasujących opcji
            </Combobox.Empty>
            <Combobox.List className="overflow-x-hidden overflow-y-auto p-1 empty:hidden">
              {(entry: Option | OptionGroup, index: number) =>
                'items' in entry ? (
                  <Combobox.Group key={index} items={entry.items}>
                    <Combobox.GroupLabel className="my-2 px-2 text-center text-sm text-muted-foreground">
                      {entry.label}
                    </Combobox.GroupLabel>
                    <Combobox.Collection>{renderItem}</Combobox.Collection>
                  </Combobox.Group>
                ) : (
                  renderItem(entry, index)
                )
              }
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

const variants = {
  primary: 'rounded-lg bg-primary hover:bg-primary-900 active:bg-primary disabled:bg-primary-500',
  primaryOutline:
    'rounded-lg bg-surface hover:bg-primary active:bg-primary text-primary hover:text-inverse-foreground border border-primary transition-colors duration-150 ease-out disabled:border-primary-300 disabled:text-primary-400 disabled:hover:bg-surface',
};
