import { Table } from '@tanstack/react-table';
import { InfiniteScrollProps } from '@/components/shared/table/common/AppTableInfiniteScrollTrigger';

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
