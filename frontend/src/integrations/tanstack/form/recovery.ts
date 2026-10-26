import type { AnyFormApi } from '@tanstack/react-form';

import { accountId, getSession, subscribeAuthDetails } from '@/integrations/auth/session';

let owner: string | undefined;
let activeForm: { key: string; form: Pick<AnyFormApi, 'state'> } | undefined;
const recoveries = new Map<string, Record<string, unknown>>();

subscribeAuthDetails((details, previous) => {
  if (details) {
    if (owner && accountId(details) !== owner) discardFormRecovery();
    return;
  }
  const previousOwner = previous && accountId(previous);
  if (!previousOwner || !activeForm?.form.state.isDirty) return;
  if (owner !== previousOwner) recoveries.clear();
  owner = previousOwner;
  recoveries.set(activeForm.key, activeForm.form.state.values);
});

export function registerRecoverableForm(key: string, form: Pick<AnyFormApi, 'state'>) {
  const registration = { key, form };
  activeForm = registration;
  return () => {
    if (activeForm === registration) activeForm = undefined;
  };
}

export function getFormRecovery(key: string) {
  const session = getSession();
  return owner && session && accountId(session) === owner ? recoveries.get(key) : undefined;
}

export function clearFormRecovery(key: string) {
  recoveries.delete(key);
}

export function discardFormRecovery() {
  owner = undefined;
  recoveries.clear();
}
