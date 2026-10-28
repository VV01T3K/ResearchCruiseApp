import { expect, it } from 'vite-plus/test';
import { compareFilterOptions } from '@/integrations/tanstack/table/filterOptions';

it('sorts filter options with Polish collation and empty values first', () => {
  const values = ['Zofia Ćwik', 'Jan Kowalski Junior', 10, null, 'Łukasz Żak', 'Jan Kowalski', 9, 'Abiotyczne'];
  expect(values.sort(compareFilterOptions)).toEqual([
    null,
    9,
    10,
    'Abiotyczne',
    'Jan Kowalski',
    'Jan Kowalski Junior',
    'Łukasz Żak',
    'Zofia Ćwik',
  ]);
});
