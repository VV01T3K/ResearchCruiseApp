import type { CurrentUserResponse, TokenResponse } from '@/api/generated/schemas';

export const manager = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'ada@example.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
};
export const deputy = {
  id: '22222222-2222-4222-8222-222222222222',
  email: 'grace@example.com',
  firstName: 'Grace',
  lastName: 'Hopper',
};
export const admin = {
  ...manager,
  roles: ['Administrator', 'CruiseManager'],
  emailConfirmed: true,
  accepted: true,
} satisfies CurrentUserResponse;

export function session(expiresIn = 86_400_000): TokenResponse {
  return {
    accessToken: 'test-access-token',
    accessTokenExpirationDate: new Date(Date.now() + expiresIn).toISOString(),
    refreshTokenExpirationDate: new Date(Date.now() + expiresIn).toISOString(),
  };
}
