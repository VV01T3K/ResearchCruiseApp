import { flexRender } from '@tanstack/react-table';

import { AppTableClearFiltersButton } from '@/core/components/table/common/AppTableClearFiltersButton';
import { TableProps } from '@/core/components/table/common/tableProps';
import { AppDesktopTableHeader } from '@/core/components/table/desktop/AppDesktopTableHeader';

export function AppDesktopTable<T>({ table, buttons, emptyTableMessage }: TableProps<T>) {
  const defaultButtons: React.ReactNode[] = [<AppTableClearFiltersButton key="clearFiltersBtn" table={table} />];
  const allButtons = buttons ? buttons(defaultButtons) : defaultButtons;

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead>
          {allButtons.length > 0 && (
            <tr key="header-buttons">
              <th
                colSpan={Math.max(
                  table
                    .getHeaderGroups()
                    .flatMap((x) => x.headers.map((y) => y.colSpan))
                    .reduce((a, b) => a + b, 0)
                )}
              >
                <div className="flex justify-end flex-wrap gap-4 my-4">{allButtons}</div>
              </th>
            </tr>
          )}
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <AppDesktopTableHeader key={header.id} header={header}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </AppDesktopTableHeader>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="odd:bg-gray-100 text-gray-800">
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className="text-center py-2 first:pl-4 pr-4"
                    style={{ width: `${cell.column.getSize()}px` }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
          {!!emptyTableMessage && table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={table.getAllColumns().length} className="pb-4 text-center bg-gray-100 py-3 rounded-lg">
                {emptyTableMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
