import { expect, it } from 'vite-plus/test';
import { createFormBreadcrumb, parseSampleRate, scrubSensitiveUrls } from '@/integrations/sentry/utils';

it.each(['', 'Infinity', 'invalid', '10%'])('falls back for unusable sample rate %j', (value) => {
  expect(parseSampleRate(value, 0.1)).toBe(0.1);
});
it.each([
  ['0', 0],
  ['0.25', 0.25],
] as const)('uses explicit sample rate %s', (value, expected) => {
  expect(parseSampleRate(value, 0.1)).toBe(expected);
});
it('reports failing field names without leaking their values or error text', () => {
  const breadcrumb = createFormBreadcrumb('form-a', 'invalid', {
    fieldMeta: {
      supervisorEmail: { errors: [{ message: 'private@example.com' }] },
      note: { errors: [] },
    },
  });
  expect(breadcrumb).toEqual({
    category: 'form',
    message: 'form.submit.invalid',
    level: 'warning',
    data: {
      form_name: 'form-a',
      form_outcome: 'invalid',
      form_error_fields: 'supervisorEmail',
      form_error_count: 1,
    },
  });
});
it('filters token query parameters from URLs anywhere in an event', () => {
  const event = {
    request: { url: 'https://app/reset-password?emailBase64=YUBi&resetCode=SECRET' },
    contexts: { feedback: { url: 'https://app/reset-password?%65mailBase64=YUBi&%72esetCode=SECRET&lang=pl' } },
    transaction: 'GET /confirm-email?%63ode=Z',
    breadcrumbs: [
      { data: { from: '/cruise-approval?cruiseApplicationId=7&supervisorCode=X', to: '/confirm-email?code=Y' } },
    ],
  };
  expect(scrubSensitiveUrls(event)).toEqual({
    request: { url: 'https://app/reset-password?emailBase64=YUBi&resetCode=[Filtered]' },
    contexts: {
      feedback: { url: 'https://app/reset-password?%65mailBase64=YUBi&%72esetCode=[Filtered]&lang=pl' },
    },
    transaction: 'GET /confirm-email?%63ode=[Filtered]',
    breadcrumbs: [
      {
        data: {
          from: '/cruise-approval?cruiseApplicationId=7&supervisorCode=[Filtered]',
          to: '/confirm-email?code=[Filtered]',
        },
      },
    ],
  });
});
