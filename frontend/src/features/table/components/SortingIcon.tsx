import { Header } from '@tanstack/react-table';
import ChevronExpandIcon from 'bootstrap-icons/icons/chevron-expand.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';

export function SortingIcon<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanSort()) {
    return null;
  }

  if (header.column.getIsSorted() === 'asc') {
    return <ChevronDownIcon className="w-4 h-4" />;
  }

  if (header.column.getIsSorted() === 'desc') {
    return <ChevronUpIcon className="w-4 h-4" />;
  }

  return <ChevronExpandIcon className="w-4 h-4" />;
}
