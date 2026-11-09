import { Combobox } from '@base-ui/react/combobox';
import { Subscribe } from '@tanstack/react-table';
import { Header } from '@/integrations/tanstack/table/features';
import { compareFilterOptions } from '@/integrations/tanstack/table/filterOptions';
import { CheckIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import { Button } from '@/components/shared/Button';
import { Checkbox } from '@/components/shared/inputs/Checkbox';

const fieldClassName =
  'block w-full rounded-lg border border-border bg-surface-muted text-sm font-normal text-foreground transition duration-300 ease-in-out placeholder:text-muted-foreground focus:border-primary focus:shadow-sm focus:outline-hidden';

type Props<TData extends object, TValue> = {
  header: Header<TData, TValue>;
};
export function TableFilterList<TData extends object, TValue>({ header }: Props<TData, TValue>) {
  // TanStack Virtual exposes a mutable instance; read it on every render.
  'use no memo';

  const { column } = header;
  const { filterInputType: inputType, filterOptions, getFilterOptionLabel } = column.columnDef.meta ?? {};
  const [search, setSearch] = React.useState('');
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Snapshot options on open so picking one can't make others vanish mid-selection. A column-supplied
  // static list wins over deriving one from loaded rows.
  const [options] = React.useState(() => {
    const values = new Map<string, number>(
      filterOptions?.map((value) => [value, 0]) ?? column.getFacetedUniqueValues()
    );
    for (const value of (column.getFilterValue() as string[] | undefined) ?? []) {
      if (!values.has(value)) values.set(value, 0);
    }
    const entries = [...values];
    if (!filterOptions) entries.sort(([a], [b]) => compareFilterOptions(a, b));
    return entries.map(([value, count]) => ({ value, count, label: getFilterOptionLabel?.(value) ?? String(value) }));
  });

  const visibleOptions = React.useMemo(
    () => options.filter(({ label }) => label.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())),
    [options, search]
  );
  // oxlint-disable-next-line react/incompatible-library
  const virtualizer = useVirtualizer({
    count: visibleOptions.length,
    estimateSize: () => 32,
    getItemKey: (index) => visibleOptions[index].value,
    getScrollElement: () => listRef.current,
    overscan: 5,
    // Keep the highlighted option and its neighbours mounted so scrolling doesn't lose the keyboard position.
    rangeExtractor: (range) => {
      const highlighted =
        highlightedIndex === undefined ? [] : [highlightedIndex - 1, highlightedIndex, highlightedIndex + 1];
      return [...new Set([...highlighted, ...defaultRangeExtractor(range)])]
        .filter((index) => index >= 0 && index < visibleOptions.length)
        .sort((a, b) => a - b);
    },
  });

  function setFilter(values: string[]) {
    column.setFilterValue(values.length ? values : undefined);
  }

  function clearFilter() {
    column.setFilterValue(undefined);
    inputRef.current?.focus();
  }

  return (
    <Subscribe
      source={column.table.atoms.columnFilters}
      selector={() => (column.getFilterValue() as string[] | undefined) ?? []}
    >
      {(filterValue) => {
        const footer = (
          <div className="flex items-center justify-between gap-2 border-t border-border-muted px-3 py-2">
            <span role="status" className="text-xs font-normal text-neutral-600 tabular-nums">
              {!inputType && `Wybrano: ${filterValue.length} z ${options.length}`}
            </span>
            <Button variant="primaryOutline" size="xs" disabled={!filterValue.length} onClick={clearFilter}>
              Wyczyść filtr
            </Button>
          </div>
        );

        if (inputType) {
          return (
            <>
              <label className="block p-3 text-sm font-normal text-foreground">
                {inputType === 'number' ? 'Numer zgłoszenia' : 'Data zgłoszenia'}
                <input
                  ref={inputRef}
                  type={inputType}
                  className={`${fieldClassName} mt-1.5 p-2`}
                  value={filterValue[0] ?? ''}
                  onChange={(event) => column.setFilterValue(event.target.value ? [event.target.value] : undefined)}
                />
              </label>
              {footer}
            </>
          );
        }

        const visibleValues = new Set(visibleOptions.map(({ value }) => value));
        const selectedVisible = filterValue.filter((value) => visibleValues.has(value)).length;

        return (
          <Combobox.Root
            inline
            open
            multiple
            virtualized
            items={options}
            filteredItems={visibleOptions}
            value={options.filter(({ value }) => filterValue.includes(value))}
            onValueChange={(selected) => setFilter(selected.map(({ value }) => value))}
            inputValue={search}
            onInputValueChange={(value, { reason }) => {
              if (reason === 'input-clear') return;
              setSearch(value);
              virtualizer.scrollToOffset(0);
            }}
            autoHighlight
            onItemHighlighted={(option, { reason, index }) => {
              setHighlightedIndex(option ? index : undefined);
              if (option && reason === 'keyboard') virtualizer.scrollToIndex(index);
            }}
          >
            <div className="flex flex-col gap-2 p-3 pb-2">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Combobox.Input
                  ref={inputRef}
                  aria-label="Szukaj na liście"
                  placeholder="Szukaj na liście"
                  className={`${fieldClassName} py-2 pr-2 pl-8`}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-surface-subtle">
                <Checkbox
                  name="toggleAll"
                  checked={visibleOptions.length > 0 && selectedVisible === visibleOptions.length}
                  indeterminate={selectedVisible > 0 && selectedVisible < visibleOptions.length}
                  disabled={!visibleOptions.length}
                  onChange={(checked) =>
                    setFilter([
                      ...filterValue.filter((value) => !visibleValues.has(value)),
                      ...(checked ? visibleValues : []),
                    ])
                  }
                />
                {search ? 'Zaznacz znalezione' : 'Zaznacz wszystkie'}
              </label>
            </div>
            <Combobox.Empty className="px-5 pb-3 text-sm font-normal text-neutral-600 empty:hidden">
              Brak pasujących opcji
            </Combobox.Empty>
            <Combobox.List ref={listRef} className="max-h-64 overflow-y-auto px-3 pb-2 focus-visible:outline-hidden">
              <div role="presentation" className="relative" style={{ height: virtualizer.getTotalSize() }}>
                {virtualizer.getVirtualItems().map(({ index, key, start }) => {
                  const option = visibleOptions[index];
                  return (
                    <Combobox.Item
                      key={key}
                      index={index}
                      value={option}
                      aria-setsize={visibleOptions.length}
                      aria-posinset={index + 1}
                      style={{ top: start }}
                      className="group absolute inset-x-0 flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2 text-sm font-normal text-neutral-800 data-highlighted:bg-surface-subtle"
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-inverse-foreground group-data-selected:border-primary group-data-selected:bg-primary">
                        <Combobox.ItemIndicator render={<CheckIcon />} />
                      </span>
                      <span className="min-w-0 flex-1 truncate" title={option.label}>
                        {option.label}
                      </span>
                      {option.count > 0 && (
                        <span aria-hidden className="text-xs text-neutral-600 tabular-nums">
                          {option.count}
                        </span>
                      )}
                    </Combobox.Item>
                  );
                })}
              </div>
            </Combobox.List>
            {footer}
          </Combobox.Root>
        );
      }}
    </Subscribe>
  );
}
