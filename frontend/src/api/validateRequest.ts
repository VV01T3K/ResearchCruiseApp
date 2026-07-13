import * as Sentry from '@sentry/react';

type Schema<T> = {
  parse: (value: unknown) => T;
};

export class ApiContractError extends Error {
  constructor(schemaName: string) {
    super(`Generated API request validation failed: ${schemaName}`);
    this.name = 'ApiContractError';
  }
}

export function validateRequest<T>(schemaName: string, schema: Schema<T>, value: unknown): T {
  try {
    return schema.parse(value);
  } catch {
    const error = new ApiContractError(schemaName);
    Sentry.captureException(error);
    throw error;
  }
}
