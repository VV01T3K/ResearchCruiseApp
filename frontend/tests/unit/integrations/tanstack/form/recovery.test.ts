import { beforeEach, expect, it, vi } from 'vite-plus/test';
import { admin, outsider, session } from '@tests/data/accounts';

vi.mock('@/config', () => ({ default: { apiUrl: 'https://api.test' } }));
let auth: typeof import('@/integrations/auth/session');
let recovery: typeof import('@/integrations/tanstack/form/recovery');
const values = { revision: 'AAAAAAAAB9E=', note: 'Niezapisana notatka' };

function signIn(id: string) {
  const claims = { 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': id };
  auth.setSession({ ...session(), accessToken: `header.${btoa(JSON.stringify(claims))}.signature` });
}

function loseSessionWith(isDirty: boolean) {
  signIn(admin.id);
  const unregister = recovery.registerRecoverableForm('app/formB', { state: { isDirty, values } } as never);
  auth.setSession(undefined);
  unregister();
}

beforeEach(async () => {
  vi.resetModules();
  auth = await import('@/integrations/auth/session');
  recovery = await import('@/integrations/tanstack/form/recovery');
});

it('offers dirty values with their read revision to the same account and form only', () => {
  loseSessionWith(true);
  expect(recovery.getFormRecovery('app/formB')).toBeUndefined();
  signIn(admin.id);
  expect(recovery.getFormRecovery('app/formC')).toBeUndefined();
  expect(recovery.getFormRecovery('app/formB')).toEqual(values);
  recovery.clearFormRecovery('app/formB');
  expect(recovery.getFormRecovery('app/formB')).toBeUndefined();
});

it.each([
  ['another account signs in', () => signIn(outsider.id)],
  ['the user signs out', () => auth.completeLogout()],
])('forgets the values when %s', (_, end) => {
  loseSessionWith(true);
  end();
  signIn(admin.id);
  expect(recovery.getFormRecovery('app/formB')).toBeUndefined();
});

it('keeps nothing for an unchanged form', () => {
  loseSessionWith(false);
  signIn(admin.id);
  expect(recovery.getFormRecovery('app/formB')).toBeUndefined();
});
