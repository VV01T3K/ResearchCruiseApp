import { Subscribe } from '@tanstack/react-table';
import { Header } from '@/integrations/tanstack/table/features';
import { SortAscendingIcon, SortDescendingIcon, XIcon } from '@phosphor-icons/react';

import { TableListItem } from '@/components/shared/table/common/TableListItem';

export function TableSortingToggle<TData extends object, TValue>({
  header,
  expanded,
}: {
  header: Header<TData, TValue>;
  expanded: boolean;
}) {
  if (!header.column.getCanSort()) {
    return null;
  }

  return (
    <Subscribe source={header.column.table.atoms.sorting} selector={() => header.column.getIsSorted()}>
      {(isSorted) => (
        <>
          <TableListItem
            onClick={() => header.column.toggleSorting(false)}
            isRendered
            disabled={isSorted === 'asc'}
            expanded={expanded}
          >
            <SortAscendingIcon className="mr-2 h-4 w-4" />
            Sortuj rosnąco
          </TableListItem>
          <TableListItem
            onClick={() => header.column.toggleSorting(true)}
            isRendered
            disabled={isSorted === 'desc'}
            expanded={expanded}
          >
            <SortDescendingIcon className="mr-2 h-4 w-4" />
            Sortuj malejąco
          </TableListItem>
          <TableListItem
            onClick={() => header.column.clearSorting()}
            isRendered
            disabled={!isSorted}
            expanded={expanded}
          >
            <XIcon className="mr-2 h-4 w-4 scale-55" />
            Usuń sortowanie
          </TableListItem>
        </>
      )}
    </Subscribe>
  );
}
