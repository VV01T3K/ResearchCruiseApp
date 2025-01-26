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
import { AppButton } from '@core/components/AppButton';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import { cn } from '@lib/utils';

type AppTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  extraButtonsUpdater?: (predifinedButtons: React.ReactNode[]) => React.ReactNode[];
};

export function AppTable<TData>({ data, columns, extraButtonsUpdater }: AppTableProps<TData>) {
  const table = useReactTable<TData>({
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

  function isAnyFilterActive() {
    return table.getAllColumns().some((column) => column.getIsFiltered());
  }

  const predifnedButtons = [
    <AppButton
      onClick={() => table.resetColumnFilters()}
      className={cn(isAnyFilterActive() ? '' : 'opacity-50')}
      variant="danger"
      disabled={!isAnyFilterActive()}
    >
      <TrashIcon className="w-4 h-4 mr-2" />
      Wyczyść filtry
    </AppButton>,
  ];
  const extraButtons = extraButtonsUpdater ?? ((buttons) => buttons);

  return (
    <div>
      <div className="flex justify-end gap-4 my-4">{...extraButtons(predifnedButtons)}</div>
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <AppTableHeader key={header.id} header={header}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </AppTableHeader>
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
