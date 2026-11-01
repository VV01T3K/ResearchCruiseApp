import { Subscribe } from '@tanstack/react-table';
import { Header } from '@/integrations/tanstack/table/features';
import { FunnelIcon } from '@phosphor-icons/react';

export function TableFilterIcon<TData extends object, TValue>({ header }: { header: Header<TData, TValue> }) {
  if (!header.column.getCanFilter()) {
    return <div className="h-3.5 w-3.5 shrink-0" />;
  }

  return (
    <Subscribe source={header.column.table.atoms.columnFilters} selector={() => !!header.column.getFilterValue()}>
      {(isFiltered) => <FunnelIcon weight={isFiltered ? 'fill' : undefined} className="h-3.5 w-3.5 shrink-0" />}
    </Subscribe>
  );
}
