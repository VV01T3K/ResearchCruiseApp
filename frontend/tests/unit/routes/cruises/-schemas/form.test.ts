import { expect, it } from 'vite-plus/test';
import { cruise } from '@tests/data/cruises';
import { manager, deputy } from '@tests/data/accounts';
import { emptyGuid } from '@/lib/applications/person';
import { CruiseFormSchema, cruiseFormDefaultValues, mapCruiseToValues } from '@/routes/cruises/-schemas/form.schema';

it('writes the shared create/update cruise API shape', () => {
  expect(CruiseFormSchema.parse(mapCruiseToValues(cruise()))).toEqual({
    startDate: '2026-06-01T08:00:00Z',
    endDate: '2026-06-02T11:00:00Z',
    mainManagerId: manager.id,
    deputyManagerId: deputy.id,
    cruiseApplicationIds: [],
    title: 'Bałtyk',
    shipUnavailable: false,
    revision: 'AAAAAAAAB9E=',
  });
});

it.each([
  ['mainManagerId', 'Nieprawidłowy identyfikator kierownika rejsu'],
  ['deputyManagerId', 'Nieprawidłowy identyfikator zastępcy kierownika rejsu'],
])('rejects a malformed %s with a field-specific message', (path, message) => {
  const result = CruiseFormSchema.safeParse({ ...mapCruiseToValues(cruise()), [path]: 'not-a-guid' });
  expect(result.error?.issues).toEqual([expect.objectContaining({ path: [path], message })]);
});

it.each([
  ['endDate', { endDate: '2026-05-01T00:00:00Z' }],
  ['deputyManagerId', { mainManagerId: manager.id, deputyManagerId: manager.id }],
  ['title', { title: '  ', shipUnavailable: true }],
])('rejects invalid %s', (path, change) => {
  const result = CruiseFormSchema.safeParse({ ...mapCruiseToValues(cruise()), ...change });
  expect(result).toMatchObject({
    success: false,
    error: { issues: expect.arrayContaining([expect.objectContaining({ path: path.split('.') })]) },
  });
});

it.each([
  ['a cruise without a deputy', { mainManagerId: manager.id }, manager.id],
  ['an unassigned blockade', { title: 'Remont', shipUnavailable: true }, emptyGuid],
])('sends blank managers of %s as the empty GUID', (_, change, mainManagerId) => {
  const values = {
    ...cruiseFormDefaultValues,
    startDate: '2026-06-01T08:00:00Z',
    endDate: '2026-06-02T11:00:00Z',
    ...change,
  };
  expect(CruiseFormSchema.parse(values)).toMatchObject({ mainManagerId, deputyManagerId: emptyGuid });
});
