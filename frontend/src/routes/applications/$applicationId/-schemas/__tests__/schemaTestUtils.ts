import { expect } from 'vitest';
import type { ZodType } from 'zod';

export function override<T>(row: T, field: string, value: unknown): T {
  return { ...row, [field]: value } as T;
}

export function createSchemaAssertions(schema: ZodType) {
  return {
    expectRejectedAt: (payload: unknown, path: string) => {
      const result = schema.safeParse(payload);
      expect(result.success, `expected payload to be rejected because of "${path}"`).toBe(false);

      if (!result.success) {
        const paths = result.error.issues.map((issue) => issue.path.join('.'));
        expect(
          paths.some((issuePath) => issuePath === path || issuePath.startsWith(path)),
          `issue paths were: ${paths.join(', ')}`
        ).toBe(true);
      }
    },
    expectAccepted: (payload: unknown) => {
      const result = schema.safeParse(payload);
      if (!result.success) {
        const details = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
        expect.fail(`expected payload to be accepted, but got: ${details}`);
      }
    },
  };
}
