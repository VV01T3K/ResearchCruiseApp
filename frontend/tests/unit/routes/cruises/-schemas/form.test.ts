import { expect, it } from 'vite-plus/test';
import { cruise } from '@tests/data/cruises';
import { manager, deputy } from '@tests/data/accounts';
import { CruiseFormSchema, mapCruiseToValues } from '@/routes/cruises/-schemas/form.schema';

it('writes the shared create/update cruise API shape', () => {
  expect(CruiseFormSchema.parse(mapCruiseToValues(cruise()))).toEqual({
    startDate: '2026-06-01T08:00:00Z',
    endDate: '2026-06-02T11:00:00Z',
    mainManagerId: manager.id,
    deputyManagerId: deputy.id,
    cruiseApplicationIds: [],
    title: 'Bałtyk',
    shipUnavailable: false,
  });
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
