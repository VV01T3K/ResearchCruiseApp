import { expect, test, vi } from 'vitest';

import { FormADto } from './dto/FormADto';
import { formARequest } from './ApplicationFormsApiHooks';

vi.mock('@/config', () => ({ default: { apiUrl: 'http://api.test/' } }));

test('normalizes empty optional Form A periods and dates', () => {
  const request = formARequest(
    {
      acceptablePeriod: '',
      optimalPeriod: '',
      precisePeriodStart: '',
      precisePeriodEnd: '',
    } as FormADto,
    false
  );

  expect(request.form).toMatchObject({
    acceptablePeriod: null,
    optimalPeriod: null,
    precisePeriodStart: null,
    precisePeriodEnd: null,
  });
});
