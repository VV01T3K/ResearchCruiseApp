import { Popover } from '@base-ui/react/popover';
import { Subscribe } from '@tanstack/react-table';
import React from 'react';

import { PickerPopup } from '@/components/inputs/dates/PickerPopup';
import { TableFilterIcon } from '@/components/shared/table/common/TableFilterIcon';
import { Header } from '@/integrations/tanstack/table/features';
import { getColumnTitle } from '@/integrations/tanstack/table/filterOptions';
import { TableFilterList } from '@/integrations/tanstack/table/TableFilterList';
import { TableSortingIcon } from '@/integrations/tanstack/table/TableSortingIcon';
import { cn } from '@/lib/utils';

type Props<TData extends object, TValue> = {
  header: Header<TData, TValue>;
  children: React.ReactNode;
};
export function DesktopTableHeader<TData extends object, TValue>({ header, children }: Props<TData, TValue>) {
  const { column } = header;
  const canSort = column.getCanSort();
  const canFilter = column.getCanFilter();

  return (
    <Subscribe source={column.table.atoms.sorting} selector={() => column.getIsSorted()}>
      {(isSorted) => {
        const nextOrder = column.getNextSortingOrder();
        return (
          <th
            scope="col"
            colSpan={header.colSpan}
            abbr={canFilter ? getColumnTitle(column) : undefined}
            style={{ width: `${header.getSize()}px` }}
            aria-sort={
              !canSort ? undefined : isSorted === 'asc' ? 'ascending' : isSorted === 'desc' ? 'descending' : 'none'
            }
            className="border-b border-gray-200 px-1 py-2 text-sm font-semibold text-gray-700"
          >
            <div className="flex items-center justify-center gap-0.5">
              {canSort ? (
                <button
                  type="button"
                  onClick={column.getToggleSortingHandler()}
                  title={
                    nextOrder === 'asc'
                      ? 'Sortuj rosnąco'
                      : nextOrder === 'desc'
                        ? 'Sortuj malejąco'
                        : 'Usuń sortowanie'
                  }
                  className={cn(
                    'inline-flex cursor-pointer items-center gap-1 rounded-md p-1 outline-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary',
                    isSorted && 'text-primary'
                  )}
                >
                  {children}
                  <TableSortingIcon header={header} />
                </button>
              ) : (
                <span className="p-1">{children}</span>
              )}
              {canFilter && <FilterPopover header={header} />}
            </div>
          </th>
        );
      }}
    </Subscribe>
  );
}

function FilterPopover<TData extends object, TValue>({ header }: { header: Header<TData, TValue> }) {
  const { column } = header;
  const title = `Filtruj: ${getColumnTitle(column)}`;

  return (
    <Popover.Root>
      <Subscribe
        source={column.table.atoms.columnFilters}
        selector={() => (column.getFilterValue() as string[] | undefined)?.length ?? 0}
      >
        {(count) => (
          <Popover.Trigger
            aria-label={count ? `${title}, wybrano: ${count}` : title}
            title={title}
            className={cn(
              'inline-flex h-6 min-w-6 shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-md px-1 outline-none focus-visible:ring-2 focus-visible:ring-primary',
              count
                ? 'bg-primary-100 text-primary hover:bg-primary-200'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 data-[popup-open]:bg-gray-100'
            )}
          >
            <TableFilterIcon header={header} />
            {count > 1 && <span className="text-xs tabular-nums">{count}</span>}
          </Popover.Trigger>
        )}
      </Subscribe>
      <PickerPopup aria-label={title}>
        <div className="flex w-80 max-w-[calc(100vw-2rem)] flex-col">
          <Popover.Title className="px-3 pt-3 text-sm font-semibold text-gray-900">{title}</Popover.Title>
          <TableFilterList header={header} />
        </div>
      </PickerPopup>
    </Popover.Root>
  );
}
