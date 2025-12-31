import { flexRender, Header } from '@tanstack/react-table';
import FunnelIcon from 'bootstrap-icons/icons/funnel.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppModal } from '@/core/components/AppModal';
import { TableProps } from '@/core/components/table/common/tableProps';
import { AppMobileTableFilterForm } from '@/core/components/table/mobile/AppMobileTableFilterForm';
import { cn, createModalPortal } from '@/core/lib/utils';

export function AppMobileTable<T>({
  table,
  buttons,
  emptyTableMessage,
  variant,
  showRequiredAsterisk,
  errors,
  'data-testid': testId,
}: TableProps<T>) {
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const defaultButtons: React.ReactNode[] = [
    <AppButton key="openFilterModalBtn" onClick={() => setIsFilterModalOpen(true)} variant="primary">
      <FunnelIcon className="h-8 w-8" />
    </AppButton>,
  ];
  const allButtons = buttons ? buttons(defaultButtons) : defaultButtons;

  return (
    <>
      <div className={cn('flex flex-col flex-wrap', variant === 'form' ? 'text-center' : '')} data-testid={testId}>
        {allButtons.length > 0 && (
          <div className="m-4 flex flex-col gap-4">
            {allButtons.map((x, id) => (
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <div key={id} className="flex justify-end">
                {x}
              </div>
            ))}
          </div>
        )}
        <table className="w-full table-fixed">
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-gray-800 odd:bg-gray-100">
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
              </tr>
            ))}
            {!!emptyTableMessage && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-0 pb-0 text-center">
                  <div
                    className={`rounded-lg border bg-gray-100 p-2.5 ${
                      errors ? 'border-danger ring-danger text-danger bg-gray-50' : 'border-gray-300'
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
          </tbody>
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
