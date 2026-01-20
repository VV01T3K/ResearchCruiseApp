import { Header } from '@tanstack/react-table';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronExpandIcon from 'bootstrap-icons/icons/chevron-expand.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';

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
