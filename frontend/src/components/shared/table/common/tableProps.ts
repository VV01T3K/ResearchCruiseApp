import { RowData, Table } from '@tanstack/react-table';
import { InfiniteScrollProps } from '@/components/shared/table/common/AppTableInfiniteScrollTrigger';

// Lets a column supply a known-complete filter option list instead of deriving it from loaded rows.
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterOptions?: string[];
  }
}

export type TableProps<T> = {
  table: Table<T>;
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
  emptyTableMessage?: string;
  variant?: 'form' | 'table';
  errors?: string[];
  showRequiredAsterisk?: boolean;
  infiniteScroll?: InfiniteScrollProps;
  'data-testid'?: string;
};
