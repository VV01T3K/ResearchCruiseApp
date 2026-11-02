import { expect, it } from 'vite-plus/test';

import { plural } from '@/lib/plural';

it.each([
  [0, 'many'],
  [1, 'one'],
  [2, 'few'],
  [4, 'few'],
  [5, 'many'],
  [12, 'many'],
  [22, 'few'],
  [25, 'many'],
])('picks the Polish form for %i', (count, form) => {
  expect(plural(count, 'one', 'few', 'many')).toBe(form);
});
