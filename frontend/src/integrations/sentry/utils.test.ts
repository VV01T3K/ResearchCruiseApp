import { describe, expect, it } from 'vite-plus/test';
import { createFormBreadcrumb, parseSampleRate } from './utils';

describe('parseSampleRate', () => {
  it.each([
    ['', 0.1],
    ['abc', 0.1],
    ['10%', 0.1],
    ['0', 0],
    ['0.25', 0.25],
  ])('parses %j with the staging fallback', (value, expected) => {
    expect(parseSampleRate(value, 0.1)).toBe(expected);
  });
});

describe('createFormBreadcrumb', () => {
  it('records field names and counts without field values', () => {
    const breadcrumb = createFormBreadcrumb('login', 'invalid', {
      fieldMeta: {
        email: { errors: ['invalid@example.com'] },
        password: { errors: ['SuperSecret123'] },
        untouched: { errors: [] },
      },
    });
    const serialized = JSON.stringify(breadcrumb);

    expect(breadcrumb.data).toEqual({
      form_name: 'login',
      form_outcome: 'invalid',
      form_error_fields: 'email, password',
      form_error_count: 2,
    });
    expect(serialized).not.toContain('invalid@example.com');
    expect(serialized).not.toContain('SuperSecret123');
  });
});
