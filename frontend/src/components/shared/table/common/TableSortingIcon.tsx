import { Subscribe } from '@tanstack/react-table';
import { Header } from '@/integrations/tanstack/table/features';
import { CaretDownIcon, CaretUpDownIcon, CaretUpIcon } from '@phosphor-icons/react';

export function TableSortingIcon<TData extends object, TValue>({ header }: { header: Header<TData, TValue> }) {
  if (!header.column.getCanSort()) {
    return <div className="h-3.5 w-3.5 shrink-0" />;
  }

  return (
    <Subscribe source={header.column.table.atoms.sorting} selector={() => header.column.getIsSorted()}>
      {(isSorted) => {
        if (isSorted === 'asc') {
          return <CaretDownIcon className="h-3.5 w-3.5 shrink-0" />;
        }

        if (isSorted === 'desc') {
          return <CaretUpIcon className="h-3.5 w-3.5 shrink-0" />;
        }

        return <CaretUpDownIcon className="h-3.5 w-3.5 shrink-0" />;
      }}
    </Subscribe>
  );
}
