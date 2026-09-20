import { Header } from '@/components/shared/table/common/tableFeatures';

export function getCapabilities<TData extends object, TValue>(header: Header<TData, TValue>) {
  return {
    supportsFilter: header.column.getCanFilter(),
    supportsSort: header.column.getCanSort(),
    supportsDropdown: header.column.getCanFilter() || header.column.getCanSort(),
  };
}
