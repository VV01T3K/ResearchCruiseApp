import { Header } from '@tanstack/react-table';
import SortDownIcon from 'bootstrap-icons/icons/sort-down.svg?react';
import SortUpIcon from 'bootstrap-icons/icons/sort-up.svg?react';
import XIcon from 'bootstrap-icons/icons/x.svg?react';

import { AppTableListItem } from '@/components/shared/table/common/AppTableListItem';

export function AppTableSortingToggle<TData>({
  header,
  expanded,
}: {
  header: Header<TData, unknown>;
  expanded: boolean;
}) {
  if (!header.column.getCanSort()) {
    return null;
  }

  const isSorted = header.column.getIsSorted();

  return (
    <>
      <AppTableListItem
        onClick={() => header.column.toggleSorting(false)}
        isRendered
        disabled={isSorted === 'asc'}
        expanded={expanded}
      >
        <SortUpIcon className="mr-2 h-4 w-4" />
        Sortuj rosnąco
      </AppTableListItem>
      <AppTableListItem
        onClick={() => header.column.toggleSorting(true)}
        isRendered
        disabled={isSorted === 'desc'}
        expanded={expanded}
      >
        <SortDownIcon className="mr-2 h-4 w-4" />
        Sortuj malejąco
      </AppTableListItem>
      <AppTableListItem
        onClick={() => header.column.clearSorting()}
        isRendered
        disabled={!isSorted}
        expanded={expanded}
      >
        <XIcon className="mr-2 h-4 w-4" />
        Usuń sortowanie
      </AppTableListItem>
    </>
  );
}
