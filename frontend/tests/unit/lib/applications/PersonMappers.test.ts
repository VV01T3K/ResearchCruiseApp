import { expect, it } from 'vite-plus/test';

import { mapPersonToLabel, mapPersonToText } from '@/lib/applications/PersonMappers';
import { emptyGuid } from '@/lib/applications/person';

const id = '11111111-1111-4111-8111-111111111111';

it.each([
  [
    'a person with an email',
    { id, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
    'Ada Lovelace (ada@example.com)',
  ],
  ['a person without an email', { id, firstName: 'Ada', lastName: 'Lovelace', email: '' }, 'Ada Lovelace'],
  ['a deleted person', { id, firstName: '', lastName: '', email: '' }, 'Nieznany użytkownik'],
  ['an unassigned person', { id: emptyGuid, firstName: '', lastName: '', email: '' }, ''],
])('labels %s', (_, person, expected) => {
  expect(mapPersonToText(person)).toBe(expected);
  expect(mapPersonToLabel(person).inlineLabel).toBe(expected);
});

it('labels a missing person as unassigned', () => {
  expect(mapPersonToText(undefined)).toBe('');
});
