import { Header } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { ChevronsUpDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';

export function AppTableSortingIcon<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanSort()) {
    return <div className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getIsSorted() === 'asc') {
    return <ChevronDown className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getIsSorted() === 'desc') {
    return <ChevronUp className="h-3.5 w-3.5 shrink-0" />;
  }

  return <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" />;
}
