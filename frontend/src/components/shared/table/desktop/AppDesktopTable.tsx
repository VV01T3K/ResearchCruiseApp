import { flexRender } from '@tanstack/react-table';

import { AppTableClearFiltersButton } from '@/components/shared/table/common/AppTableClearFiltersButton';
import { AppTableInfiniteScrollTrigger } from '@/components/shared/table/common/AppTableInfiniteScrollTrigger';
import { TableProps } from '@/components/shared/table/common/tableProps';
import { AppDesktopTableHeader } from '@/components/shared/table/desktop/AppDesktopTableHeader';
import { AppTableBody } from '@/components/shared/table/common/AppTableBody';

export function AppDesktopTable<T extends object>({
  table,
  buttons,
  emptyTableMessage,
  showRequiredAsterisk,
  errors,
  infiniteScroll,
  virtualized,
  'data-testid': testId,
}: TableProps<T>) {
  const defaultButtons: React.ReactNode[] = [<AppTableClearFiltersButton key="clearFiltersBtn" table={table} />];
  const allButtons = buttons ? buttons(defaultButtons) : defaultButtons;
  const rows = table.getRowModel().rows;
  const headerRowCount = table.getHeaderGroups().length + (allButtons.length > 0 ? 1 : 0);

  return (
    <div className="mt-4 w-full overflow-x-auto" data-testid={testId}>
      <table
        className="min-w-full table-fixed border-collapse"
        aria-rowcount={virtualized ? (infiniteScroll?.hasNextPage ? -1 : rows.length + headerRowCount) : undefined}
      >
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
                <div className="mb-4 flex flex-wrap justify-end gap-4">{allButtons}</div>
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
        <AppTableBody
          table={table}
          columnCount={table.getVisibleLeafColumns().length}
          headerRowCount={headerRowCount}
          virtualized={virtualized}
          estimateRowHeight={120}
          renderCells={(row) =>
            row.getVisibleCells().map((cell) => {
              return (
                <td key={cell.id} className="px-3 py-3 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })
          }
        >
          {!!emptyTableMessage && table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={table.getAllColumns().length} className="px-0 pb-0 text-center">
                <div
                  className={`rounded-lg border bg-gray-100 p-2.5 ${
                    errors ? 'border-danger bg-gray-50 text-danger ring-danger' : 'border-gray-300'
                  }`}
                >
                  <span title={showRequiredAsterisk ? 'Pole jest obowiązkowe do wypełnienia' : undefined}>
                    {emptyTableMessage}
                  </span>
                  {showRequiredAsterisk && (
                    <span className="ml-1 font-bold text-red-600" title="Pole jest obowiązkowe do wypełnienia">
                      *
                    </span>
                  )}
                </div>
              </td>
            </tr>
          )}
          {infiniteScroll && (
            <tr role="presentation">
              <td role="presentation" colSpan={table.getAllColumns().length} className="p-0">
                <AppTableInfiniteScrollTrigger {...infiniteScroll} />
              </td>
            </tr>
          )}
        </AppTableBody>
      </table>
    </div>
  );
}
