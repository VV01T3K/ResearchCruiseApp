const prefix = 'unsaved-form:';

export const unsavedValues = {
  get: (key: string) => {
    const json = sessionStorage.getItem(prefix + key);
    return json ? (JSON.parse(json) as Record<string, unknown>) : undefined;
  },
  set: (key: string, values: Record<string, unknown>) => {
    try {
      sessionStorage.setItem(prefix + key, JSON.stringify(values));
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
