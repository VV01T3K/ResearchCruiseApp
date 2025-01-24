import { AppButton } from '@core/components/AppButton';
import { UserPublication } from '@core/models';
import { cn } from '@lib/utils';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Trash from 'bootstrap-icons/icons/trash.svg?react';

const columnHelper = createColumnHelper<UserPublication>();

const columns = [
  columnHelper.accessor('publication.title', {
    header: 'Tytuł',
  }),
  columnHelper.accessor('publication.authors', {
    header: 'Autorzy',
  }),
  columnHelper.accessor('publication.doi', {
    header: 'DOI',
  }),
  columnHelper.accessor('publication.magazine', {
    header: 'Czasopismo',
  }),
  columnHelper.accessor('publication.year', {
    header: 'Rok',
  }),
  columnHelper.accessor('publication.ministerialPoints', {
    header: 'Punkty ministerialne',
  }),
];

export function UserPublicationTable({
  userPublications,
  handleDeletePublication,
}: {
  userPublications: UserPublication[];
  handleDeletePublication: (id: string) => void;
}) {
  const table = useReactTable({
    columns,
    data: userPublications,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="px-6 py-3" key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
              <th className="px-6 py-3">Akcje</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="odd:bg-white even:bg-gray-50 border-b hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td className={cn('px-6 py-3', cell.column.getIndex() == 0 ? 'font-bold' : '')} key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td>
                <AppButton
                  variant="dangerOutline"
                  className="mr-2 text-xs"
                  onClick={() => handleDeletePublication(row.original.publication.id)}
                >
                  Usuń <Trash className="w-3 h-3 ml-1" />
                </AppButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
