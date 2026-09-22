import { Header } from '@/integrations/tanstack/table/features';

export function getCapabilities<TData extends object, TValue>(header: Header<TData, TValue>) {
  return {
    supportsFilter: header.column.getCanFilter(),
    supportsSort: header.column.getCanSort(),
    supportsDropdown: header.column.getCanFilter() || header.column.getCanSort(),
  };
}
