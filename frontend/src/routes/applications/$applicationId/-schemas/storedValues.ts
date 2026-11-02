type Stored = string | null | undefined;

// An unreadable value stays in the form as its raw string: the schemas reject it on save and the field asks for a fix.
export function storedNumber(value: Stored): number {
  if (value === null || value === undefined || value.trim() === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : (value as unknown as number);
}

export function storedNullableNumber(value: Stored): number | null {
  return value === null || value === undefined || value.trim() === '' ? null : storedNumber(value);
}

// The backend's ToBool follows the same rule.
export function storedBoolean(value: Stored): boolean {
  if (value === null || value === undefined) return false;
  const normalized = value.toLowerCase();
  if (normalized === 'true') return true;
  return normalized === 'false' ? false : (value as unknown as boolean);
}
