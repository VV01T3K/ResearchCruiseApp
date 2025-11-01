import { Table } from '@tanstack/react-table';
import { ReactNode } from 'react';

export type TableProps<T> = {
  table: Table<T>;
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
  // allow React nodes so callers can include markup (e.g. an asterisk with a tooltip)
  emptyTableMessage?: ReactNode;
  variant?: 'form' | 'table';
  // if true, and the table is empty, automatically append the required
  // marker to the emptyTableMessage when any column declares meta.required = true
  autoMarkEmptyWhenColumnsRequired?: boolean;
};
