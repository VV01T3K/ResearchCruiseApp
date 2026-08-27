import { describe, expect, it } from 'vitest';

import { loginValidationSchema } from '@/validation/auth';

describe('loginValidationSchema', () => {
  it('rejects empty credentials', () => {
    const result = loginValidationSchema.safeParse({ email: '', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(['email', 'password']);
    }
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
