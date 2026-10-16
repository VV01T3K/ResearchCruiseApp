import type { CurrentUserResponse, PublicationResponse, TokenResponse } from '@/api/generated/schemas';

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
export const managerAccount = { ...admin, roles: ['CruiseManager'] } satisfies CurrentUserResponse;
export const deputyAccount = { ...admin, ...deputy, roles: ['CruiseManager'] } satisfies CurrentUserResponse;
/** An administrator who is neither the manager nor the deputy of the test application. */
export const outsider = {
  ...admin,
  id: '55555555-5555-4555-8555-555555555555',
  email: 'alan@example.com',
  firstName: 'Alan',
  lastName: 'Turing',
  roles: ['Administrator'],
} satisfies CurrentUserResponse;

export function session(expiresIn = 86_400_000): TokenResponse {
  return {
    accessToken: 'test-access-token',
    accessTokenExpirationDate: new Date(Date.now() + expiresIn).toISOString(),
    refreshTokenExpirationDate: new Date(Date.now() + expiresIn).toISOString(),
  };
}

export function publication(): PublicationResponse {
  return {
    id: '77777777-7777-4777-8777-777777777777',
    category: 'subject',
    doi: '10.1000/example',
    authors: 'Ada Lovelace',
    title: 'Salinity',
    magazine: 'Journal',
    year: '2026',
    ministerialPoints: '100',
  };
}
