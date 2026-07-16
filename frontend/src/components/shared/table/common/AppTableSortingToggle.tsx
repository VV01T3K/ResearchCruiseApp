import { Header } from '@tanstack/react-table';
import { ArrowDownAZ as SortDownIcon } from 'lucide-react';
import { ArrowUpAZ as SortUpIcon } from 'lucide-react';
import { X as XIcon } from 'lucide-react';

export function AppTableSortingToggle<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanSort()) {
    return null;
  }

  if (header.column.getIsSorted() === 'desc') {
    return (
      <span className="flex items-center gap-2">
        <XIcon className="h-4 w-4" />
        Usuń sortowanie
      </span>
    );
  }

  if (header.column.getIsSorted() === 'asc') {
    return (
      <span className="flex items-center gap-2">
        <SortUpIcon className="h-4 w-4" />
        Sortuj rosnąco
      </span>
    );
  }

  // header.column.getIsSorted() === false
  return (
    <span className="flex items-center gap-2">
      <SortDownIcon className="h-4 w-4" />
      Sortuj malejąco
    </span>
  );
}
