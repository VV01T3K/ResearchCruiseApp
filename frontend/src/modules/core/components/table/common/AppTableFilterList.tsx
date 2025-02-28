import { Header } from '@tanstack/react-table';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import React from 'react';

import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppFloatingLabelInput } from '@/core/components/inputs/AppFloatingLabelInput';
import { AppTableListItem } from '@/core/components/table/common/AppTableListItem';
import { getCapabilities } from '@/core/components/table/common/utils';

type Props<TData, TValue> = {
  header: Header<TData, TValue>;
  expanded: boolean;
};
export function AppTableFilterList<TData, TValue>({ header, expanded }: Props<TData, TValue>) {
  const [filterValue, setFilterValue] = React.useState<TData[] | undefined>(
    header.column.getFilterValue() as TData[] | undefined
  );
  const [searchValue, setSearchValue] = React.useState<string>('');
  const uniqueValues = React.useMemo(() => {
    return Array.from(header.column.getFacetedUniqueValues().entries()).sort();
  }, [header.column]);

  const areAllChecked = React.useMemo(() => {
    return uniqueValues.every(([value]) => (filterValue ?? []).includes(value));
  }, [filterValue, uniqueValues]);

  function toggleFilter(filter: TData) {
    if ((filterValue ?? []).includes(filter)) {
      const newState = (filterValue ?? []).filter((f) => f !== filter);
      setFilterValue(newState);
      header.column.setFilterValue(newState);
      return;
    }

    const newState = [...(filterValue ?? []), filter];
    setFilterValue(newState.length === 0 ? undefined : newState);
    header.column.setFilterValue(newState.length === 0 ? undefined : newState);
  }

  function toggleAll(checked: boolean) {
    const allValues = searchValue
      ? uniqueValues.filter(([value]) => value.toString().includes(searchValue))
      : uniqueValues;

    const newState = checked ? allValues.map(([value]) => value) : [];
    setFilterValue(newState.length === 0 ? undefined : newState);
    header.column.setFilterValue(newState.length === 0 ? undefined : newState);
  }

  function clearFilters() {
    setFilterValue(undefined);
    header.column.setFilterValue(undefined);
  }

  function isFilterChecked(filter: TData) {
    return (filterValue ?? []).includes(filter);
  }

  const { supportsFilter } = getCapabilities(header);

  return (
    <>
      <div className="inline-flex gap-4 items-center w-full px-4 py-2 ">
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

      <div className="max-h-64 overflow-y-auto">
        {uniqueValues
          .filter(([value]) => value.toString().includes(searchValue))
          .map((value) => (
            <AppTableListItem
              key={value[0]}
              onClick={() => toggleFilter(value[0])}
              isRendered={supportsFilter}
              expanded={expanded}
            >
              <AppCheckbox name={`isFilterChecked-${value}`} checked={isFilterChecked(value[0])} />
              {value[0]}
            </AppTableListItem>
          ))}
      </div>

      <AppTableListItem
        onClick={() => clearFilters()}
        isRendered={supportsFilter}
        disabled={!filterValue}
        expanded={expanded}
      >
        <TrashIcon className="w-4 h-4 mr-2" />
        Wyczyść filtry
      </AppTableListItem>
    </>
  );
}
