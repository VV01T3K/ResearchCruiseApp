import { FlexRender } from '@tanstack/react-table';

import { hasErrors } from '@/components/inputs/invalidInput';
import { TableClearFiltersButton } from '@/components/shared/table/common/TableClearFiltersButton';
import { TableInfiniteScrollTrigger } from '@/components/shared/table/common/TableInfiniteScrollTrigger';
import { TableProps } from '@/components/shared/table/common/tableProps';
import { DesktopTableHeader } from '@/integrations/tanstack/table/DesktopTableHeader';
import { TableActiveFilters } from '@/integrations/tanstack/table/TableActiveFilters';
import { TableBody } from '@/integrations/tanstack/table/TableBody';
import { cn } from '@/lib/utils';

export function DesktopTable<T extends object>({
  table,
  buttons,
  emptyTableMessage,
  showRequiredAsterisk,
  errors,
  infiniteScroll,
  virtualized,
  className,
}: TableProps<T>) {
  const defaultButtons: React.ReactNode[] = [<TableClearFiltersButton key="clearFiltersBtn" table={table} />];
  const allButtons = buttons ? buttons(defaultButtons) : defaultButtons;
  const rows = table.getRowModel().rows;
  const headerRowCount = table.getHeaderGroups().length;

  return (
    <div className={cn('mt-2 pt-2', className)} data-toolbarless-table={allButtons.length === 0 || undefined}>
      {allButtons.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-end gap-4">
          <TableActiveFilters table={table} />
          {allButtons}
        </div>
      )}
      <div className="-mx-1 overflow-x-auto px-1">
        <table
          className={cn('min-w-full table-fixed border-collapse', virtualized && 'w-full')}
          aria-rowcount={virtualized ? (infiniteScroll?.hasNextPage ? -1 : rows.length + headerRowCount) : undefined}
        >
          <colgroup>
            {table.getAllColumns().map((column) => (
              <col
                key={column.id}
                style={{ width: virtualized ? `${column.getSize()}px` : `${column.columnDef.size}%` }}
              />
            ))}
          </colgroup>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <DesktopTableHeader key={header.id} header={header}>
                      <FlexRender header={header} />
                    </DesktopTableHeader>
                  ))}
                </tr>
              );
            })}
          </thead>
          <TableBody
            table={table}
            columnCount={table.getVisibleLeafColumns().length}
            headerRowCount={headerRowCount}
            virtualized={virtualized}
            estimateRowHeight={120}
            renderCells={(row) =>
              row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className={cn('px-1.5 py-3 text-center', virtualized && '[overflow-wrap:anywhere]')}
                  >
                    <FlexRender cell={cell} />
                  </td>
                );
              })
            }
          >
            {!!emptyTableMessage && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-0 pb-0 text-center">
                  <div
                    className={`rounded-lg border bg-surface-subtle p-2.5 ${
                      hasErrors(errors) ? 'border-danger bg-surface-muted text-danger ring-danger' : 'border-border'
                    }`}
                  >
                    <span title={showRequiredAsterisk ? 'Pole jest obowiązkowe do wypełnienia' : undefined}>
                      {emptyTableMessage}
                    </span>
                    {showRequiredAsterisk && (
                      <span className="ml-1 font-bold text-danger" title="Pole jest obowiązkowe do wypełnienia">
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
                  <TableInfiniteScrollTrigger {...infiniteScroll} />
                </td>
              </tr>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
