import { flexRender } from '@tanstack/react-table';
import { Header } from '@/components/shared/table/common/tableFeatures';
import FunnelIcon from 'bootstrap-icons/icons/funnel.svg?react';
import React from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppModal } from '@/components/shared/AppModal';
import { AppTableInfiniteScrollTrigger } from '@/components/shared/table/common/AppTableInfiniteScrollTrigger';
import { TableProps } from '@/components/shared/table/common/tableProps';
import { AppMobileTableFilterForm } from '@/components/shared/table/mobile/AppMobileTableFilterForm';
import { cn, createModalPortal } from '@/lib/utils';
import { AppTableBody } from '@/components/shared/table/common/AppTableBody';

export function AppMobileTable<T extends object>({
  table,
  buttons,
  emptyTableMessage,
  variant,
  showRequiredAsterisk,
  errors,
  infiniteScroll,
  virtualized,
  'data-testid': testId,
}: TableProps<T>) {
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const defaultButtons: React.ReactNode[] = [
    <AppButton key="openFilterModalBtn" onClick={() => setIsFilterModalOpen(true)} variant="primary">
      <FunnelIcon className="h-8 w-8" />
      <span className="sr-only">Filtrowanie i sortowanie</span>
    </AppButton>,
  ];
  const allButtons = buttons ? buttons(defaultButtons) : defaultButtons;

  return (
    <>
      <div className={cn('flex flex-col flex-wrap', variant === 'form' ? 'text-center' : '')} data-testid={testId}>
        {allButtons.length > 0 && (
          <div className="m-4 flex flex-col gap-4">
            {allButtons.map((x, id) => (
              // oxlint-disable-next-line @eslint-react/no-array-index-key
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
          <AppTableBody
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
                      <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
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
      {createModalPortal(
        <AppModal
          title="Filtrowanie i sortowanie"
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
        >
          <AppMobileTableFilterForm table={table} />
        </AppModal>
      )}
    </>
  );
}

const variants = {
  table: 'flex justify-between gap-4 items-center w-full px-5',
  form: 'flex flex-col gap-4 w-full px-5',
};
