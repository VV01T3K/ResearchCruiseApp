import { Header } from '@/components/shared/table/common/tableFeatures';
import FunnelIcon from 'bootstrap-icons/icons/funnel.svg?react';
import FunnelFillIcon from 'bootstrap-icons/icons/funnel-fill.svg?react';

export function AppTableFilterIcon<TData extends object, TValue>({ header }: { header: Header<TData, TValue> }) {
  if (!header.column.getCanFilter()) {
    return <div className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getFilterValue()) {
    return <FunnelFillIcon className="h-3.5 w-3.5 shrink-0" />;
  }

  return <FunnelIcon className="h-3.5 w-3.5 shrink-0" />;
}
