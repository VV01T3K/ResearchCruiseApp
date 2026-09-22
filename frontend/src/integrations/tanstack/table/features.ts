import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_arrIncludes,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
} from '@tanstack/react-table';
import type * as TableTypes from '@tanstack/react-table';

export const appTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowSortingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { arrIncludes: filterFn_arrIncludes },
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

export type ColumnDef<T extends TableTypes.RowData, TValue = unknown> = TableTypes.ColumnDef<
  typeof appTableFeatures,
  T,
  TValue
>;
export type Row<T extends TableTypes.RowData> = TableTypes.Row<typeof appTableFeatures, T>;
export type Header<T extends TableTypes.RowData, TValue> = TableTypes.Header<typeof appTableFeatures, T, TValue>;
export type Table<T extends TableTypes.RowData> = TableTypes.Table<typeof appTableFeatures, T>;
