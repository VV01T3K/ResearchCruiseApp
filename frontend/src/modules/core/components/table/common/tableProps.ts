import { Table } from '@tanstack/react-table';

export type TableProps<T> = {
  table: Table<T>;
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
  emptyTableMessage?: string;
  variant?: 'form' | 'table';
};
