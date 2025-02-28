import { flexRender, Header } from '@tanstack/react-table';
import FunnelIcon from 'bootstrap-icons/icons/funnel.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppModal } from '@/core/components/AppModal';
import { TableProps } from '@/core/components/table/common/tableProps';
import { AppMobileTableFilterForm } from '@/core/components/table/mobile/AppMobileTableFilterForm';
import { createModalPortal } from '@/core/lib/utils';

export function AppMobileTable<T>({ table, buttons, emptyTableMessage, variant }: TableProps<T>) {
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const defaultButtons: React.ReactNode[] = [
    <AppButton key="openFilterModalBtn" onClick={() => setIsFilterModalOpen(true)} variant="primary">
      <FunnelIcon className="w-8 h-8" />
    </AppButton>,
  ];
  const allButtons = buttons ? buttons(defaultButtons) : defaultButtons;

  return (
    <>
      <div className="flex flex-wrap flex-col">
        <div className="flex flex-col gap-4 m-4">
          {allButtons.map((x, id) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <div key={id} className="flex justify-end">
              {x}
            </div>
          ))}
        </div>
        <table className="w-full table-fixed">
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="odd:bg-gray-100 text-gray-800">
                <td className="flex flex-col gap-2 justify-center items-center py-3">
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
                <td colSpan={table.getAllColumns().length} className="pb-4 text-center bg-gray-100 py-3 rounded-lg">
                  {emptyTableMessage}
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
