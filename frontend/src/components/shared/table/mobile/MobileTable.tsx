import { flexRender } from '@tanstack/react-table';
import { Header } from '@/integrations/tanstack/table/features';
import { FunnelIcon } from '@phosphor-icons/react';
import React from 'react';

import { hasErrors } from '@/components/inputs/invalidInput';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { TableInfiniteScrollTrigger } from '@/components/shared/table/common/TableInfiniteScrollTrigger';
import { TableProps } from '@/components/shared/table/common/tableProps';
import { MobileTableFilterForm } from '@/components/shared/table/mobile/MobileTableFilterForm';
import { cn, createModalPortal } from '@/lib/utils';
import { TableBody } from '@/integrations/tanstack/table/TableBody';
import { TableCell } from '@/integrations/tanstack/table/TableCell';

export function MobileTable<T extends object>({
  table,
  buttons,
  emptyTableMessage,
  variant,
  showRequiredAsterisk,
  errors,
  infiniteScroll,
  virtualized,
  className,
}: TableProps<T>) {
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const defaultButtons: React.ReactNode[] = [
    <Button key="openFilterModalBtn" onClick={() => setIsFilterModalOpen(true)} variant="primary">
      <FunnelIcon className="h-8 w-8" />
      <span className="sr-only">Filtrowanie i sortowanie</span>
    </Button>,
  ];
  const allButtons = buttons ? buttons(defaultButtons) : defaultButtons;

  return (
    <>
      <div className={cn('flex flex-col flex-wrap', variant === 'form' ? 'text-center' : '', className)}>
        {allButtons.length > 0 && (
          <div className="m-4 flex flex-col gap-4">
            {allButtons.map((x, id) => (
              <div key={id} className="flex justify-end">
                {x}
              </div>
            ))}
          </div>
        )}
        <table
          className="w-full table-fixed"
          aria-rowcount={virtualized ? (infiniteScroll?.hasNextPage ? -1 : table.getRowModel().rows.length) : undefined}
        >
          <TableBody
            table={table}
            columnCount={1}
            virtualized={virtualized}
            estimateRowHeight={600}
            renderCells={(row) => (
              <td className="flex flex-col items-center justify-center gap-2 py-3">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <div key={cell.id} className={variants[variant ?? 'table']}>
                      <div className="font-bold">
                        {flexRender(cell.column.columnDef.header, {
                          table,
                          column: cell.column,
                          header: { column: cell.column } as Header<T, unknown>,
                        })}
                      </div>
                      <div>
                        <TableCell cell={cell} />
                      </div>
                    </div>
                  );
                })}
              </td>
            )}
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
      {createModalPortal(
        <Modal title="Filtrowanie i sortowanie" isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
          <MobileTableFilterForm table={table} />
        </Modal>
      )}
    </>
  );
}

const variants = {
  table: 'flex justify-between gap-4 items-center w-full px-5',
  form: 'flex flex-col gap-4 w-full px-5',
};
