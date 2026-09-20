import { Table } from '@/components/shared/table/common/tableFeatures';

import { AppButton } from '@/components/shared/AppButton';

type Props<T extends object> = {
  table: Table<T>;
};
export function AppTableClearFiltersButton<T extends object>({ table }: Props<T>) {
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
