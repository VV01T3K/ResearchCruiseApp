import type { RowData } from '@tanstack/react-table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import type { Row } from './features';

export function ActionsHeader() {
  return <span className="sr-only">Akcje</span>;
}

export function DeleteRowCell<T extends RowData>({ row }: { row: Row<T> }) {
  return (
    <div className="flex justify-end">
      <TableDeleteRowButton onClick={() => row.table.options.meta?.removeRow?.(row.index)} />
    </div>
  );
}
