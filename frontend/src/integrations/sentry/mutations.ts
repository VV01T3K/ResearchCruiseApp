import * as Sentry from '@sentry/react';

import { ApiError } from '@/api/errors';

function rootCause(error: unknown): unknown {
  return error instanceof Error && !(error instanceof ApiError) && error.cause ? rootCause(error.cause) : error;
}

export function isUnexplainedFailure(error: unknown): boolean {
  const cause = rootCause(error);
  if (cause instanceof ApiError) {
    const problem = cause.problem ?? {};
    const explained =
      'errorCode' in problem ||
      Object.values(problem.errors ?? {})
        .flat()
        .some((message) => message.trim());
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

const reportedRefusalsKey = 'sentry.reportedRefusals';

function markFirstReport(key: string): boolean {
  try {
    const reported = JSON.parse(sessionStorage.getItem(reportedRefusalsKey) ?? '[]') as string[];
    if (reported.includes(key)) return false;
    sessionStorage.setItem(reportedRefusalsKey, JSON.stringify([...reported, key]));
  } catch {
    return true;
  }
  return true;
}

export function captureHandledRefusal(operation: string, error: unknown): void {
  const cause = rootCause(error);
  if (!(cause instanceof ApiError) || cause.status < 400 || cause.status >= 500) return;
  if (!markFirstReport(`${operation}:${cause.status}`)) return;
  Sentry.captureMessage(`Handled ${operation} refusal (HTTP ${cause.status})`, {
    level: 'warning',
    fingerprint: ['handled-refusal', operation, String(cause.status)],
    tags: { operation, 'http.status_code': cause.status },
  });
}
