import * as Sentry from '@sentry/react';
import { CancelledError } from '@tanstack/react-query';
import { isNotFound, isRedirect } from '@tanstack/react-router';

import { ApiError } from '@/api/errors';

let pageIsLeaving = false;
globalThis.addEventListener?.('pagehide', () => (pageIsLeaving = true));
globalThis.addEventListener?.('pageshow', () => (pageIsLeaving = false));

export function rootCause(error: unknown): unknown {
  return error instanceof Error && !(error instanceof ApiError) && error.cause ? rootCause(error.cause) : error;
}

export function classifyError(error: unknown) {
  if (isNotFound(error) || isRedirect(error)) return 'control-flow';
  const cause = rootCause(error);
  if (cause instanceof ApiError) {
    if (cause.status === 401) return 'session';
    if (cause.status === 403 || cause.status === 404) return 'no-access';
    return cause.status < 500 ? 'refused' : 'server';
  }
  if (cause instanceof CancelledError || (cause instanceof Error && cause.name === 'AbortError')) return 'aborted';
  if (cause instanceof TypeError && /^(Failed to fetch|NetworkError|Load failed)/.test(cause.message)) {
    return pageIsLeaving ? 'aborted' : 'network';
  }
  return 'unknown';
}

export function isRetryableFailure(failureCount: number, error: unknown): boolean {
  const kind = classifyError(error);
  return failureCount < 1 && (kind === 'server' || kind === 'network');
}

export function isUnexplainedFailure(error: unknown): boolean {
  const kind = classifyError(error);
  const cause = rootCause(error);
  if (kind === 'server' && cause instanceof ApiError) {
    const problem = cause.problem ?? {};
    return !(
      'errorCode' in problem ||
      Object.values(problem.errors ?? {})
        .flat()
        .some((message) => message.trim())
    );
  }
  return kind === 'network' || kind === 'unknown';
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

const reportedRefusals = new Set<string>();

function markFirstReport(key: string): boolean {
  if (reportedRefusals.has(key)) return false;
  reportedRefusals.add(key);
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
  const kind = classifyError(cause);
  if (!(cause instanceof ApiError) || (kind !== 'no-access' && kind !== 'refused')) return;
  if (!markFirstReport(`${operation}:${cause.status}`)) return;
  const refusal = new Error('Expected refusal shown to the user');
  refusal.name = `Handled ${operation} refusal (HTTP ${cause.status})`;
  Sentry.captureException(refusal, {
    level: 'warning',
    fingerprint: ['handled-refusal', operation, String(cause.status)],
    tags: { operation, 'http.status_code': cause.status },
  });
}
