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
  useReactTable,
} from '@tanstack/react-table';

import { AppDesktopTable } from '@/core/components/table/desktop/AppDesktopTable';
import { AppMobileTable } from '@/core/components/table/mobile/AppMobileTable';
import { useWindowSize } from '@/core/hooks/WindowSizeHook';

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
  emptyTableMessage?: string;
  rowSelectionState?: RowSelectionState;
  setRowSelectionState?: OnChangeFn<RowSelectionState>;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  variant?: 'form' | 'table';
};

export function AppTable<T>({
  data,
  columns,
  buttons,
  emptyTableMessage,
  rowSelectionState,
  setRowSelectionState,
  getRowId,
  variant = 'table',
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
    },
    onRowSelectionChange: setRowSelectionState,
    state: {
      rowSelection: rowSelectionState,
    },
    getRowId: getRowId,
  });

  const isMobile = width < 768;
  const TableComponent = isMobile ? AppMobileTable : AppDesktopTable;

  return <TableComponent table={table} buttons={buttons} emptyTableMessage={emptyTableMessage} variant={variant} />;
}
