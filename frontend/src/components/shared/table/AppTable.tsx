import {
  ColumnDef,
  ColumnFiltersState,
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

import { AppDesktopTable } from '@/components/shared/table/desktop/AppDesktopTable';
import { InfiniteScrollProps } from '@/components/shared/table/common/AppTableInfiniteScrollTrigger';
import { AppMobileTable } from '@/components/shared/table/mobile/AppMobileTable';
import { useWindowSize } from '@/hooks/shared/WindowSizeHook';

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  buttons?: (predefinedButtons: React.ReactNode[]) => React.ReactNode[];
  emptyTableMessage?: string;
  showRequiredAsterisk?: boolean;
  rowSelectionState?: RowSelectionState;
  setRowSelectionState?: OnChangeFn<RowSelectionState>;
  columnFiltersState?: ColumnFiltersState;
  setColumnFiltersState?: OnChangeFn<ColumnFiltersState>;
  initialSortingState?: SortingState;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  variant?: 'form' | 'table';
  disabled?: boolean;
  errors?: string[];
  infiniteScroll?: InfiniteScrollProps;
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
  columnFiltersState,
  setColumnFiltersState,
  initialSortingState,
  getRowId,
  variant = 'table',
  disabled = false,
  errors,
  infiniteScroll,
  'data-testid': testId,
}: Props<T>) {
  'use no memo'; // Disable React Compiler memoization for TanStack Table compatibility
  const { width } = useWindowSize();
  // oxlint-disable-next-line react-hooks/incompatible-library
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
    onColumnFiltersChange: setColumnFiltersState,
    state: {
      rowSelection: rowSelectionState,
      columnFilters: columnFiltersState,
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
      infiniteScroll={infiniteScroll}
      data-testid={testId}
    />
  );
}
