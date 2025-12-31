import { Header } from '@tanstack/react-table';
import FunnelIcon from 'bootstrap-icons/icons/funnel.svg?react';
import FunnelFillIcon from 'bootstrap-icons/icons/funnel-fill.svg?react';

export function AppTableFilterIcon<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanFilter()) {
    return null;
  }

  if (header.column.getFilterValue()) {
    return <FunnelFillIcon className="h-4 w-4" />;
  }

  return <FunnelIcon className="h-4 w-4" />;
}
