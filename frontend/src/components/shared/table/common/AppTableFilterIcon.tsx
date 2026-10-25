import { Header } from '@/integrations/tanstack/table/features';
import { FunnelIcon } from '@phosphor-icons/react';

export function AppTableFilterIcon<TData extends object, TValue>({ header }: { header: Header<TData, TValue> }) {
  if (!header.column.getCanFilter()) {
    return <div className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getFilterValue()) {
    return <FunnelIcon weight="fill" className="h-3.5 w-3.5 shrink-0" />;
  }

  return <FunnelIcon className="h-3.5 w-3.5 shrink-0" />;
}
