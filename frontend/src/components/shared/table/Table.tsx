import { ColumnFiltersState, OnChangeFn, RowSelectionState, SortingState, useTable } from '@tanstack/react-table';
import { appTableFeatures, ColumnDef, Row } from '@/integrations/tanstack/table/features';

import { DesktopTable } from '@/components/shared/table/desktop/DesktopTable';
import { InfiniteScrollProps } from '@/components/shared/table/common/TableInfiniteScrollTrigger';

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
  enableSortingRemoval?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  disabled?: boolean;
  errors?: string[];
  infiniteScroll?: InfiniteScrollProps;
  virtualized?: boolean;
  className?: string;
};

export function Table<T extends object>({
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
  enableSortingRemoval,
  manualSorting = false,
  manualFiltering = false,
  getRowId,
  disabled = false,
  errors,
  infiniteScroll,
  virtualized = false,
  className,
}: Props<T>) {
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
    enableSortingRemoval,
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

  return (
    <DesktopTable
      table={table}
      buttons={!disabled ? buttons : () => []}
      emptyTableMessage={emptyTableMessage}
      showRequiredAsterisk={showRequiredAsterisk}
      errors={errors}
      infiniteScroll={infiniteScroll}
      virtualized={virtualized}
      className={className}
    />
  );
}
