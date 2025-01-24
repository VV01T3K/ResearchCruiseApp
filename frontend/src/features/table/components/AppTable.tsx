import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AppTableHeader } from './AppTableHeader';
import React from 'react';
import { AppTableHeaderDropdownStatus } from '../types';
import { AppButton } from '@core/components/AppButton';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import { cn } from '@lib/utils';

type AppTableProps<TRow> = {
  data: TRow[];
  columns: ColumnDef<TRow, unknown>[];
};

export function AppTable<TRow>({ data, columns }: AppTableProps<TRow>) {
  const table = useReactTable<TRow>({
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
  });

  const [columnHeaderDropdownStatuses, setColumnHeaderDropdownStatuses] = React.useState<
    Record<string, AppTableHeaderDropdownStatus>
  >(
    table
      .getHeaderGroups()
      .flatMap((headerGroup) => headerGroup.headers.map((header) => header.id))
      .reduce((acc, id) => ({ ...acc, [id]: 'default' }), {})
  );

  function updateStatus(headerGroupId: string, status: AppTableHeaderDropdownStatus) {
    setColumnHeaderDropdownStatuses((prev) => {
      const newStatuses = { ...prev, [headerGroupId]: status };
      if (status === 'open') {
        Object.keys(newStatuses).forEach((key) => {
          if (key !== headerGroupId) {
            newStatuses[key] = 'default';
          }
        });
      }
      return newStatuses;
    });
  }

  function isAnyFilterActive() {
    return table.getAllColumns().some((column) => column.getIsFiltered());
  }

  return (
    <div>
      <div className="flex justify-end gap-4 my-4">
        <AppButton
          onClick={() => table.resetColumnFilters()}
          className={cn(isAnyFilterActive() ? '' : 'opacity-50')}
          variant="danger"
          disabled={!isAnyFilterActive()}
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Wyczyść filtry
        </AppButton>
      </div>
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <AppTableHeader
                    header={header}
                    status={columnHeaderDropdownStatuses[header.id]}
                    setStatus={(status) => updateStatus(header.id, status)}
                  />
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id} className="text-center pt-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
