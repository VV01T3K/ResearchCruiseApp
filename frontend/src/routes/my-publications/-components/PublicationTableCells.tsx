import { Subscribe } from '@tanstack/react-table';
import type { PublicationResponse } from '@/api/generated/schemas';
import { Checkbox } from '@/components/shared/inputs/Checkbox';
import type { Row, Table } from '@/integrations/tanstack/table/features';

export function SelectAllPublicationsHeader({ table }: { table: Table<PublicationResponse> }) {
  return (
    <Subscribe source={table.atoms.columnFilters} selector={(filters) => filters}>
      {() => (
        <Subscribe source={table.atoms.rowSelection} selector={() => table.getIsAllRowsSelected()}>
          {(allSelected) => (
            <Checkbox
              aria-label="Zaznacz wszystkie publikacje"
              name="selectAllPublications"
              onChange={(x) => table.toggleAllRowsSelected(x)}
              checked={allSelected}
              size="lg"
            />
          )}
        </Subscribe>
      )}
    </Subscribe>
  );
}

export function SelectPublicationCell({ row }: { row: Row<PublicationResponse> }) {
  return (
    <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => !!selection[row.id]}>
      {(selected) => (
        <Checkbox
          aria-label={`Zaznacz publikację ${row.original.title}`}
          name={`selectPublication-${row.id}`}
          checked={selected}
          disabled={!row.getCanSelect()}
          onChange={(checked) => row.toggleSelected(checked)}
          className="inline-block"
          size="md"
        />
      )}
    </Subscribe>
  );
}
