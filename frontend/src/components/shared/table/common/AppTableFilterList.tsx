import { Header } from '@/integrations/tanstack/table/features';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import React from 'react';

import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppFloatingLabelInput } from '@/components/shared/inputs/AppFloatingLabelInput';
import { AppTableListItem } from '@/components/shared/table/common/AppTableListItem';
import { getCapabilities } from '@/components/shared/table/common/utils';

type Props<TData extends object, TValue> = {
  header: Header<TData, TValue>;
  expanded: boolean;
};
export function AppTableFilterList<TData extends object, TValue>({ header, expanded }: Props<TData, TValue>) {
  const filterValue = header.column.getFilterValue() as string[] | undefined;
  const [searchValue, setSearchValue] = React.useState<string>('');

  // Prefer a column-supplied static option list over deriving one from loaded rows.
  const computeUniqueValues = React.useCallback(() => {
    const staticOptions = header.column.columnDef.meta?.filterOptions;
    if (staticOptions) {
      return staticOptions.map((value): [any, number] => [value, 0]);
    }
    return Array.from(header.column.getFacetedUniqueValues().entries()).sort();
  }, [header.column]);

  // Snapshot options on open so picking one can't make others vanish mid-selection.
  const [uniqueValues, setUniqueValues] = React.useState(computeUniqueValues);

  React.useEffect(() => {
    if (expanded) {
      setUniqueValues(computeUniqueValues());
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const areAllChecked = React.useMemo(() => {
    return uniqueValues.every(([value]) => (filterValue ?? []).includes(value));
  }, [filterValue, uniqueValues]);

  function toggleFilter(filter: string) {
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

  function isFilterChecked(filter: string) {
    return (filterValue ?? []).includes(filter);
  }

  const { supportsFilter } = getCapabilities(header);
  const getFilterOptionLabel = header.column.columnDef.meta?.getFilterOptionLabel;
  const inputType = header.column.columnDef.meta?.filterInputType;

  function matchesSearch(value: string) {
    return (getFilterOptionLabel?.(value) ?? String(value))
      .toLocaleLowerCase()
      .includes(searchValue.toLocaleLowerCase());
  }

  if (inputType) {
    return (
      <label className="block px-4 py-2 text-sm">
        {inputType === 'number' ? 'Numer zgłoszenia' : 'Data zgłoszenia'}
        <input
          type={inputType}
          className="mt-1 w-full rounded border border-gray-300 p-2"
          value={filterValue?.[0] ?? ''}
          onChange={(event) => header.column.setFilterValue(event.target.value ? [event.target.value] : undefined)}
        />
      </label>
    );
  }

  return (
    <>
      <div className="inline-flex w-full items-center gap-4 px-4 py-2">
        <div>
          <AppCheckbox name="toggleAll" checked={areAllChecked} onChange={(x) => toggleAll(x)} />
        </div>
        <div className="relative w-full text-left">
          <AppFloatingLabelInput
            label="Szukaj"
            name="search"
            type="text"
            value={searchValue}
            onChange={setSearchValue}
            className="text-xs"
          />
        </div>
      </div>

      <div className="max-h-32 overflow-x-auto overflow-y-auto">
        {uniqueValues
          .filter(([value]) => matchesSearch(value))
          .map((value) => (
            <AppTableListItem
              key={value[0]}
              onClick={() => toggleFilter(value[0])}
              isRendered={supportsFilter}
              expanded={expanded}
            >
              <AppCheckbox name={`isFilterChecked-${value}`} checked={isFilterChecked(value[0])} />
              {getFilterOptionLabel ? getFilterOptionLabel(value[0]) : value[0]}
            </AppTableListItem>
          ))}
      </div>

      <AppTableListItem
        onClick={() => clearFilters()}
        isRendered={supportsFilter}
        disabled={!filterValue}
        expanded={expanded}
      >
        <TrashIcon className="mr-2 h-4 w-4" />
        Wyczyść filtry
      </AppTableListItem>
    </>
  );
}
