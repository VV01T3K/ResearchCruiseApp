import { RowData, TableFeatures } from '@tanstack/react-table';
import { Table } from '@/integrations/tanstack/table/features';
import { InfiniteScrollProps } from '@/components/shared/table/common/AppTableInfiniteScrollTrigger';

// Lets a column supply a known-complete filter option list instead of deriving it from loaded rows.
declare module '@tanstack/react-table' {
  interface ColumnMeta<TFeatures extends TableFeatures, TData extends RowData, TValue> {
    filterOptions?: string[];
    filterInputType?: 'number' | 'date';
    getFilterOptionLabel?: (value: string) => string;
  }
}

export type TableProps<T extends object> = {
  table: Table<T>;
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
  emptyTableMessage?: string;
  variant?: 'form' | 'table';
  errors?: string[];
  showRequiredAsterisk?: boolean;
  infiniteScroll?: InfiniteScrollProps;
  virtualized?: boolean;
  'data-testid'?: string;
};
