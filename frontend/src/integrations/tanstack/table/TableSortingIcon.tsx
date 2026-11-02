import { Subscribe } from '@tanstack/react-table';
import { Header } from '@/integrations/tanstack/table/features';
import { ArrowDownIcon, ArrowUpIcon, CaretUpDownIcon } from '@phosphor-icons/react';

export function TableSortingIcon<TData extends object, TValue>({ header }: { header: Header<TData, TValue> }) {
  const { column } = header;
  const isSorted = column.getIsSorted();

  if (!isSorted) {
    return <CaretUpDownIcon className="size-3.5 shrink-0 text-gray-500" />;
  }

  const Icon = isSorted === 'asc' ? ArrowUpIcon : ArrowDownIcon;
  return (
    <span className="inline-flex shrink-0 items-center">
      <Icon weight="bold" className="size-3.5" />
      <Subscribe
        source={column.table.atoms.sorting}
        selector={(sorting) => (sorting.length > 1 ? column.getSortIndex() + 1 : null)}
      >
        {(position) => position && <span className="text-xs tabular-nums">{position}</span>}
      </Subscribe>
    </span>
  );
}
