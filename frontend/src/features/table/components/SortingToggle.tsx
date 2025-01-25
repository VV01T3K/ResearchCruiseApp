import { Header } from '@tanstack/react-table';
import SortUpIcon from 'bootstrap-icons/icons/sort-up.svg?react';
import SortDownIcon from 'bootstrap-icons/icons/sort-down.svg?react';
import XIcon from 'bootstrap-icons/icons/x.svg?react';

export function SortingToggle<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanSort()) {
    return null;
  }

  if (header.column.getIsSorted() === 'desc') {
    return (
      <span className="flex gap-2 items-center">
        <XIcon className="w-4 h-4" />
        Usuń sortowanie
      </span>
    );
  }

  if (header.column.getIsSorted() === 'asc') {
    return (
      <span className="flex gap-2 items-center">
        <SortUpIcon className="w-4 h-4" />
        Sortuj rosnąco
      </span>
    );
  }

  // header.column.getIsSorted() === false
  return (
    <span className="flex gap-2 items-center">
      <SortDownIcon className="w-4 h-4" />
      Sortuj malejąco
    </span>
  );
}
