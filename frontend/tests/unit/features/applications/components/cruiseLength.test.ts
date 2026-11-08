import { expect, it } from 'vite-plus/test';

import { formatCruiseLength } from '@/features/applications/components/formA/cruisePeriodExplanation';

it.each([
  [0, '0 h'],
  [1, '1 h'],
  [24, '1 dzień'],
  [27, '1 dzień 3 h'],
  [48, '2 dni'],
  [125, '5 dni 5 h'],
])('shows %i hours as days and hours', (hours, text) => {
  expect(formatCruiseLength(hours)).toBe(text);
});
