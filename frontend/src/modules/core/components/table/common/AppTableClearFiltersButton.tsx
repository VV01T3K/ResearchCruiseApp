import { Table } from '@tanstack/react-table';

import { AppButton } from '@/core/components/AppButton';

type Props<T> = {
  table: Table<T>;
};
export function AppTableClearFiltersButton<T>({ table }: Props<T>) {
  function isAnyFilterActive() {
    return table.getAllColumns().some((column) => column.getIsFiltered());
  }

  return (
    <AppButton
      key="clearFiltersBtn"
      onClick={() => table.resetColumnFilters()}
      className={isAnyFilterActive() ? '' : 'opacity-50'}
      variant="danger"
      disabled={!isAnyFilterActive()}
    >
      Wyczyść filtry
    </AppButton>
  );
}
