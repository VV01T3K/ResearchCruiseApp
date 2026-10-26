import { Header } from '@/integrations/tanstack/table/features';
import { SortAscendingIcon, SortDescendingIcon, XIcon } from '@phosphor-icons/react';

import { AppTableListItem } from '@/components/shared/table/common/AppTableListItem';

export function AppTableSortingToggle<TData extends object, TValue>({
  header,
  expanded,
}: {
  header: Header<TData, TValue>;
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
        <SortAscendingIcon className="mr-2 h-4 w-4" />
        Sortuj rosnąco
      </AppTableListItem>
      <AppTableListItem
        onClick={() => header.column.toggleSorting(true)}
        isRendered
        disabled={isSorted === 'desc'}
        expanded={expanded}
      >
        <SortDescendingIcon className="mr-2 h-4 w-4" />
        Sortuj malejąco
      </AppTableListItem>
      <AppTableListItem
        onClick={() => header.column.clearSorting()}
        isRendered
        disabled={!isSorted}
        expanded={expanded}
      >
        <XIcon className="mr-2 h-4 w-4 scale-55" />
        Usuń sortowanie
      </AppTableListItem>
    </>
  );
}
