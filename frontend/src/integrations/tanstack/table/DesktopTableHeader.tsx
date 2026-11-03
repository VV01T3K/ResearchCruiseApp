import { Popover } from '@base-ui/react/popover';
import { Subscribe } from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  DotsThreeVerticalIcon,
  FunnelIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  XIcon,
} from '@phosphor-icons/react';
import React from 'react';

import { PickerPopup } from '@/components/inputs/dates/PickerPopup';
import { Header } from '@/integrations/tanstack/table/features';
import { getColumnTitle } from '@/integrations/tanstack/table/filterOptions';
import { TableFilterList } from '@/integrations/tanstack/table/TableFilterList';
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
        const SortIcon = isSorted === 'asc' ? ArrowUpIcon : ArrowDownIcon;
        return (
          <th
            scope="col"
            colSpan={header.colSpan}
            abbr={canSort || canFilter ? getColumnTitle(column) : undefined}
            style={{ width: `${header.getSize()}px` }}
            aria-sort={
              !canSort ? undefined : isSorted === 'asc' ? 'ascending' : isSorted === 'desc' ? 'descending' : 'none'
            }
            className="border-b border-gray-200 px-1 py-2 text-sm font-semibold text-gray-700"
          >
            <div className="flex items-center gap-1">
              <span
                className={cn('inline-flex flex-1 items-center justify-center gap-1 p-1', isSorted && 'text-primary')}
              >
                {children}
                {isSorted && <SortIcon weight="bold" className="size-3.5 shrink-0" />}
              </span>
              {(canSort || canFilter) && <ColumnMenu header={header} isSorted={isSorted} />}
            </div>
          </th>
        );
      }}
    </Subscribe>
  );
}

function ColumnMenu<TData extends object, TValue>({
  header,
  isSorted,
}: {
  header: Header<TData, TValue>;
  isSorted: false | 'asc' | 'desc';
}) {
  const { column } = header;
  const canSort = column.getCanSort();
  const canFilter = column.getCanFilter();
  const title = `${canSort && canFilter ? 'Sortuj i filtruj' : canSort ? 'Sortuj' : 'Filtruj'}: ${getColumnTitle(column)}`;
  const sortItems = [
    {
      label: 'Sortuj rosnąco',
      Icon: SortAscendingIcon,
      active: isSorted === 'asc',
      apply: () => column.toggleSorting(false),
    },
    {
      label: 'Sortuj malejąco',
      Icon: SortDescendingIcon,
      active: isSorted === 'desc',
      apply: () => column.toggleSorting(true),
    },
    ...(isSorted && column.table.options.enableSortingRemoval !== false
      ? [{ label: 'Wyłącz sortowanie', Icon: XIcon, active: undefined, apply: () => column.clearSorting() }]
      : []),
  ];

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
              'inline-flex h-6 min-w-6 shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-md border px-1 outline-none focus-visible:ring-2 focus-visible:ring-primary',
              count
                ? 'border-primary bg-primary-100 text-primary hover:bg-primary-200'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-[popup-open]:bg-gray-100'
            )}
          >
            {count ? (
              <FunnelIcon weight="fill" className="size-3.5" />
            ) : (
              <DotsThreeVerticalIcon weight="bold" className="size-3.5" />
            )}
            {count > 1 && <span className="text-xs tabular-nums">{count}</span>}
          </Popover.Trigger>
        )}
      </Subscribe>
      <PickerPopup aria-label={title}>
        <div className={cn('flex max-w-[calc(100vw-2rem)] flex-col', canFilter ? 'w-80' : 'w-56')}>
          {canSort && (
            <div role="group" aria-label="Sortowanie" className="flex flex-col p-1.5">
              {sortItems.map(({ label, Icon, active, apply }) => (
                <Popover.Close
                  key={label}
                  aria-pressed={active}
                  onClick={apply}
                  className={cn(
                    'flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2 text-left text-sm font-normal text-gray-800 outline-none hover:bg-gray-100',
                    active && 'font-medium text-primary'
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {active && <CheckIcon weight="bold" className="size-3.5 shrink-0" />}
                </Popover.Close>
              ))}
            </div>
          )}
          {canFilter && (
            <div className={cn(canSort && 'border-t border-gray-200')}>
              <TableFilterList header={header} />
            </div>
          )}
        </div>
      </PickerPopup>
    </Popover.Root>
  );
}
