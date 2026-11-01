import { Subscribe } from '@tanstack/react-table';
import { Header } from '@/integrations/tanstack/table/features';
import { compareFilterOptions } from '@/integrations/tanstack/table/filterOptions';
import { TrashIcon } from '@phosphor-icons/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import { Checkbox } from '@/components/shared/inputs/Checkbox';
import { FloatingLabelInput } from '@/components/shared/inputs/FloatingLabelInput';
import { TableListItem } from '@/components/shared/table/common/TableListItem';
import { getCapabilities } from '@/components/shared/table/common/utils';

type Props<TData extends object, TValue> = {
  header: Header<TData, TValue>;
  expanded: boolean;
};
export function TableFilterList<TData extends object, TValue>({ header, expanded }: Props<TData, TValue>) {
  // TanStack Virtual exposes a mutable instance; read it on every render.
  'use no memo';

  const [searchValue, setSearchValue] = React.useState<string>('');

  // Prefer a column-supplied static option list over deriving one from loaded rows.
  const computeUniqueValues = React.useCallback(() => {
    const staticOptions = header.column.columnDef.meta?.filterOptions;
    if (staticOptions) {
      return staticOptions.map((value): [any, number] => [value, 0]);
    }
    return Array.from(header.column.getFacetedUniqueValues().entries()).sort(([a], [b]) => compareFilterOptions(a, b));
  }, [header.column]);

  // Snapshot options on open so picking one can't make others vanish mid-selection.
  const [uniqueValues, setUniqueValues] = React.useState(computeUniqueValues);

  React.useEffect(() => {
    if (expanded) {
      setUniqueValues(computeUniqueValues());
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  function toggleFilter(filter: string) {
    const filterValue = header.column.getFilterValue() as string[] | undefined;
    if ((filterValue ?? []).includes(filter)) {
      const newState = (filterValue ?? []).filter((f) => f !== filter);
      header.column.setFilterValue(newState);
      return;
    }

    const newState = [...(filterValue ?? []), filter];
    header.column.setFilterValue(newState.length === 0 ? undefined : newState);
  }

  function toggleAll(checked: boolean) {
    const allValues = searchValue ? uniqueValues.filter(([value]) => matchesSearch(value)) : uniqueValues;

    const newState = checked ? allValues.map(([value]) => value) : [];
    header.column.setFilterValue(newState.length === 0 ? undefined : newState);
  }

  function clearFilters() {
    header.column.setFilterValue(undefined);
  }

  const { supportsFilter } = getCapabilities(header);
  const getFilterOptionLabel = header.column.columnDef.meta?.getFilterOptionLabel;
  const inputType = header.column.columnDef.meta?.filterInputType;

  function matchesSearch(value: string) {
    return (getFilterOptionLabel?.(value) ?? String(value))
      .toLocaleLowerCase()
      .includes(searchValue.toLocaleLowerCase());
  }

  const visibleValues = uniqueValues.filter(([value]) => matchesSearch(value));
  const listRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: visibleValues.length,
    estimateSize: () => 36,
    getItemKey: (index) => visibleValues[index][0],
    getScrollElement: () => listRef.current,
    overscan: 5,
  });
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Subscribe
      source={header.column.table.atoms.columnFilters}
      selector={() => header.column.getFilterValue() as string[] | undefined}
    >
      {(filterValue) => {
        if (inputType) {
          return (
            <label className="block px-4 py-2 text-sm">
              {inputType === 'number' ? 'Numer zgłoszenia' : 'Data zgłoszenia'}
              <input
                type={inputType}
                className="mt-1 w-full rounded border border-gray-300 p-2"
                value={filterValue?.[0] ?? ''}
                onChange={(event) =>
                  header.column.setFilterValue(event.target.value ? [event.target.value] : undefined)
                }
              />
            </label>
          );
        }

        return (
          <>
            <div className="inline-flex w-full items-center gap-4 px-4 py-2">
              <div>
                <Checkbox
                  name="toggleAll"
                  checked={uniqueValues.every(([value]) => (filterValue ?? []).includes(value))}
                  onChange={(x) => toggleAll(x)}
                />
              </div>
              <div className="relative w-full text-left">
                <FloatingLabelInput
                  label="Szukaj"
                  name="search"
                  type="text"
                  value={searchValue}
                  onChange={setSearchValue}
                  className="text-xs"
                />
              </div>
            </div>

            <div ref={listRef} className="max-h-32 overflow-x-auto overflow-y-auto">
              <div style={{ height: virtualizer.getTotalSize(), paddingTop: virtualItems[0]?.start ?? 0 }}>
                {virtualItems.map(({ index, key }) => {
                  const [value] = visibleValues[index];
                  return (
                    <TableListItem
                      key={key}
                      onClick={() => toggleFilter(value)}
                      isRendered={supportsFilter}
                      expanded={expanded}
                    >
                      <Checkbox name={`isFilterChecked-${value}`} checked={(filterValue ?? []).includes(value)} />
                      {getFilterOptionLabel ? getFilterOptionLabel(value) : value}
                    </TableListItem>
                  );
                })}
              </div>
            </div>

            <TableListItem
              onClick={() => clearFilters()}
              isRendered={supportsFilter}
              disabled={!filterValue}
              expanded={expanded}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Wyczyść filtry
            </TableListItem>
          </>
        );
      }}
    </Subscribe>
  );
}
