import { ColumnFiltersState, OnChangeFn, RowSelectionState, SortingState, useTable } from '@tanstack/react-table';
import { appTableFeatures, ColumnDef, Row } from '@/integrations/tanstack/table/features';

import { AppDesktopTable } from '@/components/shared/table/desktop/AppDesktopTable';
import { InfiniteScrollProps } from '@/components/shared/table/common/AppTableInfiniteScrollTrigger';
import { AppMobileTable } from '@/components/shared/table/mobile/AppMobileTable';
import { useWindowSize } from '@/hooks/shared/WindowSizeHook';

type Props<T extends object> = {
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
  sortingState?: SortingState;
  setSortingState?: OnChangeFn<SortingState>;
  enableMultiSort?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  variant?: 'form' | 'table';
  disabled?: boolean;
  errors?: string[];
  infiniteScroll?: InfiniteScrollProps;
  virtualized?: boolean;
  'data-testid'?: string;
};

export function AppTable<T extends object>({
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
  sortingState,
  setSortingState,
  enableMultiSort = true,
  manualSorting = false,
  manualFiltering = false,
  getRowId,
  variant = 'table',
  disabled = false,
  errors,
  infiniteScroll,
  virtualized = false,
  'data-testid': testId,
}: Props<T>) {
  const { width } = useWindowSize();
  const table = useTable({
    features: appTableFeatures,
    columns,
    data,
    defaultColumn: {
      filterFn: 'arrIncludes',
      sortFn: 'alphanumeric',
    },
    ...(setRowSelectionState !== undefined && { onRowSelectionChange: setRowSelectionState }),
    ...(setColumnFiltersState !== undefined && { onColumnFiltersChange: setColumnFiltersState }),
    ...(setSortingState !== undefined && { onSortingChange: setSortingState }),
    enableMultiSort,
    manualSorting,
    manualFiltering,
    state: {
      ...(rowSelectionState !== undefined && { rowSelection: rowSelectionState }),
      ...(columnFiltersState !== undefined && { columnFilters: columnFiltersState }),
      ...(sortingState !== undefined && { sorting: sortingState }),
      columnVisibility: {
        actions: !disabled,
      },
    },
    initialState: {
      sorting: initialSortingState ?? [],
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
      virtualized={virtualized}
      data-testid={testId}
    />
  );
}
