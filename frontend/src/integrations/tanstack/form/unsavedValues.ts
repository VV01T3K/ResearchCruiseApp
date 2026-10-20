import { accountId, getSession } from '@/integrations/auth/session';

const prefix = 'unsaved-form:';

function currentAccount() {
  const session = getSession();
  return session && accountId(session);
}

export const unsavedValues = {
  get: (key: string) => {
    const json = sessionStorage.getItem(prefix + key);
    const saved = json
      ? (JSON.parse(json) as { account?: string; values: Record<string, unknown>; cleared?: string[] })
      : undefined;
    // Session storage outlives the page, so another account may have signed in since.
    if (!saved || saved.account !== currentAccount()) return undefined;
    return { ...saved.values, ...Object.fromEntries((saved.cleared ?? []).map((name) => [name, undefined])) };
  },
  set: (key: string, values: Record<string, unknown>) => {
    try {
      // JSON drops undefined values, so cleared fields (e.g. a removed scan) are listed separately.
      const cleared = Object.keys(values).filter((name) => values[name] === undefined);
      sessionStorage.setItem(prefix + key, JSON.stringify({ account: currentAccount(), values, cleared }));
    } catch {
      // Over the storage quota, e.g. with large scans: keep nothing rather than an older copy.
      sessionStorage.removeItem(prefix + key);
    }
  },
  delete: (key: string) => sessionStorage.removeItem(prefix + key),
  clear: () =>
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => sessionStorage.removeItem(key)),
};
