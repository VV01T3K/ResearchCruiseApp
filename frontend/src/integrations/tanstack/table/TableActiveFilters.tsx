import { Subscribe } from '@tanstack/react-table';
import { XIcon } from '@phosphor-icons/react';

import { Table } from '@/integrations/tanstack/table/features';
import { getColumnTitle } from '@/integrations/tanstack/table/filterOptions';

export function TableActiveFilters<T extends object>({ table }: { table: Table<T> }) {
  return (
    <Subscribe source={table.atoms.columnFilters} selector={(filters) => filters}>
      {(filters) =>
        filters.length > 0 && (
          <ul aria-label="Aktywne filtry" className="mr-auto flex flex-wrap items-center gap-2 text-sm font-normal">
            {filters.map(({ id, value }) => {
              const column = table.getColumn(id);
              if (!column) return null;
              const title = getColumnTitle(column);
              const getLabel = column.columnDef.meta?.getFilterOptionLabel ?? String;
              const labels = (value as string[]).map((item) => getLabel(item));
              return (
                <li
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full bg-primary-100 py-1 pr-1 pl-3 text-primary-950"
                >
                  <span className="max-w-64 truncate" title={labels.join(', ')}>
                    <span className="font-semibold">{title}:</span> {labels[0]}
                    {labels.length > 1 && ` +${labels.length - 1}`}
                  </span>
                  <button
                    type="button"
                    aria-label={`Usuń filtr: ${title}`}
                    title={`Usuń filtr: ${title}`}
                    onClick={() => column.setFilterValue(undefined)}
                    className="cursor-pointer rounded-full p-1 hover:bg-primary-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )
      }
    </Subscribe>
  );
}
