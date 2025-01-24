import React, { useRef } from 'react';
import ChevronExpandIcon from 'bootstrap-icons/icons/chevron-expand.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import FunnelIcon from 'bootstrap-icons/icons/funnel.svg?react';
import FunnelFillIcon from 'bootstrap-icons/icons/funnel-fill.svg?react';
import SortUpIcon from 'bootstrap-icons/icons/sort-up.svg?react';
import SortDownIcon from 'bootstrap-icons/icons/sort-down.svg?react';
import XIcon from 'bootstrap-icons/icons/x.svg?react';
import { flexRender, Header } from '@tanstack/react-table';
import { cn } from '@lib/utils';
import { AppTableHeaderDropdownStatus } from '../types';

type AppTableHeaderProps<TData> = {
  header: Header<TData, unknown>;
  status: AppTableHeaderDropdownStatus;
  setStatus: (status: AppTableHeaderDropdownStatus) => void;
};

export function AppTableHeader<TData>({ header, status, setStatus }: AppTableHeaderProps<TData>) {
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (status !== 'open') {
        return;
      }

      if (ref.current && !ref.current.contains(event.target as Node)) {
        setStatus('closed');
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  function getFilterIcon() {
    if (!header.column.getCanFilter()) {
      return null;
    }

    if (header.column.getFilterValue()) {
      return <FunnelFillIcon className="w-4 h-4" />;
    }

    return <FunnelIcon className="w-4 h-4" />;
  }

  function getSortingIcon() {
    if (!header.column.getCanSort()) {
      return null;
    }

    if (header.column.getIsSorted() === 'asc') {
      return <ChevronDownIcon className="w-4 h-4" />;
    }

    if (header.column.getIsSorted() === 'desc') {
      return <ChevronUpIcon className="w-4 h-4" />;
    }

    return <ChevronExpandIcon className="w-4 h-4" />;
  }

  function getSortButton() {
    if (!header.column.getCanSort()) {
      return null;
    }

    if (header.column.getIsSorted() === 'desc') {
      return (
        <span className="flex gap-2 items-center">
          <XIcon className="w-4 h-4" />
          Usuń sortowanie
        </span>
      );
    }

    if (header.column.getIsSorted() === 'asc') {
      return (
        <span className="flex gap-2 items-center">
          <SortUpIcon className="w-4 h-4" />
          Sortuj rosnąco
        </span>
      );
    }

    // header.column.getIsSorted() === false
    return (
      <span className="flex gap-2 items-center">
        <SortDownIcon className="w-4 h-4" />
        Sortuj malejąco
      </span>
    );
  }

  function toggleFilter(filter: unknown) {
    const currentFilter = (header.column.getFilterValue() as unknown[] | undefined) ?? [];

    if (currentFilter.includes(filter)) {
      header.column.setFilterValue(currentFilter.filter((f) => f !== filter));
      return;
    }

    header.column.setFilterValue([...currentFilter, filter]);
  }

  function clearFilters() {
    header.column.setFilterValue([]);
  }

  function isFilterChecked(filter: unknown) {
    return ((header.column.getFilterValue() as unknown[] | undefined) ?? []).includes(filter);
  }

  return (
    <th key={header.id} colSpan={header.colSpan}>
      <div className="relative inline-block">
        <div>
          <button
            type="button"
            className={cn('inline-flex items-center gap-2', header.column.getCanSort() ? 'cursor-pointer' : '')}
            onClick={(evt) => {
              setStatus(status === 'open' ? 'closed' : 'open');
              evt.stopPropagation();
            }}
          >
            {getFilterIcon()} {flexRender(header.column.columnDef.header, header.getContext())} {getSortingIcon()}
          </button>
        </div>

        <div
          className={cn(
            'absolute right-0 origin-top-right w-56 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden motion-duration-500',
            status === 'closed' ? '-motion-translate-y-out-25 motion-opacity-out-0 -z-50 duration-1000' : '',
            status === 'open' ? 'motion-opacity-in-0 -motion-translate-y-in-25 z-10' : '',
            status === 'default' ? 'opacity-0 -z-50' : ''
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
          ref={ref}
        >
          <div className="py-1" role="none">
            {header.column.getCanSort() && (
              <button
                type="button"
                className="inline-flex gap-4 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                tabIndex={-1}
                onClick={() => header.column.toggleSorting()}
              >
                {getSortButton()}
              </button>
            )}
            {header.column.getCanFilter() && (
              <>
                <hr className="h-px border-0 dark:bg-gray-700" />
                {Array.from(header.column.getFacetedUniqueValues().entries()).map((value) => (
                  <button
                    key={value[0]}
                    type="button"
                    className="inline-flex gap-4 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => toggleFilter(value[0])}
                  >
                    <input type="checkbox" checked={isFilterChecked(value[0])} readOnly />
                    {value[0]}
                  </button>
                ))}
                <button
                  type="button"
                  className={cn(
                    'inline-flex gap-4 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                    header.column.getFilterValue() ? '' : 'opacity-50'
                  )}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={clearFilters}
                  disabled={!header.column.getFilterValue()}
                >
                  <TrashIcon className="w-4 h-4" />
                  Wyczyść filtry
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </th>
  );
}
