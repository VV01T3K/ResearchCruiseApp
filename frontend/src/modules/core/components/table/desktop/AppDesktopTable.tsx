import { flexRender } from '@tanstack/react-table';

import { AppTableClearFiltersButton } from '@/core/components/table/common/AppTableClearFiltersButton';
import { TableProps } from '@/core/components/table/common/tableProps';
import { AppDesktopTableHeader } from '@/core/components/table/desktop/AppDesktopTableHeader';

export function AppDesktopTable<T>({ table, buttons, emptyTableMessage, autoMarkEmptyWhenColumnsRequired }: TableProps<T>) {
  const defaultButtons: React.ReactNode[] = [<AppTableClearFiltersButton key="clearFiltersBtn" table={table} />];
  const allButtons = buttons ? buttons(defaultButtons) : defaultButtons;

  return (
    <div className="w-full overflow-x-auto mt-4">
      <table className="min-w-full table-fixed">
        <colgroup>
          {table.getAllColumns().map((column) => (
            <col key={column.id} style={{ width: `${column.columnDef.size}%` }} />
          ))}
        </colgroup>
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
                <div className="flex justify-end flex-wrap gap-4 mb-4">{allButtons}</div>
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
                  <td key={cell.id} className="text-center py-2 first:pl-2 pr-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
          {!!emptyTableMessage && table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={table.getAllColumns().length} className="pb-4 text-center bg-gray-100 py-3 rounded-lg">
                {(() => {
                  const hasRequiredColumn = table
                    .getAllColumns()
                    .some(
                      (c) => Boolean(((c.columnDef as unknown) as { meta?: { required?: boolean } })?.meta?.required)
                    );
                  if (autoMarkEmptyWhenColumnsRequired && hasRequiredColumn) {
                    return (
                      <>
                        {emptyTableMessage}
                        <span className="ml-1 text-red-600 font-bold" title="pole wymagane do wypełnienia" aria-label="pole wymagane do wypełnienia">
                          *
                        </span>
                      </>
                    );
                  }
                  return emptyTableMessage;
                })()}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
