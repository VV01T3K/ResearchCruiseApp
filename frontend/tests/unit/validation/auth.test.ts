import { expect, it } from 'vite-plus/test';
import { loginValidationSchema } from '@/validation/auth';

it('accepts email aliases without imposing registration password rules on login', () => {
  expect(loginValidationSchema.parse({ email: 'ada+cruise@example.com', password: 'legacy' })).toEqual({
    email: 'ada+cruise@example.com',
    password: 'legacy',
  });
});
it.each([
  ['email', { email: 'ada@', password: 'password' }],
  ['password', { email: 'ada@example.com', password: '' }],
])('attaches invalid credentials to the %s field', (field, input) => {
  expect(loginValidationSchema.safeParse(input)).toMatchObject({
    success: false,
    error: { issues: [expect.objectContaining({ path: [field] })] },
  });
});
