import { Popover } from '@base-ui/react/popover';
import { Subscribe } from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretDownIcon,
  CheckIcon,
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
      {(isSorted) => (
        <th
          scope="col"
          colSpan={header.colSpan}
          abbr={canSort || canFilter ? getColumnTitle(column) : undefined}
          style={{ width: `${header.getSize()}px` }}
          aria-sort={
            !canSort ? undefined : isSorted === 'asc' ? 'ascending' : isSorted === 'desc' ? 'descending' : 'none'
          }
          className="border-b border-border-muted px-1 py-2 text-sm font-semibold text-neutral-700"
        >
          <div className="flex items-center justify-center gap-1">
            <span className={cn('p-1 text-center', isSorted && 'text-primary')}>{children}</span>
            {(canSort || canFilter) && <ColumnMenu header={header} isSorted={isSorted} />}
          </div>
        </th>
      )}
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
        {(count) => {
          const label = [
            title,
            isSorted && `posortowano ${isSorted === 'asc' ? 'rosnąco' : 'malejąco'}`,
            count && `wybrano: ${count}`,
          ]
            .filter(Boolean)
            .join(', ');
          return (
            <Popover.Trigger
              aria-label={label}
              title={label}
              className={cn(
                'group relative inline-flex h-6 w-9 shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-md border outline-none focus-visible:ring-2 focus-visible:ring-primary',
                count
                  ? 'border-primary bg-primary-100 text-primary hover:bg-primary-200'
                  : isSorted
                    ? 'border-primary bg-surface text-primary hover:bg-primary-100 data-[popup-open]:bg-primary-100'
                    : 'border-border bg-surface text-neutral-600 hover:bg-surface-subtle hover:text-foreground data-[popup-open]:bg-surface-subtle'
              )}
            >
              {count ? (
                <FunnelIcon weight="fill" className="size-3.5" />
              ) : (
                !isSorted && (
                  <CaretDownIcon
                    weight="bold"
                    className="size-3 transition-transform duration-300 ease-out group-data-[popup-open]:rotate-180"
                  />
                )
              )}
              {isSorted === 'asc' && <ArrowUpIcon weight="bold" className="size-3.5" />}
              {isSorted === 'desc' && <ArrowDownIcon weight="bold" className="size-3.5" />}
              {count > 1 && (
                <span className="absolute -top-2 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-inverse-foreground tabular-nums">
                  <span className="[text-box:trim-both_cap_alphabetic]">{count}</span>
                </span>
              )}
            </Popover.Trigger>
          );
        }}
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
                    'flex h-8 cursor-pointer items-center gap-2.5 rounded-md px-2 text-left text-sm font-normal text-neutral-800 outline-none hover:bg-surface-subtle',
                    active && 'bg-primary-100 font-medium text-primary hover:bg-primary-200'
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
            <div className={cn(canSort && 'border-t border-border-muted')}>
              <TableFilterList header={header} />
            </div>
          )}
        </div>
      </PickerPopup>
    </Popover.Root>
  );
}
