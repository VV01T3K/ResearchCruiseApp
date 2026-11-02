export function plural(count: number, one: string, few: string, many: string) {
  const form = new Intl.PluralRules('pl').select(count);
  if (form === 'one') return one;
  return form === 'few' ? few : many;
}
