type FilterOption = string | number | boolean | null | undefined;

const collator = new Intl.Collator('pl', { numeric: true });

export function compareFilterOptions(a: FilterOption, b: FilterOption) {
  return collator.compare(a == null ? '' : String(a), b == null ? '' : String(b));
}

export function getColumnTitle(column: { id: string; columnDef: { header?: unknown } }) {
  return typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
}
