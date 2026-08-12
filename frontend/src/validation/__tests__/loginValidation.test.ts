import { describe, expect, it } from 'vitest';

import { loginValidationSchema } from '@/validation/auth';

describe('loginValidationSchema', () => {
  it('accepts empty fields for initial state', () => {
    const result = loginValidationSchema.safeParse({ email: '', password: '' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid emails', () => {
    const invalidEmails = ['only-text', 'invalid@domain', 'invalid@domain.', 'invalid@domain..com'];

    for (const email of invalidEmails) {
      const result = loginValidationSchema.safeParse({ email, password: 'x' });
      expect(result.success).toBe(false);
    }
  });

  it('accepts a valid email format', () => {
    const result = loginValidationSchema.safeParse({ email: 'valid-email@gmail.com', password: 'x' });
    expect(result.success).toBe(true);
  });
});
