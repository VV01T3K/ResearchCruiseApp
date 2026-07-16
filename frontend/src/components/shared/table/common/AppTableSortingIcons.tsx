import { Header } from '@tanstack/react-table';
import { ChevronDown as ChevronDownIcon } from 'lucide-react';
import { ChevronsUpDown as ChevronExpandIcon } from 'lucide-react';
import { ChevronUp as ChevronUpIcon } from 'lucide-react';

export function AppTableSortingIcon<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanSort()) {
    return <div className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getIsSorted() === 'asc') {
    return <ChevronDownIcon className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getIsSorted() === 'desc') {
    return <ChevronUpIcon className="h-3.5 w-3.5 shrink-0" />;
  }

  return <ChevronExpandIcon className="h-3.5 w-3.5 shrink-0" />;
}
