import * as Sentry from '@sentry/react';

import { ApiError } from '@/api/errors';

function rootCause(error: unknown): unknown {
  return error instanceof Error && !(error instanceof ApiError) && error.cause ? rootCause(error.cause) : error;
}

export function isUnexplainedFailure(error: unknown): boolean {
  const cause = rootCause(error);
  if (cause instanceof ApiError) {
    const { detail, errors } = cause.problem ?? {};
    const explained = [detail, ...Object.values(errors ?? {}).flat()].some((message) => message?.trim());
    return cause.status >= 500 && !explained;
  }
  return !(cause instanceof Error && cause.name === 'AbortError');
}

export function captureMutationFailure(error: unknown, mutationKey: readonly unknown[] | undefined): void {
  if (!isUnexplainedFailure(error)) return;
  const operation = mutationKey?.[0];
  const cause = rootCause(error);
  Sentry.captureException(error, {
    tags: {
      'mutation.key': typeof operation === 'string' ? operation : undefined,
      'http.status_code': cause instanceof ApiError ? cause.status : undefined,
    },
  });
}
