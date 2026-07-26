import { Header } from '@tanstack/react-table';
import { Funnel } from 'lucide-react';

export function AppTableFilterIcon<TData>({ header }: { header: Header<TData, unknown> }) {
  if (!header.column.getCanFilter()) {
    return <div className="h-3.5 w-3.5 shrink-0" />;
  }

  if (header.column.getFilterValue()) {
    return <Funnel className="h-3.5 w-3.5 shrink-0 fill-current" />;
  }

  return <Funnel className="h-3.5 w-3.5 shrink-0" />;
}
