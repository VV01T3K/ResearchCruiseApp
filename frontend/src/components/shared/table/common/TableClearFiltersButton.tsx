import { Table } from '@/integrations/tanstack/table/features';

import { Button } from '@/components/shared/Button';

type Props<T extends object> = {
  table: Table<T>;
};
export function TableClearFiltersButton<T extends object>({ table }: Props<T>) {
  function isAnyFilterActive() {
    return table.getAllColumns().some((column) => column.getIsFiltered());
  }

  return (
    <Button
      key="clearFiltersBtn"
      onClick={() => table.resetColumnFilters()}
      className={isAnyFilterActive() ? '' : 'opacity-50'}
      variant="danger"
      disabled={!isAnyFilterActive()}
    >
      Wyczyść filtry
    </Button>
  );
}
