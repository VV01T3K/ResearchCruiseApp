import {
  ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';

import { AppDesktopTable } from '@/core/components/table/desktop/AppDesktopTable';
import { AppMobileTable } from '@/core/components/table/mobile/AppMobileTable';
import { useWindowSize } from '@/core/hooks/WindowSizeHook';

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
  emptyTableMessage?: React.ReactNode;
  autoMarkEmptyWhenColumnsRequired?: boolean;
  rowSelectionState?: RowSelectionState;
  setRowSelectionState?: OnChangeFn<RowSelectionState>;
  initialSortingState?: SortingState;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  variant?: 'form' | 'table';
  disabled?: boolean;
};

export function AppTable<T>({
  data,
  columns,
  buttons,
  emptyTableMessage,
  autoMarkEmptyWhenColumnsRequired = false,
  rowSelectionState,
  setRowSelectionState,
  initialSortingState,
  getRowId,
  variant = 'table',
  disabled = false,
}: Props<T>) {
  const { width } = useWindowSize();
  const table = useReactTable<T>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    defaultColumn: {
      filterFn: 'arrIncludesSome',
      sortingFn: 'alphanumeric',
    },
    onRowSelectionChange: setRowSelectionState,
    state: {
      rowSelection: rowSelectionState,
      columnVisibility: {
        actions: !disabled,
      },
    },
    initialState: {
      sorting: initialSortingState,
    },
    getRowId: getRowId,
  });

  const isMobile = width < 768;
  const TableComponent = isMobile ? AppMobileTable : AppDesktopTable;

  return (
    <TableComponent
      table={table}
      buttons={!disabled ? buttons : () => []}
      emptyTableMessage={emptyTableMessage}
      autoMarkEmptyWhenColumnsRequired={autoMarkEmptyWhenColumnsRequired}
      variant={variant}
    />
  );
}
