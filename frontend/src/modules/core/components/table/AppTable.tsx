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

import { AppDesktopTable } from '@/core/components/table/desktop/AppDesktopTable';
import { AppMobileTable } from '@/core/components/table/mobile/AppMobileTable';
import { useWindowSize } from '@/core/hooks/WindowSizeHook';

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
  emptyTableMessage?: string;
  showRequiredAsterisk?: boolean;
  rowSelectionState?: RowSelectionState;
  setRowSelectionState?: OnChangeFn<RowSelectionState>;
  initialSortingState?: SortingState;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  variant?: 'form' | 'table';
  disabled?: boolean;
  errors?: string[];
  'data-testid'?: string;
};

export function AppTable<T>({
  data,
  columns,
  buttons,
  emptyTableMessage,
  showRequiredAsterisk = false,
  rowSelectionState,
  setRowSelectionState,
  initialSortingState,
  getRowId,
  variant = 'table',
  disabled = false,
  errors,
  'data-testid': testId,
}: Props<T>) {
  'use no memo'; // Disable React Compiler memoization for TanStack Table compatibility
  const { width } = useWindowSize();
  // eslint-disable-next-line react-hooks/incompatible-library
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
      showRequiredAsterisk={showRequiredAsterisk}
      variant={variant}
      errors={errors}
      data-testid={testId}
    />
  );
}
