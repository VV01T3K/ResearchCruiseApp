import * as Sentry from '@sentry/react';
import { CancelledError } from '@tanstack/react-query';
import { isNotFound, isRedirect } from '@tanstack/react-router';

import { ApiError } from '@/api/errors';

let pageIsLeaving = false;
globalThis.addEventListener?.('pagehide', () => (pageIsLeaving = true));
globalThis.addEventListener?.('pageshow', () => (pageIsLeaving = false));

function causeChain(error: unknown): unknown[] {
  const chain = [error];
  for (let next = error; next instanceof Error && !(next instanceof ApiError) && next.cause && chain.length < 10;) {
    chain.push((next = next.cause));
  }
  return chain;
}

function classifyOne(error: unknown) {
  if (isNotFound(error) || isRedirect(error)) return 'control-flow';
  if (error instanceof ApiError) {
    if (error.status === 401) return 'session';
    if (error.status === 403 || error.status === 404) return 'no-access';
    if (error.status === 409) return 'refused';
    return error.status < 500 ? 'client' : 'server';
  }
  if (error instanceof CancelledError || (error instanceof Error && error.name === 'AbortError')) return 'aborted';
  if (error instanceof TypeError && /^(Failed to fetch|NetworkError|Load failed)/.test(error.message)) {
    return pageIsLeaving ? 'aborted' : 'network';
  }
  return 'unknown';
}

export function rootCause(error: unknown): unknown {
  return causeChain(error).find((cause) => classifyOne(cause) !== 'unknown') ?? error;
}

export function classifyError(error: unknown) {
  return classifyOne(rootCause(error));
}

export function isRetryableFailure(failureCount: number, error: unknown): boolean {
  const kind = classifyError(error);
  return failureCount < 1 && (kind === 'server' || kind === 'network');
}

export function isReportableFailure(error: unknown): boolean {
  return ['server', 'client', 'network', 'unknown'].includes(classifyError(error));
}

function isFormValidation(error: unknown): boolean {
  const cause = rootCause(error);
  return (
    classifyError(cause) === 'client' &&
    cause instanceof ApiError &&
    Object.values(cause.problem?.errors ?? {})
      .flat()
      .some((message) => message.trim())
  );
}

export function captureMutationFailure(error: unknown, mutationKey: readonly unknown[] | undefined): void {
  if (!isReportableFailure(error) || isFormValidation(error)) return;
  const operation = mutationKey?.[0];
  const cause = rootCause(error);
  Sentry.captureException(error, {
    tags: {
      'mutation.key': typeof operation === 'string' ? operation : undefined,
      'http.status_code': cause instanceof ApiError ? cause.status : undefined,
    },
  });
}

// The SDK marks a captured error object, so a suspense query's error rethrown to a boundary isn't sent again.
export function captureQueryFailure(error: unknown, queryKey: readonly unknown[]): void {
  if (!isReportableFailure(error)) return;
  const cause = rootCause(error);
  Sentry.captureException(error, {
    tags: {
      'query.key': queryKey.filter((part) => typeof part === 'string').join('/'),
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
  if (!(cause instanceof ApiError) || !['no-access', 'refused'].includes(kind)) return;
  if (!markFirstReport(`${operation}:${cause.status}`)) return;
  const refusal = new Error('Expected refusal shown to the user');
  refusal.name = `Handled ${operation} refusal (HTTP ${cause.status})`;
  Sentry.captureException(refusal, {
    level: 'warning',
    fingerprint: ['handled-refusal', operation, String(cause.status)],
    tags: { operation, 'http.status_code': cause.status },
  });
}
