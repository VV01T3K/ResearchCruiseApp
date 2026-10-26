import { Header } from '@/integrations/tanstack/table/features';
import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react';

export function AppTableSortingIcon<TData extends object, TValue>({ header }: { header: Header<TData, TValue> }) {
  if (!header.column.getCanSort()) {
    return <div className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getIsSorted() === 'asc') {
    return <CaretDownIcon className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getIsSorted() === 'desc') {
    return <CaretUpIcon className="h-3.5 w-3.5 shrink-0" />;
  }

  return <CaretUpDownIcon className="h-3.5 w-3.5 shrink-0" />;
}
