import { Header } from '@tanstack/react-table';
import { ArrowDownAZ } from 'lucide-react';
import { ArrowUpAZ } from 'lucide-react';
import { X } from 'lucide-react';

export function AppTableSortingToggle<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanSort()) {
    return null;
  }

  if (header.column.getIsSorted() === 'desc') {
    return (
      <span className="flex items-center gap-2">
        <X className="h-4 w-4" />
        Usuń sortowanie
      </span>
    );
  }

  if (header.column.getIsSorted() === 'asc') {
    return (
      <span className="flex items-center gap-2">
        <ArrowUpAZ className="h-4 w-4" />
        Sortuj rosnąco
      </span>
    );
  }

  // header.column.getIsSorted() === false
  return (
    <span className="flex items-center gap-2">
      <ArrowDownAZ className="h-4 w-4" />
      Sortuj malejąco
    </span>
  );
}
