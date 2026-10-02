import type { ProblemDetails } from '@/api/generated/schemas';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly problem?: ProblemDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function responseErrorMessage(status: number, body: unknown): string {
  const problem = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : undefined;
  const messages =
    problem?.errors && typeof problem.errors === 'object'
      ? Object.values(problem.errors)
          .flat()
          .filter((message): message is string => typeof message === 'string' && !!message.trim())
      : [];
  const detail = typeof problem?.detail === 'string' ? problem.detail.trim() : '';
  if (detail || messages.length) return [...new Set([detail, ...messages].filter(Boolean))].join('\n');
  // The API explains every failure in `detail`; this covers proxies and other non-API responses.
  return status >= 500
    ? `Błąd serwera (${status}). Spróbuj ponownie później.`
    : `Żądanie nie powiodło się (HTTP ${status}).`;
}

export function getProblemDetail(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.cause) return getProblemDetail(error.cause, fallback);
  if (error instanceof TypeError) return 'Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.';
  return error instanceof Error && error.message ? error.message : fallback;
}

export function getErrorMessage(error: unknown, context: string) {
  return `${context}: ${getProblemDetail(error, 'Nieznany błąd. Spróbuj ponownie.')}`;
}
