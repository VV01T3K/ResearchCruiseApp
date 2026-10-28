type FilterOption = string | number | boolean | null | undefined;

const collator = new Intl.Collator('pl', { numeric: true });

export function compareFilterOptions(a: FilterOption, b: FilterOption) {
  return collator.compare(a == null ? '' : String(a), b == null ? '' : String(b));
}
