import { Header } from '@tanstack/react-table';

export function getCapabilities<TData, TValue>(header: Header<TData, TValue>) {
  return {
    supportsFilter: header.column.getCanFilter(),
    supportsSort: header.column.getCanSort(),
    supportsDropdown: header.column.getCanFilter() || header.column.getCanSort(),
  };
}
