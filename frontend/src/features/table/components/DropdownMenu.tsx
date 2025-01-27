import { AppFloatingLabelInput } from '@core/components/AppFloatingLabelInput';
import { cn } from '@lib/utils';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import { motion } from 'motion/react';
import React from 'react';

import { DropdownMenuProps } from '../types';
import { DropdownMenuElement } from './DropdownMenuElement';
import { SortingToggle } from './SortingToggle';

export function DropdownMenu<TData, TValue>({
  header,
  supportsDropdown,
  supportsFilter,
  supportsSort,
  dropdownRef,
  headerRef,
  status,
}: DropdownMenuProps<TData, TValue>) {
  const uniqueValues = React.useMemo(() => {
    return Array.from(header.column.getFacetedUniqueValues().entries()).sort();
  }, [header.column]);

  const [filterValue, setFilterValue] = React.useState<TData[] | undefined>(
    header.column.getFilterValue() as TData[] | undefined
  );
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });

  const updateDropdownPosition = React.useCallback(() => {
    if (!headerRef.current || !dropdownRef.current) {
      return;
    }

    const headerRect = headerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setDropdownPosition({
      top: headerRect.top - headerRect.height / 2 + window.scrollY,
      left: headerRect.left + headerRect.width / 2 - dropdownRect.width / 2 + window.scrollX,
    });
  }, [headerRef, dropdownRef]);

  React.useEffect(() => {
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [updateDropdownPosition]);

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

  if (!supportsDropdown) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        'fixed origin-top-right w-56 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50'
      )}
      initial={{ opacity: 0, translateY: '-10%' }}
      animate={{ opacity: 1, translateY: '0' }}
      exit={{ opacity: 0, translateY: '-10%' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
      ref={dropdownRef}
      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
    >
      <div className="py-1" role="none">
        {supportsSort && <p>Sortowanie</p>}
        <DropdownMenuElement onClick={() => header.column.toggleSorting()} isRendered={supportsSort} status={status}>
          <SortingToggle header={header} />
        </DropdownMenuElement>

        {supportsFilter && supportsSort && <hr className="h-px my-0.5 border-0 bg-gray-700" />}

        {supportsFilter && <p>Filtrowanie</p>}
        {supportsFilter && (
          <div className="inline-flex gap-4 items-center w-full px-4 py-2 ">
            <div>
              <input type="checkbox" onChange={(evt) => toggleAll(evt.currentTarget.checked)} />
            </div>
            <div className="relative w-full text-left">
              <AppFloatingLabelInput
                label="Szukaj"
                type="text"
                value={searchValue}
                onChange={(evt) => setSearchValue(evt.currentTarget.value)}
                className="text-xs"
              />
            </div>
          </div>
        )}

        <div className="max-h-64 overflow-y-auto">
          {uniqueValues
            .filter(([value]) => value.toString().includes(searchValue))
            .map((value) => (
              <DropdownMenuElement
                key={value[0]}
                onClick={() => toggleFilter(value[0])}
                isRendered={supportsFilter}
                status={status}
              >
                <input type="checkbox" checked={isFilterChecked(value[0])} className="cursor-pointer" readOnly />
                {value[0]}
              </DropdownMenuElement>
            ))}
        </div>

        <DropdownMenuElement
          onClick={() => clearFilters()}
          isRendered={supportsFilter}
          disabled={!filterValue}
          status={status}
        >
          <TrashIcon className="w-4 h-4" />
          Wyczyść filtry
        </DropdownMenuElement>
      </div>
    </motion.div>
  );
}
